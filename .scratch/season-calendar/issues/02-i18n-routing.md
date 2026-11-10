# 02 — i18n & routing

Status: ready-for-agent

## Task

- `src/lib/i18n/{index,en,de,fr,it}.ts`: dictionaries as `Record<StringKey, string>` transcribed exactly from the strings table in `spec.md`; `StringKey` derived from `en`; `Locale` type + `LOCALES`; `t(locale, key)`; `monthName`/`monthShort` via `Intl.DateTimeFormat` (`en-GB`, `de-CH`, `fr-CH`, `it-CH`) with capitalized first letter.
- Root `/`: prerendered, client-side `navigator.languages` detection → `goto('/{locale}?m={currentMonth}')`; SSR'd locale links cover the no-JS case.
- `src/routes/[locale]/`: layout guard (unknown locale → redirect to `/en`); page load parses `?m=` and `?view=` (invalid/missing `m` → current month; view ∈ {month, season}, default month).
- `prerender.entries` = `['/', '/en', '/de', '/fr', '/it']`, `prerender = true` in root layout.
- `hooks.server.ts`: rewrite `<html lang="en">` to the path locale via `transformPageChunk`.
- Title `{app.name} — {app.tagline}`, meta description `footer.note` per locale.

## Tests

- Dictionary key parity (in `items.test.ts` per brief).

## Acceptance

- `npm run build` prerenders `/`, `/en`, `/de`, `/fr`, `/it`; each locale page has correct `lang` attr; deep links like `/de?m=7&view=season` honored after hydration.
