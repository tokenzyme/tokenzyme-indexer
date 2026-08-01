# Tokenzyme Indexer

The on-chain data pipeline for **Tokenzyme**, a permissionless token launchpad for
EVM chains. It follows the launchpad contract's event log, materializes it into
Postgres, and pushes live updates to connected clients over WebSocket.

Built on [Subsquid](https://docs.sqd.ai). Deployed against
[Sonic](https://soniclabs.com), but nothing here is chain-specific.

> New to the project? The system-wide overview lives in
> **[tokenzyme-core / ARCHITECTURE.md](https://github.com/tokenzyme/tokenzyme-core/blob/main/ARCHITECTURE.md)**.

## Table of contents

- [What it does](#what-it-does)
- [Data model](#data-model)
- [How it shares a database with the API](#how-it-shares-a-database-with-the-api)
- [Getting started](#getting-started)
- [Regenerating code](#regenerating-code)
- [Running with Docker](#running-with-docker)
- [Contributing](#contributing)
- [Security](#security)
- [Donations](#donations)
- [License](#license)

## What it does

The launchpad contract is the only source of truth. This service turns its events
into queryable rows, because reading a bonding curve's trade history straight off
the chain is far too slow to render a UI.

`EvmBatchProcessor` subscribes to six topics on the launchpad address and runs one
handler per event:

| Event | Handler | Effect |
| --- | --- | --- |
| `TokenLaunched` | `handleTokenLaunched` | Creates the `Token` row and its `SocialMedia` row, plus the creator's `Account`. |
| `MarketDataCreated` | `handleMarketDataCreated` | Seeds supply, reserves and opening price on the token. |
| `TokensBought` | `handleTokensBought` | Records a `BUY` trade with its average price and fee. |
| `TokensSold` | `handleTokensSold` | Records a `SELL` trade. |
| `MarketDataUpdated` | `handleMarketDataUpdated` | Updates reserves and current price after a trade. |
| `TokenMigrated` | `handleTokenMigrated` | Stamps `dexPoolAddress` and `migratedAt`, and records the `DexLiquidity` seeded into the pool. |

Handlers do not write to the database themselves. They accumulate into an in-memory
`Models` batch, and `src/index.ts` flushes the whole batch in one transaction per
block range. That keeps writes ordered and lets Subsquid roll back cleanly on a reorg.

Two things affect throughput:

- On `mainnet` and `testnet` the processor uses the **Subsquid archive gateway**,
  which serves historical logs far faster than any RPC endpoint. Backfilling from
  genesis over RPC alone takes hours; over the gateway it takes minutes.
- `FINALITY_CONFIRMATION` sets how many blocks to wait before treating data as
  final. Below that depth Subsquid handles reorgs by rolling back and reapplying.

### Live updates

After each batch commits, `src/ws.ts` broadcasts on a Socket.IO server on port
**3002**:

| Room | Payload |
| --- | --- |
| `tokens:<tokenAddress>:trades` | Each new trade — type, amounts, fee, average price. |
| `tokens:<tokenAddress>:updates` | New reserves, price, and DEX pool address once migrated. |

Clients subscribe per token, so a token page gets a live chart and trade feed
without polling. This is a **broadcast-only** channel: it never reads from clients
and requires no authentication.

## Data model

Entities are declared in `schema.graphql` and the TypeORM models are generated from
it into `src/model/generated`.

```
Account ──< Token ──< Trade
                 │
                 ├──── SocialMedia   (1:1, the token's links)
                 └──── DexLiquidity  (1:1, written at migration)
```

| Entity | Notes |
| --- | --- |
| `Account` | An address that created or traded a token. Just an ID. |
| `Token` | Metadata, supply, live reserves, current and final price, migration state. |
| `Trade` | One buy or sell against the bonding curve. |
| `SocialMedia` | Optional links supplied at launch. |
| `DexLiquidity` | Liquidity seeded into the DEX pool at migration. |

Amounts use `BigDecimal` — token amounts are already scaled down from wei by
`@subsquid/big-decimal`, so consumers never handle raw 18-decimal integers.

## How it shares a database with the API

This is the part that surprises people, so it is worth stating plainly.

**The indexer and [`tokenzyme-core`](https://github.com/tokenzyme/tokenzyme-core)
share one Postgres database, and one schema: `public`.**

**This service creates no tables.** Core's Prisma migrations define the whole schema,
including the on-chain tables this indexer fills — `accounts`, `tokens`, `trades`,
`social_media`, `dex_liquidities`. The indexer only writes rows into them.

That means **you must apply core's migrations before starting the indexer**
(`yarn prisma:migrate:deploy` in `tokenzyme-core`), or it has nowhere to write.

Both services must resolve to the same schema. Subsquid ignores any `?schema=`
parameter in `DB_URL` and always uses `public`, so core's `DB_URL` must not carry one
either — otherwise core reads from one schema while this service writes to another,
and every token query silently returns nothing.

## Getting started

Requirements: Node.js 24+, Corepack, and a Postgres 17 server.

```bash
# Start Postgres if you do not have one
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name postgres postgres:17.5

# Enable Corepack to use the Yarn version configured in the project
corepack enable

# Install all dependencies
yarn

# Copy the environment template and fill it in
cp .env.template .env
```

Every variable is documented inline in [`.env.template`](./.env.template). The ones
that matter most:

| Variable | Why it matters |
| --- | --- |
| `NETWORK` | `mainnet`, `testnet`, `testnet-legacy` or `fork`. Selects the archive gateway. |
| `RPC_URL` | Must match `NETWORK`. |
| `LAUNCHPAD_ADDRESS` | The **proxy** address of your own deployment — this project publishes none. See [tokenzyme-contracts](https://github.com/tokenzyme/tokenzyme-contracts#deploying). |
| `FROM_BLOCK` | The block the proxy was deployed in. Starting from `0` wastes hours on empty history. |
| `RPC_RATE_LIMIT` | Keep under your provider's limit; public endpoints throttle hard. |

Then run it:

```bash
yarn start:dev
```

There is no migration step here. The tables must already exist, created by
`yarn prisma:migrate:deploy` in
[`tokenzyme-core`](https://github.com/tokenzyme/tokenzyme-core).

To index against a local chain, run a mainnet fork from
[`tokenzyme-contracts`](https://github.com/tokenzyme/tokenzyme-contracts)
(`yarn test:fork:startNode`), deploy the contracts to it, and set `NETWORK="fork"`
with the resulting launchpad address.

```bash
yarn lint      # ESLint
yarn format    # Prettier
yarn build     # compile to ./lib
```

## Regenerating code

Two directories are generated and committed. Both need regenerating when the
contracts change.

```bash
# Rebuild TypeORM entities from schema.graphql into src/model/generated
yarn generate:models

# Rebuild typed event decoders from abi/launchpad.json into src/generated/abi
yarn generate:abi
```

> [!IMPORTANT]
> `abi/launchpad.json` is a **copy** of the launchpad ABI. It does not update itself.
> After changing an event in
> [`tokenzyme-contracts`](https://github.com/tokenzyme/tokenzyme-contracts), copy the
> new ABI over it and run `yarn generate:abi`, or the processor will silently stop
> matching the event whose topic hash changed.

`yarn generate:models` runs `scripts/fixEntities.mjs` afterwards to patch the
generated entities — do not bypass it by calling `squid-typeorm-codegen` directly.

## Running with Docker

Postgres is defined in core's compose file, and both stacks join a shared external
network:

```bash
docker network create tokenzyme
docker compose -f ../tokenzyme-core/compose.yaml up -d   # brings up Postgres + the API
docker compose up -d                                     # this service
```

To build and push an image, set `DOCKER_IMAGE` to your own fully-qualified tag — it
defaults to a bare local `tokenzyme-indexer:latest`, which is fine locally but is not
pushable anywhere. Log in to your registry first; the scripts do not do it for you.

```bash
export DOCKER_IMAGE=registry.example.com/you/tokenzyme-indexer:latest
docker login registry.example.com
yarn image:build
yarn image:publish
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Contributions are welcome — please open an
issue before starting on anything substantial.

## Security

Do **not** open a public issue for a vulnerability. Follow the disclosure process in
[SECURITY.md](./SECURITY.md).

## Related repositories

| Repository | Role |
| --- | --- |
| [tokenzyme-contracts](https://github.com/tokenzyme/tokenzyme-contracts) | The on-chain protocol. Emits the events this service consumes. |
| [tokenzyme-core](https://github.com/tokenzyme/tokenzyme-core) | GraphQL API. Reads this service's tables. |
| [tokenzyme-indexer](https://github.com/tokenzyme/tokenzyme-indexer) | This repository. |
| [tokenzyme-app](https://github.com/tokenzyme/tokenzyme-app) | React web front end. |
| [tokenzyme-mobile](https://github.com/tokenzyme/tokenzyme-mobile) | Flutter mobile app. |

## Donations

If this project helped you in any way, consider making a donation. It is not
expected and nothing here is gated behind it.

| Network | Address |
| --- | --- |
| EVM (Ethereum, Sonic, Base, Arbitrum, …) | `0x31c8EDeD9D516a7BD854457710B9629F13BBA4FD` |
| Solana | `HsgFMPqjzUwbsd7dyFp2vjfLLLN6eG2Et2H9qmCBEBng` |

> [!WARNING]
> Send only on a network listed above, and check the address against this page on
> GitHub rather than a copy elsewhere. Transfers cannot be reversed.

## License

Licensed under the [Apache License 2.0](./LICENSE). See [NOTICE](./NOTICE) for
attribution requirements.

### Trademarks

The license covers the source code. It does **not** grant rights to the "Tokenzyme"
name, logo, or other brand assets. You are free to fork and run this software, but
please do so under your own name and branding.
