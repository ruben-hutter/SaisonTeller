# SaisonTeller

A fully static webapp that shows which fruits, vegetables, herbs and nuts are in season — per month or per season — for Switzerland & Central Europe. Available in English, German, French and Italian. Responsive, system light/dark theme, no runtime dependencies.

## Commands

```sh
npm install     # install dev dependencies
npm run dev     # dev server
npm run build   # prerender to build/ (adapter-static)
npm run preview # serve the production build
npm test        # vitest (seasons, dataset integrity, i18n key parity)
npm run check   # svelte-check
```

## How it works

- **Routes**: `/` (auto-redirects to the browser's language), `/en`, `/de`, `/fr`, `/it`. The month lives in the query param: `/de?m=7`. All navigation uses real `<a href>` links, so URLs are shareable and everything works prerendered.
- **Data**: 85 produce items (46 vegetables, 23 fruits, 13 herbs, 3 nuts) in `src/lib/data/items.ts`, built with the inclusive month-range helper in `src/lib/seasons.ts`.
- **i18n**: hand-rolled typed dictionaries in `src/lib/i18n/`; month names come from `Intl.DateTimeFormat` (`en-GB`, `de-CH`, `fr-CH`, `it-CH`).
- **Theme**: CSS custom properties with `prefers-color-scheme` overrides; season accents applied via `data-season`. No toggle — the system theme wins.
- **No runtime dependencies** — SvelteKit + adapter-static, everything prerendered.

## Project layout

```
src/
  app.html / app.css          # shell + design tokens
  hooks.server.ts             # bakes <html lang> per locale into prerendered pages
  lib/
    seasons.ts                # month ranges, season helpers
    data/items.ts             # the produce dataset + itemsForMonth()
    i18n/                     # en/de/fr/it dictionaries + helpers
    components/               # MonthSwitcher, ItemCard
  routes/
    +page.svelte              # language-detection redirect page
    [locale]/+page.svelte     # month & season views
```

Decisions are recorded in `docs/adr/`; domain vocabulary in `GLOSSARY.md`.
