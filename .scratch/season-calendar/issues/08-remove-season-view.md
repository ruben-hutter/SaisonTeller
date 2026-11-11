# 08 — Remove the season view

Status: ready-for-agent

## What

Month navigation only. Remove the Month/Season segmented toggle, the `view` query param and all season-view rendering (3-month sections). Routes/links keep `?m=<1..12>` only.

Keep:

- Season accent coloring (container `data-season`).
- Season label next to the month heading ("November · Autumn").
- Month strip visuals unchanged.

Remove now-unused code: `view.*` UI strings, `aria.toggleView`, `monthsOfSeason` (if unused after this; `seasonOfMonth` stays — accent + heading need it). Update tests without deleting coverage for what remains.

ADR-0001 mentions `view=season` as part of the query-param decision: append a short "## Update" section noting the season view was removed in round 2.
