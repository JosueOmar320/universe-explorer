# Universe Explorer

[![CI/CD](https://github.com/JosueOmar320/universe-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/JosueOmar320/universe-explorer/actions/workflows/ci.yml)

**Live demo:** https://josueomar320.github.io/universe-explorer/

A multi-universe frontend playground. Each "universe" consumes a different public API and ships
its own visual identity, while sharing a common shell, data layer and component foundation.

> Work in progress — built incrementally, one reviewable commit at a time.

| Universe       | API                                                 | Status    |
| -------------- | --------------------------------------------------- | --------- |
| Rick and Morty | [rickandmortyapi.com](https://rickandmortyapi.com/) | Available |
| Pokémon        | [pokeapi.co](https://pokeapi.co/)                   | Planned   |
| Star Wars      | [swapi.info](https://swapi.info/) (SWAPI mirror)    | Available |
| Harry Potter   | [PotterDB](https://potterdb.com/) (replaces Marvel) | Available |

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (strict, `noUncheckedIndexedAccess`)
- [Vite](https://vite.dev) for dev server and bundling
- [React Router](https://reactrouter.com) (data router) — URL state, nested layouts, lazy routes, error boundaries
- [TanStack Query](https://tanstack.com/query) — caching, request deduplication, retries, pagination, prefetching
- [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) — English and Spanish, type-checked keys
- CSS Modules + CSS custom properties (design tokens) — no UI kit, every component is hand-built
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) + [MSW](https://mswjs.io) for tests
- [Oxlint](https://oxc.rs) (incl. `jsx-a11y`) and [Prettier](https://prettier.io)

## Architecture

```
                         App shell (router, providers)
                                    │
           ┌────────────────────────┼─────────────────────────┐
     Universe registry          Universes                    i18n
   (metadata + status)     (feature folders)          (src/locales/<lang>)
                                    │
                    service → queryOptions → hooks → UI
                                    │
                   API client (src/config/apis.ts)
```

```
src/
├── app/                      # Wiring: providers, router, shell, hub pages
│   ├── App.tsx               # I18nextProvider + QueryClientProvider + RouterProvider
│   ├── router.tsx            # Route tree (universe routes are derived from the registry)
│   ├── queryClient.ts        # Global caching and retry policy
│   ├── layout/AppShell.tsx   # Header, switchers, footer, [data-universe] theming hook
│   ├── components/           # Shell-only components (UniverseSwitcher, LanguageSwitcher…)
│   └── pages/                # Home (hub), 404, route error boundary
├── config/
│   └── apis.ts               # Base URL + timeout of every external API (env-overridable)
├── i18n/                     # i18next instance, supported languages, resources
├── locales/
│   ├── en/                   # common.json (shell + shared UI), rickAndMorty.json, …
│   └── es/
├── shared/                   # Universe-agnostic building blocks
│   ├── api/                  # createApiClient, HttpError, error classification
│   ├── components/           # Button, BackLink, Pagination, form fields, QueryErrorState…
│   ├── hooks/                # usePageParam, useUrlFilters, useResultsFocus, useFocusOnPathChange
│   ├── icons/                # Inline SVG icons
│   ├── styles/               # Design tokens + global styles
│   └── utils/                # Pure helpers (cx, pagination range, pickOption)
├── universes/
│   ├── registry.ts           # Every universe: name, status, accent colour
│   ├── routes.ts             # Route tree of each *available* universe (type-checked)
│   └── rick-and-morty/       # Everything specific to one universe
│       ├── api/              # DTO types, service, query keys/options
│       ├── hooks/            # useCharacters, useCharacter, useEpisodes, useCharacterFilters
│       ├── components/       # CharacterCard, PortalHero, StatusBadge…
│       ├── layout/           # Universe entry: loads theme + fonts
│       ├── pages/            # Route components
│       ├── test/             # Fixtures + MSW handlers mimicking the real API
│       ├── filters.ts        # Filter options + URL parsing
│       ├── paths.ts          # Typed route builders
│       ├── routes.ts         # Lazy route tree
│       └── theme.css         # Token overrides under [data-universe='rick-and-morty']
├── test/                     # Test setup, MSW server, render helpers
└── types/                    # Global type augmentations (env, i18next, CSS custom props)
```

**Dependency rule:** `app` → `universes` → `shared`. Shared code never imports from a
universe, and universes never import from each other.

### What is shared and what stays in a universe

Shared code is what every universe needs _the same way_: the HTTP client, error handling,
pagination, URL-backed filters, form controls, loading/empty/error states. Anything that
expresses a universe's identity — cards, heroes, badges, layouts, copy — stays in its folder,
even if two universes end up with similar components. Duplicating a card is cheaper than a
"generic card" with a dozen props.

### Key decisions

- **Data fetching: TanStack Query, not RTK Query.** Every API here is public and read-only,
  so what matters is caching, deduplication, retries, pagination and prefetching — which
  TanStack Query covers without a global store. RTK Query would add Redux (store, provider,
  one reducer + middleware per API) to manage state the app doesn't have; its strengths
  (tag invalidation after mutations, sharing a store with client state) don't apply yet.
  Each universe's `queryOptions` factories keep query keys and fetchers in one place.
- **Configuration in one place.** API base URLs and timeouts live in `src/config/apis.ts` and
  can be overridden with `VITE_*` variables (see `.env.example`) — e.g. to route an
  API through a proxy or point it at a mock server.
- **Errors are classified, not just caught.** Network, timeout, rate-limit, not-found and
  server errors get specific messages; only transient ones are retried. While offline,
  queries pause and resume on reconnect, and the UI says so.
- **Universe registry as the single source of truth.** Navigation, the home page and the
  router derive from it. Marking a universe as available without registering its routes is a
  TypeScript error.
- **i18n by namespace.** `common` holds shell/shared copy; each universe has its own
  namespace. English is the reference: keys are type-checked and every language must provide
  the same keys at compile time. Data coming from the APIs is never translated.
- **Theming via design tokens.** Shared components only use CSS variables; each universe
  overrides them under `[data-universe]`.
- **State lives where it belongs.** Server state in TanStack Query, view state in the URL
  (`?name=&status=&page=`), the language choice in `localStorage`. No global client store.
- **Code splitting per universe.** Universe routes are lazy, so their JS, CSS and fonts load
  only when the user enters that universe.
- **Each API gets the fetching strategy it needs.** PokéAPI has no search and its list only
  returns names, so the app downloads the whole Pokédex index once (~9 kB gzipped) and
  searches/paginates it locally; each card then loads its own types through a cached,
  deduplicated query. Cards use 96px pixel sprites (~1–7 kB) instead of the official artwork
  (100–200 kB each), which would add several megabytes per page.
- **Server-side data when the dataset is big.** PotterDB has ~5,400 characters, so its
  JSON:API filters, sorting and pagination run on the server (repeated `filter[house_in][]`
  params included), with the next page prefetched because the API answers in ~1 s. The
  default view shows the 985 Hogwarts students instead of owls and one-off mentions.
- **No borrowed artwork.** SWAPI has no images, and the ones other projects use come from
  copyrighted wikis, so the Star Wars universe is purely typographic: data readouts and
  film "pips" instead of photos.
- **API-provided translations over our own.** PokéAPI ships official names in many
  languages (types, categories, Pokédex entries); those are shown in the selected language
  instead of being translated by the app.
- **API quirks are handled at the service boundary.** The Rick and Morty API returns 404 for
  "no results" (mapped to an empty page) and a bare object for single-id episode requests
  (normalized to an array).

### Accessibility

- Semantic landmarks, a skip link, and focus moved to `<main>` after route changes.
- Paging moves focus to the results heading; result counts are announced via a live region.
- Native controls for filters (radio group, `<select>`, search input) with visible labels.
- Text colours meet WCAG AA (≥ 4.5:1) on every surface; status is conveyed by text, not colour.
- `<html lang>` follows the selected language; language buttons are announced in their own
  language.
- `prefers-reduced-motion` disables animations.

### Adding a universe

1. Create `src/universes/<id>/` (`api/`, `components/`, `pages/`, `routes.ts`, `theme.css`).
2. Add its API to `src/config/apis.ts`.
3. Add a `src/locales/<lang>/<namespace>.json` per language and register it in
   `src/i18n/resources.ts`.
4. Set `status: 'available'` in `src/universes/registry.ts` and add its route to
   `src/universes/routes.ts` (TypeScript enforces both).

## Getting started

Requires Node.js `>= 22.22` (see `.nvmrc`).

```bash
npm install
npm run dev
```

Optional environment variables are documented in `.env.example`.

## Scripts

| Script                 | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                 |
| `npm run build`        | Type-check and build for production                       |
| `npm run preview`      | Serve the production build locally                        |
| `npm run typecheck`    | Run the TypeScript compiler (no emit)                     |
| `npm run lint`         | Lint with Oxlint (warnings fail the run)                  |
| `npm run format:check` | Verify formatting with Prettier                           |
| `npm test`             | Run the test suite once                                   |
| `npm run test:watch`   | Run tests in watch mode                                   |
| `npm run validate`     | Everything CI will run: lint, format, types, tests, build |

Each script is a separate step so the CI pipeline can run (and report) them individually.

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push to `main` and every
pull request:

```
npm ci → lint → format check → type-check → tests → build → deploy (main only)
```

- **Validate** (every run): Node.js from `.nvmrc`, cached npm downloads, one step per check.
  Lint and test failures show up as inline annotations on the pull request diff.
- **Deploy** (pushes to `main` only): runs only if validation passed and publishes _the same
  build_ that was validated to GitHub Pages — there is no second, unverified build.
- Read-only permissions by default; only the deploy job gets `pages: write` / `id-token: write`.
- Outdated pull request runs are cancelled; deployments from `main` are never interrupted.

### GitHub Pages specifics

- Project sites are served under `/<repo>/`, so CI builds with `BASE_PATH=/<repo>/`
  (Vite's `base`); the router picks it up from `import.meta.env.BASE_URL`.
- Pages has no SPA rewrites: `index.html` is copied to `404.html`, so deep links such as
  `/rick-and-morty/characters/1` boot the app (served with a 404 status, which is fine for
  this app but worth knowing for SEO).
- One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
  Pages on a private repository requires a paid GitHub plan; on Free, make the repo public.

## Testing

Tests live next to the code they cover (`*.test.ts(x)`) and query the DOM by role and
accessible name, so they also guard accessibility.

- **Unit:** pagination range, filter parsing, language detection, error classification,
  retry policy, episode grouping.
- **API layer:** the HTTP client (params, timeouts, cancellation) and the Rick and Morty service
  against [MSW](https://mswjs.io) handlers that reproduce the real API's quirks.
- **Components/hooks:** the debounced `SearchField` (including a keystroke race),
  `Pagination`, `useUrlFilters`.
- **Integration:** real pages in a memory router with a fresh QueryClient — pagination,
  filters and URL state, empty/error/offline states, list → detail → back, language switching
  and focus management.

## Roadmap

- [x] Project setup and tooling
- [x] App shell, universe registry and theming foundation
- [x] Rick and Morty: listing, search, filters, detail page
- [x] Tests (Vitest + Testing Library + MSW)
- [x] Architecture review: API config, i18n (EN/ES), error states, accessibility
- [x] CI: lint, typecheck, tests and build on GitHub Actions
- [x] CD: deploy `main` to GitHub Pages
- [x] Pokémon: Pokédex with local search, type filter and detail page
- [x] Star Wars: personnel archive with search, film/species filters and detail page
- [x] Harry Potter: registry with server-side search, house scope and detail page (replaces
      Marvel, whose public API was retired in late 2025)

## Disclaimer

Fan-made portfolio project. Characters, names and trademarks belong to their respective owners.
No official artwork or fonts are bundled; visuals are original CSS inspired by each universe.
