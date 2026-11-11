# 06 — Search beyond the current month

Status: resolved

## What

Searching must find items outside the selected month and show when they are in season.

- Non-empty search ⇒ grid shows **all** items matching the query (any-language name match, as today) filtered by active category chip, split into two groups with localized subheadings:
  - **In season now** (`results.inSeason`): harvest or storage contains the selected month — normal cards.
  - **Not in season now** (`results.notInSeason`): all other matches — cards dimmed (opacity ~0.55, strip still fully legible).
- Subheading only when its group is non-empty; existing empty-state line only when nothing matches at all.
- Strip highlight (current-month ring) still refers to the selected month — that's what makes out-of-season results informative.

## Strings (exact)

| key | en | de | fr | it |
|---|---|---|---|---|
| results.inSeason | In season now | Jetzt Saison | En saison | Di stagione |
| results.notInSeason | Not in season now | Aktuell keine Saison | Hors saison | Fuori stagione |

## Tests

- Unit-test the in/out-of-season split helper (zucchina month 11 → out; month 6 → in), or document why coverage stays data-level.

## Comments

- Pure helpers extracted to `items.ts`: `isInSeason(item, month)` (harvest OR storage) and `splitBySeasonNow(list, month)`; unit-tested (zucchini m=11 → out, m=6 → in; storage-only apple m=5 → in; input order preserved within groups).
- Page: non-empty query switches the grid to all matches (category chip still applies) split into `results.inSeason` / `results.notInSeason` groups; subheadings render only when non-empty; `results.none` only when nothing matches at all. Strip ring still marks the selected month. In-season group keeps the "from storage" tag semantics (`markStorage`).
- Dimming implemented as `.card.dimmed .head { opacity: 0.55 }` — deliberately NOT the whole card, so the numbered strip stays fully legible on out-of-season results (it is what tells the user when the item is in season).
- Browser-verified on the production build: `/it?m=11` + "zucchina" → "Fuori stagione", 1 dimmed card; `/it?m=6` + "zucchina" → "Di stagione", normal card, ring on 6; `/de?m=3` + "apfel" → "Jetzt Saison" (storage counts); no-match → localized empty line, no group headings. Head opacity computes to 0.55; 320px viewport: no horizontal overflow.
- Proof: `npm test` 30 passed; `npm run check` clean (2025-11-11).
