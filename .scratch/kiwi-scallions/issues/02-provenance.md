# 02 — Provenance: verify scallion & kiwi months against the published calendars

Type: research
Status: resolved

Per ADR 0002, the two new items (`scallion`, `kiwi`) were verified item-by-item
against the same published calendars used for the original 85-item verification
(`.scratch/season-calendar/issues/10-data-provenance.md`), before being added to
the dataset. All sources fetched 2026-11-16 (UTC) via curl from the repo
environment.

## Answer

### Scallion — harvest 5–11, no storage

| Source | Verdict |
|---|---|
| Bio Suisse Saisonkalender | row **"Zwiebel Bund"** (Bundzwiebel, "auch Frühlingszwiebel genannt"; product image `Zwiebel_Bund_Fruehlingszwiebeln.jpg`): `data-months` = **4–11** |
| Verbraucherzentrale month pages | "Frühlingszwiebeln" on the fresh (✔) list in **April–November** (all 12 month pages fetched; absent in Dec–Mar, incl. the winter "Lagerware" lists) |
| Verbraucherzentrale PDF (6. Aufl. 2022) | row **"Zwiebeln: Bund-, Lauch-, Frühlings-"**: full (Freiland) marks **May–Nov**, half/protected marks April only — decoded from the PDF vector marks |

- **Harvest 5–11** = the Verbraucherzentrale Freiland (open-field) window
  exactly; a subset of both calendars' availability (Bio Suisse 4–11, VZ web
  4–11 incl. protected April).
- **No storage array**: scallions appear on no winter "Lagerware" list of the
  Verbraucherzentrale (Jan/Feb/Mar/Dec pages checked) and the item is sold
  fresh, not stored — matches the spec's expectation.
- **Divergence from the spec starting point (5–9)**: the September cut-off is
  contradicted by every source — all three run field/fresh availability to
  November. The ticket's starting points were explicitly unverified; the
  sources win.

### Kiwi — harvest 10–11, storage 12–3

| Source | Verdict |
|---|---|
| Bio Suisse Saisonkalender | row **"Kiwi"** (group "Weitere", next to Baumnüsse/Trauben — Swiss Knospe produce, not Mediterranean import): `data-months` = **10–3** |
| Verbraucherzentrale | not covered: no kiwi row in the PDF calendar, no listing on any of the 12 month pages (kiwi is outside VZ's German-domestic scope) |
| BZfE/BLE "Der Saisonkalender" | no kiwi months published in machine-readable form (page fetched; poster PDF remains image-only) |

- **Harvest 10–11 + storage 12–3**: Bio Suisse availability 10–3 is a single
  late-autumn harvest (the page text notes kiwis "sind nach der Ernte nicht
  genussreif") followed by cold-store availability — Bio Suisse folds storage
  into its months (cf. its explicit "Lagersorten" rows for apples/pears). The
  union of harvest (10–11) and storage (12–3) reproduces the published window
  exactly; Dec–Mar cannot be field harvest in the reference region.
- Matches the spec's starting points, now source-backed. Storage is recorded
  as a distinct claim per `GLOSSARY.md`.

### Locale names

en "Scallion", de "Frühlingszwiebel" (both VZ and Bio Suisse use the term),
fr "Ciboule" (Allium fistulosum; distinct from ciboulette), it "Cipollotto" —
checked against the source calendars' naming and read naturally in all four
locales. "Kiwi" in all four locales.

## Sources

All fetched 2026-11-16 (UTC) via curl.

- <https://www.bio-suisse.ch/de/biosuisse-erleben/knospe-produkte/saisonkalender.html> — Bio Suisse Saisonkalender; "Zwiebel Bund" months 4–11, "Kiwi" months 10–3, read from the `data-months` attributes in the HTML (87 products; layout moved from `<li class="product">` attribute order noted in the 2026-11-11 research, attributes unchanged).
- <https://www.verbraucherzentrale.de/wissen/lebensmittel/gesund-ernaehren/saisonkalender-obst-und-gemuese-frisch-und-regional-einkaufen-17229> — Verbraucherzentrale Saisonkalender main page.
- The 12 Verbraucherzentrale month pages (`…-januar-saison-98125` through `…-dezember-saison-98148`, URLs as listed in `.scratch/season-calendar/issues/10-data-provenance.md`) — Frühlingszwiebeln fresh (✔) April–November; not on any winter Lagerware list; kiwi not listed.
- <https://www.verbraucherzentrale.de/sites/default/files/2023-01/vz-saisonkalender.pdf> — VZ Saisonkalender PDF (6. Aufl., Nov 2022): row "Zwiebeln: Bund-, Lauch-, Frühlings-" with Freiland marks May–Nov + protected April, decoded from the PDF vector drawing commands (PyMuPDF); no kiwi row.
- <https://www.bzfe.de/kueche-und-alltag/einkaufen/der-saisonkalender> — BZfE/BLE "Der Saisonkalender" page: no per-product months published there; poster PDF remains image-only, app has no public API (per ADR 0002 unchanged).
