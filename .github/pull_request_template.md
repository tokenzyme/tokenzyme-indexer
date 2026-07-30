## What does this change?

<!-- Describe the change and why it is needed. Link the issue it addresses. -->

Closes #

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Tooling / CI

## Impact on the data model

- [ ] No change to `schema.graphql`
- [ ] Changes `schema.graphql` — **describe what `tokenzyme-core`'s Prisma models need below**

<!-- The indexer's tables are read by tokenzyme-core. The two schemas are kept in
     sync by hand — nothing warns you when they drift. -->

## Checklist

- [ ] `yarn build` passes
- [ ] `yarn lint` passes
- [ ] `yarn format` has been run
- [ ] Generated code was regenerated with `yarn generate:models` / `yarn generate:abi` rather than hand-edited, and is committed
- [ ] New events are registered in **both** `src/processor.ts` and `src/index.ts`
- [ ] Log handlers still write only to the `Models` batch, never to the database directly
- [ ] This is not a security fix (those go through private disclosure — see SECURITY.md)
