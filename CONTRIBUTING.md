# Contributing to Tokenzyme Indexer

Thanks for taking the time to contribute. This document covers how to get set up,
what we expect from a change, and how to get it merged.

By participating you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Before you start

Open an issue first for anything beyond a typo or an obvious bug fix, especially
changes to `schema.graphql` — entity changes ripple into `tokenzyme-core`'s Prisma
schema and into both clients.

Good first contributions:

- tests (there are none yet — see below);
- handling for edge cases in the log handlers;
- better logging and observability;
- documentation.

**Found a vulnerability?** Do not open an issue or a PR. Follow the private
disclosure process in [SECURITY.md](./SECURITY.md).

## Development setup

Requirements: Node.js 24+, Corepack, and a Postgres 17 server.

```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name postgres postgres:17.5
corepack enable
yarn
cp .env.template .env   # then fill it in — every variable is documented inline
yarn start:dev
```

Point it at Sonic testnet for the quickest useful setup: real data, small history.

```bash
yarn lint     # ESLint
yarn format   # Prettier
yarn build    # compile to ./lib
```

## Making a change

1. Fork the repository and branch off `main`.
2. Make your change. Keep it focused — one concern per pull request.
3. Run `yarn build`, `yarn lint` and `yarn format` before pushing.
4. Open a pull request describing what changed and why.

### Generated code

`src/model/generated` and `src/generated/abi` are generated **and committed**. Never
hand-edit them.

```bash
yarn generate:models   # from schema.graphql; also runs scripts/fixEntities.mjs
yarn generate:abi      # from abi/launchpad.json
```

Commit the regenerated output together with the change that caused it.

`abi/launchpad.json` is a manual copy of the launchpad ABI from
[`tokenzyme-contracts`](https://github.com/tokenzyme/tokenzyme-contracts). If you are
following a contract change, copy the new ABI in and regenerate — a changed event
signature means a changed topic hash, and the processor will silently stop matching
it otherwise.

### Coding conventions

- ESLint (Airbnb + strict type-checked) and Prettier are enforced. Run them.
- No default exports — `import/no-default-export` is on.
- **Handlers must not touch the database.** They accumulate into the `Models` batch
  and `src/index.ts` flushes it in one transaction per block range. Writing directly
  from a handler breaks ordering and reorg rollback.
- Amounts are `BigDecimal` throughout. Do not reintroduce raw wei into entities.
- Adding an event? Register its topic in `src/processor.ts` **and** dispatch it in
  `src/index.ts`. Missing either means the event is silently ignored.

### Changes that affect other repositories

Editing `schema.graphql` changes the tables `tokenzyme-core` reads. Say so
explicitly in your PR description and describe what needs to change in core's Prisma
models. The two schemas are kept in sync by hand — nothing will warn you if they
drift.

### On tests

This repository has no test suite. That is a gap, not a policy. A PR that
establishes one — even covering a single handler — is very welcome, and worth
opening an issue to discuss the approach first.

## Review

A maintainer will review your PR. Please be patient, and be prepared to justify
design decisions.

## License

By contributing, you agree that your contributions are licensed under the
[Apache License 2.0](./LICENSE) that covers this project.
