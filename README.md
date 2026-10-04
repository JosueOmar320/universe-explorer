# Universe Explorer

A multi-universe frontend playground. Each "universe" consumes a different public API and ships
its own visual identity, while sharing a common shell, data layer and component foundation.

> Work in progress — built incrementally, one reviewable commit at a time.

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (strict)
- [Vite](https://vite.dev) for dev server and bundling
- [Oxlint](https://oxc.rs) for linting (incl. `jsx-a11y` rules) and [Prettier](https://prettier.io) for formatting

## Getting started

Requires Node.js `>= 22.22` (see `.nvmrc`).

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite dev server                |
| `npm run build`        | Type-check and build for production      |
| `npm run preview`      | Serve the production build locally       |
| `npm run typecheck`    | Run the TypeScript compiler (no emit)    |
| `npm run lint`         | Lint with Oxlint (warnings fail the run) |
| `npm run format:check` | Verify formatting with Prettier          |

These scripts are intentionally granular so each one can become an independent CI step later.
