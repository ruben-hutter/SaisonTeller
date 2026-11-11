# 10 — Data provenance: verify dataset vs published season calendars; assess official APIs

Type: research
Status: resolved

The dataset in `src/lib/data/items.ts` was verified item-by-item against two fetched published calendars — **Bio Suisse Saisonkalender** (Swiss, months embedded machine-readable in the HTML) and **Verbraucherzentrale Saisonkalender** (Germany, 12 month pages + PDF, publicly funded, recommended by the federal BZfE) — with the official German federal calendar (**BZfE/BLE "Der Saisonkalender"**, poster + app) identified but not machine-readable. Result: **of 85 items, 57 match, 10 drift by ≤1 month at an edge, 1 is questionable (rosemary 1–12), 17 are not covered by these calendars** (south-imports, exotics, niche herbs/nuts) but are consistent with the app's own `origin: 'south'` flags — the data tracks the published consensus closely and does **not** look invented. No Swiss federal body publishes a season calendar or API (checked opendata.swiss CKAN, LINDAS, BLV, Agroscope, BLW/FOAG), and BLE offers no CSV/JSON (poster PDF is image-only); recommendation: keep the zero-dependency static dataset and add citations.

## Answer

### 1. Authoritative published calendars that exist

**Germany (official federal):**

- **BZfE — "Der Saisonkalender" (Obst und Gemüse)** — <https://www.bzfe.de/kueche-und-alltag/einkaufen/der-saisonkalender>. Publisher: Bundeszentrum für Ernährung (BZfE), an institution of the BLE (Bundesanstalt für Landwirtschaft und Ernährung), BMEL business area — i.e. the official German federal season calendar. Formats: DIN-A2 poster (orderable via <https://www.ble-medienservice.de/poster-der-saisonkalender-obst-und-gemuese.html>; the PDF itself is image-only — no text layer), a free iOS/Android app (no documented public API), and links out to third-party online calendars. Coverage: Germany/Central Europe, ~85 domestic fruit/vegetable types plus imported produce, distinguishing open field / storage / import. The calendar formerly hosted at `ble.de/DE/BZL/Daten-Berichte/saisonkalender/…` now returns 404; today's BZL "Daten und Berichte → Obst und Gemüse" section contains statistics only, no calendar.
- **Verbraucherzentrale — "Saisonkalender: Obst und Gemüse frisch und regional einkaufen"** — <https://www.verbraucherzentrale.de/wissen/lebensmittel/gesund-ernaehren/saisonkalender-obst-und-gemuese-frisch-und-regional-einkaufen-17229>. Publisher: Verbraucherzentrale NRW et al. (publicly funded consumer-protection organisations); the PDF is scientifically advised by the Leibniz-Institut für Gemüse- und Zierpflanzenbau (IGZ) and Universität Bonn (INRES), 6th updated edition Nov 2022 (<https://www.verbraucherzentrale.de/sites/default/files/2023-01/vz-saisonkalender.pdf>). Coverage: Germany, with a climate traffic-light distinguishing Freiland / geschützter Anbau / Gewächshaus / Lagerware — the closest published analogue to the app's harvest/storage split. Notably, **the BZfE page itself recommends this calendar** as the online reference for open-field availability.

**Switzerland (sector/NGO — no federal calendar exists, see Q3):**

- **Bio Suisse — "Saisonkalender für Gemüse, Obst und Fleisch"** — <https://www.bio-suisse.ch/de/biosuisse-erleben/knospe-produkte/saisonkalender.html>. Publisher: Bio Suisse (Swiss organic umbrella, owner of the Knospe mark). 87 products (incl. meat); months are embedded machine-readable in the HTML (`<li class="product" data-months="…">`), representing Swiss Knospe availability incl. storage. This was the primary Swiss comparison source.
- **WWF Switzerland — Saisonkalender** — <https://www.wwf.ch/de/saisonkalender> (widely used in CH; behind bot protection, could not be scraped from this environment).
- **Schweizer Tierschutz STS Saisonkalender** — formerly at tierschutz.com, currently unreachable (404 on plausible paths; no "Saisonkalender" entry in the site sitemap) — appears discontinued or moved.

Two comparable published calendars were therefore compared in full (Verbraucherzentrale, Bio Suisse), anchored by the official BZfE/BLE publication.

### 2. Item-by-item verification

Method: app harvest months (H) from the dataset snapshot were compared against (a) Bio Suisse `data-months` and (b) the VZ month pages' "der Saison im Monat X" fresh lists plus "Lagerware" stored lists (all 12 pages fetched and parsed). Tolerance per the brief: ±1 month at range edges = minor drift; ≥2 months = mismatch. Semantics caveat: VZ fresh lists include protected/pot cultivation (hence e.g. Dill in January); Bio Suisse rows fold storage into availability; the app models peak field harvest (H) + storage (S) separately — so app H ⊆ published availability is the expected relation.

**Verdict roll-up (85 items):**

| Category | Match | Minor drift (±1) | Questionable | Not covered by these calendars |
|---|---|---|---|---|
| Vegetables (46) | 38 | artichoke, broad-bean, chicory, pea | — | chili, mushroom-cultivated, mushroom-wild, shallot |
| Fruits (23) | 13 | quince, raspberry | — | fig, melon, watermelon, clementine, grapefruit, lemon, mandarin, orange |
| Herbs (13) | 6 (basil, chives, marjoram, oregano, sage, thyme) | dill, mint, parsley | rosemary | chervil, lovage, wild-garlic |
| Nuts (3) | 0 | walnut | — | chestnut, hazelnut |
| **Total (85)** | **57** | **10** | **1** | **17** |

**Explicit drift/questionable list (all others match, i.e. app months are contained in or equal to at least one published calendar's months):**

| Item | App H | Bio Suisse | Verbraucherzentrale | Verdict |
|---|---|---|---|---|
| artichoke | 7–10 | Artischocke 8–9 | not listed | minor: app starts 1 mo earlier (Jul harvest plausible for CH) |
| broad-bean | 5–8 | not listed | Acker-/Saubohnen 6–8 | minor: −1 at start |
| chicory | 10–11 (+S 12–3) | Chicorée 11–4 | PDF: storage item | minor: −1 at start (forced crop from stored roots) |
| pea | 5–8 | Erbsen 6–9 | 6–9 | minor: −1 at start |
| quince | 9–10 | Quitten 10–12 | 10–11 | minor: Sep is 1 mo early vs both |
| raspberry | 6–10 | Himbeeren 6–10 (exact) | 6–8 | minor: calendars disagree; app = Bio Suisse exactly |
| walnut | 9–10 | Baumnüsse 10–2 | not listed | minor: harvest vs availability incl. storage |
| mint | 4–10 | not listed | "Küchenkräuter" 5–11 | minor: −1 at start |
| parsley | 4–11 | Petersilie 5–11 | potted herbs in winter | minor: −1 at start |
| dill | 5–9 | not listed | potted herbs in winter; PDF row exists | minor/unsharp: VZ month pages not field-comparable |
| **rosemary** | **1–12** | not listed | "Küchenkräuter" 5–11 | **questionable: no source supports year-round field harvest** — only evergreen/potted availability; consider narrowing to ~5–11 or annotating |

**Not covered (17)** — plausible and self-consistent: the 6 `origin: 'south'` items (fig + 5 citrus) are import products outside both domestic calendars' scope; melon/watermelon/chili/mushrooms/shallot are greenhouse/specialty crops the VZ PDF explicitly excludes for low market share; chervil/lovage/wild-garlic and chestnut/hazelnut are niche items. None contradict the published calendars.

**Storage months (S)** also check out against VZ's winter "Lagerware" lists and Bio Suisse availability rows: e.g. apples "als Lagerware … Äpfel und Birnen" (Jan), Karotten/Rote Beete/Kürbis/Schwarzwurzel/Chinakohl/Rot-, Weiß-, Wirsingkohl/Zwiebeln/Kartoffeln listed as stored in Dec–Apr pages; Bio Suisse Äpfel Lagersorten ganzjährig verfügbar, Karotten 1–12, Randen 1–12.

**Overall:** the data is consistent with the published consensus — 57 exact/subset matches, 10 single-month edge drifts (within the stated tolerance; published calendars themselves disagree by ±1 on raspberries, cherries, currants, apricots, spinach edges), one genuine outlier (rosemary) and no invented-looking ranges. It reads like a hand-merged distillation of calendars of exactly this family.

### 3. Swiss department API / BLE machine-readable download

**Swiss federal:** no official seasonal-availability dataset or API exists.

- opendata.swiss CKAN API (`package_search`): **0 results for "Saisonkalender"**; 24 hits for "saison" are all unrelated (hotels, unemployment statistics, …). The closest hits are: BFS "Gemüse in der Schweiz" (a statistical brochure, PDF: <https://opendata.swiss/dataset/gemuse-in-der-schweiz>) and a BFS survey "Kriterien beim Kauf von Früchten und Gemüse" (XLS) — neither is a calendar.
- By publisher: **BLV** (29 datasets: plant-protection registry, animal-experiment statistics, food controls — no calendar), **Agroscope** (17 datasets: economics, phytoxin DB — no calendar), **BLW/FOAG** publishes the "Marktzahlen Früchte, Gemüse und Kartoffeln" series (monthly import quantities / import prices / consumer prices per product, as SPARQL on LINDAS, portal <https://www.agrarmarktdaten.ch>) — real per-month per-product federal data, but trade/market statistics, not a published season calendar.
- data.admin.ch / LINDAS (`ld.admin.ch/query`, DCAT catalog): a title query for "saison" returns only *seasonally adjusted* ("saisonbereinigt") economic series — nothing produce-related.

**German BLE:** no machine-readable download. The BZfE/BLW-BLE offer is a print poster (PDF is image-only — confirmed by an attempted text extraction), a pocket print, and a mobile app with no documented public API; the old ble.de online tool is gone (404), and BLE's Open-Data page is methodology-only with no season dataset.

**Conclusion:** integrating an "official API" is not possible — none exists on either side of the border. The only federal machine-readable neighbour (FOAG Marktzahlen) would add a runtime dependency and derivation complexity for zero provenance gain. The right move for this deliberately static, zero-runtime-dependency app is **citation, not integration**: add the BZfE/BLE poster, Verbraucherzentrale calendar (both Germany/Central Europe, the app's stated region) and Bio Suisse calendar as references (e.g. in the README and/or footer `footer.note`), optionally re-deriving future dataset revisions offline from Bio Suisse's machine-readable HTML (noting that page carries no open-data licence, so citing — not bulk-copying — is the safe course). The one data action worth considering from Q2: revisit rosemary's 1–12 harvest claim.

## Sources

All fetched 2026-11-11 (UTC) from the repo environment via curl.

Primary calendars:

- <https://www.bzfe.de/kueche-und-alltag/einkaufen/der-saisonkalender> — Bundeszentrum für Ernährung (BZfE, BLE), "Der Saisonkalender" (page; poster/app references, links VZ calendar).
- <https://www.ble-medienservice.de/poster-der-saisonkalender-obst-und-gemuese.html> — BLE-Medienservice, poster product page.
- <https://www.ble-medienservice.de/product_attachment/productattachment/download/id/3bdc6894056e49f6b02499957b752a02ca88b7fc/> — BLE-Medienservice, poster PDF (image-only, no text layer).
- <https://www.verbraucherzentrale.de/wissen/lebensmittel/gesund-ernaehren/saisonkalender-obst-und-gemuese-frisch-und-regional-einkaufen-17229> — Verbraucherzentrale.de, Saisonkalender main page.
- <https://www.verbraucherzentrale.de/sites/default/files/2023-01/vz-saisonkalender.pdf> — Verbraucherzentrale NRW, Saisonkalender PDF (6. Aufl., Nov 2022; advice: IGZ, Uni Bonn).
- <https://www.verbraucherzentrale.de/wissen/lebensmittel/gesund-ernaehren/welches-gemuese-hat-im-januar-saison-98125> (and the 11 sibling pages `…-februar-saison-98126`, `…-maerz-saison-98128`, `…-april-saison-72556`, `…-mai-saison-98129`, `…-juni-saison-98131`, `…-juli-saison-98135`, `…-august-saison-98136`, `…-september-saison-98139`, `…-oktober-saison-98142`, `…-november-saison-98145`, `…-dezember-saison-98148`) — Verbraucherzentrale.de, per-month fresh ("✔️") and Lagerware lists; these 12 pages provided the VZ comparison data.
- <https://www.bio-suisse.ch/de/biosuisse-erleben/knospe-produkte/saisonkalender.html> — Bio Suisse, Saisonkalender (87 products with `data-months` in HTML; provided the Swiss comparison data; no open-data licence statement found on the page).

Swiss calendar landscape (existence/discontinuation checks):

- <https://www.wwf.ch/de/saisonkalender> — WWF Switzerland, Saisonkalender (exists; bot-protected, not scrapeable from this environment).
- <https://www.tierschutz.com/de/saisonkalender> and <https://tierschutz.com/sitemap.xml> / <https://tierschutz.com/download-sitemap.xml> — Schweizer Tierschutz STS (former Saisonkalender publisher): 404 / no saisonkalender entry — discontinued or moved.
- <https://kreislaufwirtschaft.ch/> and <https://gemueseschweiz.ch/> — former Swiss fruit/vegetable-trade season-calendar domains (now redirect to a web agency / GVBF) — sector calendars no longer reachable there; <https://gvbf.ch/> (Gemüseproduzenten-Vereinigung Bern/Freiburg) hosts no calendar.

Official/API checks:

- <https://opendata.swiss/api/3/action/package_search?q=saisonkalender> (and sibling queries `q=saison`, `q=gem%C3%BCse`, `q=organization:bundesamt-fur-lebensmittelsicherheit-und-veterinaerwesen-blv`, `q=organization:agroscope`, `q=organization:bundesamt-fur-landwirtschaft-blw`) — opendata.swiss CKAN catalog API (Barrierefreie-Verwaltung/eGovernment): 0 season-calendar datasets; BLV 29 / Agroscope 17 / BLW datasets contain none.
- <https://opendata.swiss/dataset/marktzahlen-fruchte-gemuse-und-kartoffeln-monatliche-importmenge> (plus the Konsumentenpreise/Importpreise/Jahresmengen siblings; SPARQL/LINDAS resources) — BLW/FOAG Marktzahlen; portal <https://www.agrarmarktdaten.ch>.
- <https://opendata.swiss/dataset/gemuse-in-der-schweiz> — BFS (statistical brochure, not a calendar).
- <https://ld.admin.ch/query> — data.admin.ch / LINDAS SPARQL endpoint (DCAT dataset-title query for "saison": only seasonally-adjusted economic series).
- <https://www.ble.de/DE/BZL/Daten-Berichte/saisonkalender/saisonkalender_node.html> — former BLE Saisonkalender URL (404; calendar now at BZfE).
- <https://www.ble.de/DE/BZL/Daten-Berichte/Obst-Gemuese/obst-gemuese_node.html> — BLE/BZL "Obst und Gemüse" (statistics only, no calendar/CSV).
- <https://www.ble.de/DE/BZL/Open-Data/open-data_node.html> — BLE/BZL Open Data page (methodology only; no season dataset).
