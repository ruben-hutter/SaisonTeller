# 01 — Data model: seasons + produce dataset

Status: ready-for-agent

## Task

- `src/lib/seasons.ts`: `Season` type; `months(range)` inclusive range helper with wrap-around (`'10-2'` → `[1,2,10,11,12]`, always ascending, `'1-12'` → full year); `seasonOfMonth(m)` (spring 3–5, summer 6–8, autumn 9–11, winter 12,1–2); `monthsOfSeason(season)`.
- `src/lib/data/items.ts`: `Category`, `Origin`, `ProduceItem` types; `items: ProduceItem[]` transcribed exactly from the dataset table in `spec.md` (85 items, built with the `months()` helper; spinach/chervil use two concatenated ranges); `itemsForMonth(month)` → `{ harvest, storage }`.
- `src/lib/types.ts`: shared `View` type (`'month' | 'season'`).

## Tests

- `seasons.test.ts`: `months` incl. wrap-around and `'1-12'`; `seasonOfMonth` for all 12 months; `monthsOfSeason` round-trip.
- `items.test.ts` data integrity: unique kebab-case ids; exactly 4 non-empty names; harvest non-empty/ascending/1..12; storage ascending/disjoint from harvest; valid categories; valid origins; ranges within 1..12; expected total (85); `itemsForMonth` grouping.

## Acceptance

- Vitest passes with no DOM, node environment.
- Dataset matches spec table exactly.
