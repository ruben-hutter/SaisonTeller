# Add scallions and kiwi to the produce dataset

Status: resolved

## Task

Add two items to `src/lib/data/items.ts` per `.scratch/kiwi-scallions/spec.md`:

1. `scallion` — category `vegetable`; names en "Scallion", de
   "Frühlingszwiebel", fr "Ciboule", it "Cipollotto" (verify translations
   sound right); harvest months to verify (starting point `5-9`).
2. `kiwi` — category `fruit`; names en/de/fr/it "Kiwi"; harvest months to
   verify (starting point `10-11`), possibly storage months (starting point
   `12-3`) — decide from the sources, storage is a distinct claim
   (`GLOSSARY.md`).

Verification standard and starting-point caveats: see the spec. Record
provenance the way `.scratch/season-calendar/issues/10-data-provenance.md`
did (a short note file under `.scratch/kiwi-scallions/`).

## Done when

- Both items in `src/lib/data/items.ts` with source-verified months.
- Provenance note committed under `.scratch/kiwi-scallions/`.
- `npm test` and `npm run check` pass (update `items.test.ts` if it asserts
  the item count).
- Committed on `feat/kiwi-scallions` (commit style: `feat(data): …`).

## Answer

Done. Added `scallion` (vegetable, harvest 5–11, no storage) and `kiwi`
(fruit, harvest 10–11, storage 12–3) to `items.ts`, the spec table in
`.scratch/season-calendar/spec.md` (per ADR 0002's publish-and-verify
requirement) and `static/img/bespoke/` (one SVG per item, as the dataset
integrity tests require); item-count assertions and README updated to 87.

Months verified 2026-11-16 against Bio Suisse (Zwiebel Bund 4–11; Kiwi 10–3)
and the Verbraucherzentrale month pages + PDF (Frühlingszwiebeln fresh 4–11,
Freiland marks May–Nov; kiwi not covered) — full evidence in
`02-provenance.md`. Notable: the spec's scallion starting point 5–9 was
contradicted by every source (all run to November); harvest is 5–11.
Committed as `feat(data): add scallion and kiwi with source-verified seasons`.
