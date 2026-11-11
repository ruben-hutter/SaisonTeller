# 08 — Remove the season view

Status: resolved

## What

Month navigation only. Remove the Month/Season segmented toggle, the `view` query param and all season-view rendering (3-month sections). Routes/links keep `?m=<1..12>` only.

Keep:

- Season accent coloring (container `data-season`).
- Season label next to the month heading ("November · Autumn").
- Month strip visuals unchanged.

Remove now-unused code: `view.*` UI strings, `aria.toggleView`, `monthsOfSeason` (if unused after this; `seasonOfMonth` stays — accent + heading need it). Update tests without deleting coverage for what remains.

ADR-0001 mentions `view=season` as part of the query-param decision: append a short "## Update" section noting the season view was removed in round 2.

## Comments

- Removed the segmented toggle, `view` param and 3-month season rendering from `[locale]/+page.svelte`; `MonthSwitcher` and language links now carry `?m=` only. Season accent (`data-season`) + season label in the h1 kept.
- Deleted `monthsOfSeason` (+ its tests), `src/lib/types.ts` (`View` was its only export), and the `view.month`/`view.season`/`aria.toggleView` strings from all four dictionaries. Month-strip nav aria-label now reuses `aria.showMonth`.
- ADR-0001: appended `## Update` noting the removal. README navigation line updated.
- Proof: `npm test` 18 passed, `npm run check` clean, `npm run build` prerenders exactly 5 pages, `grep -r "view=season" build` → no hits (2025-11-11).
