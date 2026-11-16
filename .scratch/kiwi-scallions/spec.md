# Extend the produce dataset with scallions and kiwi

## Why

The sibling project LiveTogether is adding an "in season" badge to its
shopping list, driven by this repo's dataset (its badge covers catalog items
mapped to `ProduceItem`s here). Two genuinely seasonal Central-European
products exist in LiveTogether's item catalog but have no counterpart in our
85-item dataset:

- **Scallions** (spring onions)
- **Kiwi** (grown in Switzerland / northern Italy, not Mediterranean-import)

Adding them here keeps this repo the single source of truth for seasonality;
LiveTogether regenerates its mapping afterwards.

## Requirements

- Follow the existing definitions in `GLOSSARY.md`: `Produce item`,
  `Harvest month`, `Storage month`, `Reference region` (CH & Central Europe).
- Names in all four locales (en/de/fr/it), category `vegetable` (scallion) /
  `fruit` (kiwi), kebab-case ids (`scallion`, `kiwi`).
- **Provenance per `docs/adr/0002-dataset-provenance-no-api.md`**: verify each
  item's months item-by-item against the published calendars used for the
  original dataset (BZfE/BLE "Der Saisonkalender", Verbraucherzentrale, Bio
  Suisse Saisonkalender) and record the verification like
  `.scratch/season-calendar/issues/10-data-provenance.md` did.

## Starting points — UNVERIFIED, must be checked against sources

- Scallion: harvest ~May–September. Storage unlikely (sold fresh year-round
  from imports; only harvest months belong in the dataset).
- Kiwi: harvest ~October–November, storage ~December–March (kiwis store well).

If the sources cannot be consulted (no web access), stop and report back
instead of guessing months.
