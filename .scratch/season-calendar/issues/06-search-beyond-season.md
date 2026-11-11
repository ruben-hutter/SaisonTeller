# 06 — Search beyond the current month

Status: ready-for-agent

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
