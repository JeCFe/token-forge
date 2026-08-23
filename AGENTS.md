# AI development conventions

These instructions apply to the entire repository.

## Project structure

Use a feature-first folder structure with colocated tests.

- Give every feature or utility its own directory.
- Name the directory after its primary public export.
- Keep the implementation and its tests together.
- Keep private supporting modules with the feature that owns them.
- Move genuinely shared helpers into their own directory under `src/utils`.

Examples:

```text
src/
  tokens/
    createTypography/
      createTypography.ts
      createTypography.test.ts
  utils/
    alias/
      alias.ts
      alias.test.ts
```

## Exports

- Each implementation or utility file must have one export.
- Give every feature, utility, and validation directory an `index.ts` that
  exports its public API. Barrel files are exempt from the one-export rule.
- Import across feature boundaries through the owning directory's `index.ts`.
- Keep private supporting modules out of the directory's `index.ts`.
- Use `src/index.ts` as the package-level public entry point, composed from the
  feature entry points.
- Give domain directories such as `tokens`, `utils`, and `validation` an
  `index.ts` that aggregates their public feature entry points.
- Import across domain boundaries through the domain entry point, for example
  `@/validation`. Within the same domain, use the relevant feature entry point
  to avoid a self-referencing domain barrel.
- Combine value and type imports from the same module in one declaration using
  inline `type` specifiers.
- Omit `.ts` extensions from import and re-export specifiers.
- Keep public package imports stable when reorganising internal files.
- Shared type declaration modules may contain multiple type exports when
  splitting them would create tightly coupled or circular modules.

## Tests

- Colocate each test file with the implementation it covers.
- Name tests `<implementation>.test.ts`.
- Move tests with their implementation during structural changes.
- Run formatting, type-checking, linting, tests, and the production build after
  a repository reorganisation.

## Structural changes

- Before a repository-wide reorganisation, show the proposed directory tree
  and migration scope to the user and wait for approval.
- Keep structural changes behaviour-neutral unless the user requests behaviour
  changes at the same time.
- Update internal imports and `src/index.ts`, then check for stale paths.
