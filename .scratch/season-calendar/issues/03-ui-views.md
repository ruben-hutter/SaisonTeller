# 03 — UI views: month & season

Status: ready-for-agent

## Task

- `[locale]/+page.svelte`: sticky header (brand → `/{locale}`, tagline, language links w/ `aria-current`), month strip (12 `<a>`, selected = accent fill, real month = subtle outline, `aria-label` + `aria-current`), month/season segmented toggle, category chips (`<button aria-pressed>`) + search input (local state), legend, card grid, footer.
- Month view: h1 month + season name; harvest grid then storage grid (tagged, dimmed accent).
- Season view: h1 season; per-month sections (h2 + grid, harvest first, storage tagged).
- Search matches names in all 4 languages, case-insensitive, diacritics-normalized; empty → `results.none`.
- `MonthSwitcher.svelte`, `ItemCard.svelte` (name, category dot, south badge, 12-month availability strip: filled=harvest, light=storage, ring on selected month; visually-hidden summary for SR).
- Grid `repeat(auto-fill, minmax(230px,1fr))`, gap 12px, single column < 480px. All navigation via real `<a href>` preserving `m`/`view`.

## Acceptance

- Both views render correctly for all locales; filters + search work; shareable URLs.
