# SaisonTeller

A fully static webapp that shows which fruits, vegetables, herbs and nuts are in season — per month or per season — for Switzerland & Central Europe. Available in English, German, French and Italian.

**Try it**: https://ruben-hutter.github.io/SaisonTeller/ (deploys automatically on push to `main`)

## Quick start

```sh
npm install
npm run dev      # http://localhost:5173/SaisonTeller/
```

| Command            | What it does                        |
| ------------------ | ----------------------------------- |
| `npm run dev`      | dev server                          |
| `npm run build`    | prerender static site to `build/`   |
| `npm run preview`  | serve the production build          |
| `npm test`         | vitest (seasons, dataset, i18n)     |
| `npm run check`    | svelte-check                        |

## How it works

- **Routes**: `/` redirects to the browser's language (`/en`, `/de`, `/fr`, `/it`); month via query param, e.g. `/de?m=7`.
- **Data**: 85 produce items in `src/lib/data/items.ts`, month ranges via `src/lib/seasons.ts`. Project-owned dataset, verified against published Swiss/German calendars.
- **i18n**: typed dictionaries in `src/lib/i18n/`, month names from `Intl.DateTimeFormat`.
- **Theme**: follows the system (`prefers-color-scheme`), no toggle.
- **Zero runtime dependencies** — SvelteKit + adapter-static, everything prerendered.

## More

- Domain vocabulary: `GLOSSARY.md`
- Decision records: `docs/adr/`
