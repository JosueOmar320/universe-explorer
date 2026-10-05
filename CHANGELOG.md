# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- View transitions from a list to a detail page: the record's name morphs into the page heading
  (skipped with reduced motion and in browsers without support).

### Fixed

- The pagination of every list wrapped on narrow phones in Spanish ("Página 1 / 3"), squeezing
  its arrows away; below 480px the buttons now show only their arrows.
- Filter fields could not shrink below their input's intrinsic width, so a search with text
  overflowed a 320px screen.
- Tests waiting on the debounced search failed at random on loaded CI runners.

### Changed

- Dependabot ignores major updates of `@types/node` (they follow `.nvmrc`) and, for now, of msw.
- The Lighthouse job summary explains failed assertions, console errors and, for slow pages,
  the LCP element, its phases and the slowest requests.
- The Lighthouse performance score warns instead of failing the deploy: against the public APIs
  on shared runners it varied between runs of unchanged builds. CLS, TBT and byte budgets still
  fail it.

## [1.0.0] - 2026-10-04

First release: four universes, each on its own public API, inside one shell.

### Added

- **App shell**: universe registry driving navigation, routing and the home page; per-universe
  theming through design tokens; English and Spanish with a persisted language switcher.
- **Rick and Morty**: character census with server-side search, status/gender/species filters
  and pagination synced to the URL, and character detail pages with episodes.
- **Pokémon**: Pokédex with local search by name or number, type filter, official names in the
  selected language, and detail pages with stats and neighbours.
- **Star Wars**: personnel archive with search and film/species filters over cached SWAPI
  collections, and person detail pages (typographic design, no borrowed artwork).
- **Harry Potter** (replaces Marvel, whose public API was retired in late 2025): registry with
  server-side search, house scope and detail pages, seeded from cached list pages.
- **Global search**: ⌘K / Ctrl+K command palette that searches the four universes at once.
- **States**: loading skeletons, empty results, classified errors (network, timeout, rate limit,
  server, not found) with retry, offline state, and a route error boundary.
- **Accessibility**: skip link, focus management, live regions, WCAG AA contrast, native form
  controls and an accessible combobox.
- **Delivery**: GitHub Pages deploy with HTTP 200 entry points, per-universe preloads, favicon,
  apple-touch-icon and Open Graph link previews.
- **Quality**: Vitest + Testing Library + MSW (with coverage thresholds), Playwright end-to-end
  and axe accessibility tests on desktop and mobile, Lighthouse CI score and size budgets, a
  mock mode for offline development, and Dependabot.

[Unreleased]: https://github.com/JosueOmar320/universe-explorer/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/JosueOmar320/universe-explorer/releases/tag/v1.0.0
