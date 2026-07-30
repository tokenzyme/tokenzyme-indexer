# Security Policy

## Reporting a vulnerability

**Do not open a public issue, pull request or discussion for a security
vulnerability.**

Report it through GitHub's [private vulnerability reporting](https://github.com/tokenzyme/tokenzyme-indexer/security/advisories/new)
— the **Security** tab, then **Report a vulnerability**. That opens a private
advisory only you and the maintainers can see.

Please include a description of the issue, its impact, and steps to reproduce.

### What to expect

| Stage                                        | Target       |
| -------------------------------------------- | ------------ |
| Acknowledgement of your report               | 72 hours     |
| Initial assessment and severity triage       | 7 days       |
| Status update cadence while we work on a fix | every 7 days |

We will credit you in the advisory unless you ask us not to. There is no formal
bug bounty program at this time.

If the vulnerability is in the smart contracts rather than this service, report it
through [tokenzyme-contracts](https://github.com/tokenzyme/tokenzyme-contracts/blob/main/SECURITY.md)
instead — that is where the funds are.

## Supported versions

Only the `main` branch receives security fixes. There are no long-term support
branches.

## Deployment notes

Properties of this service that matter when you run it. None are undisclosed bugs,
but each will hurt you if you deploy without knowing about it.

### The WebSocket server is unauthenticated and broadcast-only

Port 3002 accepts any connection and emits every trade and token update to every
subscriber. This is intentional — the data is public on-chain anyway. But it means:

- **Set `CORS_ORIGIN` in production.** Unset, the server accepts any origin.
- Put it behind a reverse proxy with TLS and connection limits. There is no rate
  limiting, no authentication, and no backpressure handling in this service.

### It shares a database with the API

The indexer writes the on-chain tables that
[`tokenzyme-core`](https://github.com/tokenzyme/tokenzyme-core) reads. Anyone with
write access to this database can forge token and trade history that the API will
serve as authentic. Treat database credentials as a trust boundary for the whole
system, and do not expose Postgres beyond the application network.

### It trusts its RPC endpoint completely

Every row originates from logs returned by `RPC_URL` and, on `mainnet` and
`testnet`, from the Subsquid archive gateway. A malicious or compromised RPC
provider can feed fabricated events, and this service will index them without
question. Use an endpoint you control or trust.

### Reorg handling depends on `FINALITY_CONFIRMATION`

Below that depth Subsquid rolls back and reapplies. Set too low on a chain with
deep reorgs, finalized-looking data can turn out to be wrong. Set too high, the
UI lags behind the chain.

### Indexed metadata is attacker-controlled

Token names, symbols, descriptions, logo URLs and social links come from whoever
launched the token. The contract validates only lengths and URL prefixes. Anything
rendering this data must escape it and must not fetch `logoUrl` server-side without
SSRF protection.
