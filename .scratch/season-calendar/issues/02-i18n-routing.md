# 02 — i18n & routing

Status: resolved

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

## Comments

- Proof: `npm run build` prerenders /, /en, /de, /fr, /it; `lang="de|fr|it"` baked via hooks transformPageChunk; query params read client-side from page state (Kit blocks url.searchParams in prerendered loads — see ADR-0001); key-parity test green.
- 2026-11 (fix-splash-flash): the root redirect mechanism changed — the goto-in-onMount painted the splash for a visible moment before hydrating (dev 130–500 ms, prod 18–180 ms). The root page now also emits a small inline `<script>` in `<svelte:head>` that runs during HTML parse, before first paint: it picks the locale from `navigator.languages` (same logic as onMount) and `location.replace`s to `/{locale}?m={currentMonth}`. Notes: it must be emitted via `{@html}` because Svelte treats a literal `<script>` in markup as raw text (no `{expressions}`); `base` and `LOCALES` are interpolated into the string at prerender time; the script is guarded by `location.pathname === base || === base + '/'` because the same HTML ships as `404.html` (postbuild cp) and is served at arbitrary unknown paths where it must do nothing — the onMount goto stays as the fallback there and as a general safety net. No-JS users still get the SSR'd locale links. Verified with the flash harness (splash never paints, dev and prod) and a no-JS probe.
