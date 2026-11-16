# Add scallions and kiwi to the produce dataset

Status: claimed

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
