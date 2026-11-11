# ADR 0001: Static prerender with query-param navigation

- **Status:** Accepted
- **Date:** 2025-11-10
- **Deciders:** SaisonTeller

## Context

SaisonTeller is a read-only reference calendar: 85 produce items, four locales (en/de/fr/it), two views (month, season), and a selectable month (1–12). There is no server-side state, no user data, and no dynamic content beyond the current date. The app must be hostable as plain static files with zero runtime dependencies.

Two structural questions had to be settled together:

1. **How to build and host** — anything dynamic (SSR server, SPA fallback) would contradict the "fully static, zero dependencies" constraint.
2. **How to represent navigation state** (month and view) — path segments (`/de/juli`, `/de/sommer`) vs. query parameters (`/de?m=7&view=season`).

Additionally, UI strings are a small, closed set (~24 keys × 4 languages) with no pluralization or ICU needs.

## Decision

1. **SvelteKit 2 + `@sveltejs/adapter-static`, everything prerendered.** `export const prerender = true` in the root layout; `prerender.entries = ['/', '/en', '/de', '/fr', '/it']`. Exactly five HTML documents are emitted.
2. **Month and view are query parameters, not path segments.** All controls (month strip, month/season toggle, language switcher) are real `<a href>` links carrying `?m=…&view=…`. Query parameters are read client-side from SvelteKit's `page` state (guarded for SSR), falling back to the current month in the prerendered HTML. (SvelteKit disables `url.searchParams` inside `load` during prerendering, which forced this approach and made it simpler than a load-based parse.)
3. **Hand-rolled typed i18n instead of an i18n library.** Dictionaries are `Record<StringKey, string>` per locale, with `StringKey` derived from the English dictionary; a vitest test asserts key parity. Month and season names come from `Intl.DateTimeFormat` per locale tag — no library needed.

## Alternatives considered

- **Path segments for month/view** (`/de/7`, `/de/sommer`): shareable and crawlable, but multiplies entries (`5 pages × 12 months × 2 views × 4 locales`) that would all need prerendering or an SPA fallback, and duplicates content across near-identical documents. Query params keep exactly five prerendered documents while remaining fully shareable.
- **Single-page app with hash routing** (`#/de?m=7`): avoids prerendering entirely, but loses SSR content for non-JS clients and looks worse in shared links.
- **i18n libraries (typesafe-i18n, Paraglide, svelte-i18n)**: would add a runtime or build-time dependency for a problem TypeScript + `Intl` already solve at this size.

## Consequences

- **Positive:** five static documents, zero runtime dependencies, instant hosting anywhere; deep links like `/fr?m=3&view=season` work; all navigation is plain links (accessible, prerenderable, no JS required to change month); locale coverage is compiler- and test-enforced.
- **Negative:** the prerendered HTML shows the build-date month until hydration corrects it from the real URL (accepted); the browser back/forward stack records every month click (acceptable for a browse-style app); adding a fifth locale means adding a dictionary, an entry in `prerender.entries`, and the language switcher (a deliberate, small checklist).

## Update (round 2, 2025-11-11)

The season view was removed in round 2: month navigation only, links carry `?m=<1..12>` and the `view` query param is gone. Everything else about this ADR stands — query-param navigation, five prerendered documents, hand-rolled i18n. The season *accent coloring* and the season label next to the month heading remain (via `seasonOfMonth`), only the 3-month season view rendering was deleted.
