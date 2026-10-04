# Universe Explorer

A multi-universe frontend playground. Each "universe" consumes a different public API and ships
its own visual identity, while sharing a common shell, data layer and component foundation.

> Work in progress — built incrementally, one reviewable commit at a time.

| Universe       | API                                                 | Status      |
| -------------- | --------------------------------------------------- | ----------- |
| Rick and Morty | [rickandmortyapi.com](https://rickandmortyapi.com/) | In progress |
| Pokémon        | [pokeapi.co](https://pokeapi.co/)                   | Planned     |
| Star Wars      | SWAPI                                               | Planned     |
| Marvel         | Marvel API (or alternative)                         | Planned     |

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (strict, `noUncheckedIndexedAccess`)
- [Vite](https://vite.dev) for dev server and bundling
- [React Router](https://reactrouter.com) (data router) — URL state, nested layouts, lazy routes, error boundaries
- [TanStack Query](https://tanstack.com/query) — caching, request deduplication, retries, pagination, prefetching
- CSS Modules + CSS custom properties (design tokens) — no UI kit, every component is hand-built
- [Oxlint](https://oxc.rs) (incl. `jsx-a11y`) and [Prettier](https://prettier.io)

## Architecture

```
src/
├── app/                      # Application wiring: providers, router, shell, hub pages
│   ├── App.tsx               # QueryClientProvider + RouterProvider
│   ├── router.tsx            # Route tree; universes plug in here
│   ├── queryClient.ts        # Global caching/retry policy
│   ├── layout/AppShell.tsx   # Header, universe switcher, footer, [data-universe] theming hook
│   ├── components/           # Shell-only components (UniverseSwitcher, UniverseCard…)
│   └── pages/                # Home (hub), 404, route error boundary
├── shared/                   # Universe-agnostic building blocks
│   ├── api/                  # fetchJson + HttpError
│   ├── components/           # Button, Pagination, Skeleton, StatusPanel
│   ├── hooks/                # usePageParam (URL-synced pagination)
│   ├── icons/                # Inline SVG icons
│   ├── styles/               # Design tokens + global styles
│   └── utils/                # Pure helpers (cx, pagination range)
├── universes/
│   ├── registry.ts           # Metadata for every universe (name, status, accent colour)
│   ├── types.ts
│   └── rick-and-morty/       # Everything specific to one universe
│       ├── api/              # DTO types, service, query keys/options
│       ├── hooks/            # useCharacters
│       ├── components/       # CharacterCard, PortalHero, StatusBadge…
│       ├── layout/           # Universe entry: loads theme + fonts
│       ├── pages/            # Route components
│       ├── routes.ts         # Lazy route tree for this universe
│       └── theme.css         # Token overrides under [data-universe='rick-and-morty']
└── types/                    # Global type augmentations
```

**Dependency rule:** `app` → `universes` → `shared`. Shared code never imports from a universe,
and universes never import from each other.

### Key decisions

- **Feature folders per universe.** Each universe owns its API layer, hooks, components, pages
  and theme, so a new universe is additive and can look completely different.
- **Theming via design tokens.** Shared components only use CSS variables. The shell sets
  `data-universe="<id>"` and each universe overrides tokens (colours, fonts, radii, backgrounds,
  button style). Universe-specific components can go further with their own styles.
- **Server state lives in TanStack Query**, UI state in the URL (`?page=`), and there is no
  global client store — nothing in the app needs one yet.
- **Code splitting per universe.** Universe routes are lazy, so their JS, CSS and fonts load
  only when the user enters that universe.
- **API quirks are handled at the service boundary.** The Rick and Morty API returns 404 for
  "no results"; the service maps it to an empty page so the UI shows an empty state, not an error.

### Adding a universe

1. Create `src/universes/<id>/` with `api/`, `components/`, `pages/`, `routes.ts`, `theme.css`.
2. Mark it as `available` in `src/universes/registry.ts`.
3. Register its route object in `src/app/router.tsx`.

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

## Roadmap

- [x] Project setup and tooling
- [x] App shell, universe registry and theming foundation
- [x] Rick and Morty: API layer and character listing with pagination
- [ ] Rick and Morty: search and filters (URL-synced)
- [ ] Rick and Morty: character detail page
- [ ] Tests (Vitest + Testing Library + MSW)
- [ ] CI: lint, typecheck, tests and build on GitHub Actions
- [ ] CD: deploy previews / production
- [ ] Pokémon, Star Wars and Marvel universes

## Disclaimer

Fan-made portfolio project. Characters, names and trademarks belong to their respective owners.
No official artwork or fonts are bundled; visuals are original CSS inspired by each universe.
