# ADR 0002: Dataset provenance — cite published calendars, no API integration

- **Status:** Accepted
- **Date:** 2026-11-11
- **Deciders:** SaisonTeller

## Context

The 85-item produce dataset (`src/lib/data/items.ts`) was hand-authored into the spec (`.scratch/season-calendar/spec.md`) without a cited source — its header comment says only "Reference calendar for Switzerland & Central Europe". Before building on it further we needed to know whether the month ranges reflect officially published information or were invented, and whether an official Swiss federal API could replace or feed the dataset.

The verification (research ticket `.scratch/season-calendar/issues/10-data-provenance.md`, 2026-11-11) compared every item's harvest and storage months against the published calendars reachable as primary sources:

- **BZfE/BLE "Der Saisonkalender"** — the official German federal calendar (poster + app; the poster PDF is image-only, no machine-readable data).
- **Verbraucherzentrale Saisonkalender** — publicly funded German consumer-protection calendar, scientifically advised by the Leibniz-Institut für Gemüse- und Zierpflanzenbau (IGZ) and Universität Bonn; recommended by the BZfE page itself; distinguishes fresh vs. storage ("Lagerware"), the closest analogue to our harvest/storage split.
- **Bio Suisse Saisonkalender** — Swiss, 87 products with machine-readable months in the HTML; the only comparable Swiss calendar still reachable (STS discontinued, WWF bot-protected, former sector domains gone).

Result across 85 items: **57 exact matches, 10 minor edge drifts (≤ 1 month, within the disagreement the published calendars show among themselves), 17 items outside those calendars' scope** (the 6 `origin: 'south'` imports, melons, chili, mushrooms, shallot, niche herbs, chestnut/hazelnut — none contradicting the sources), and **one genuine outlier: rosemary claimed 1–12**, which no published source supports as a field-harvest window (only potted/evergreen availability).

On the API question: **no official season-calendar dataset or API exists.** opendata.swiss (CKAN) has 0 results for "Saisonkalender"; BLV, Agroscope and BLW publish no calendar (BLW's Marktzahlen on LINDAS is monthly trade/price statistics, not availability); LINDAS/data.admin.ch only matches seasonally-adjusted economic series; BLE offers no CSV/JSON either.

## Decision

1. **Keep the dataset project-owned and static.** It is a hand-merged distillation consistent with the published consensus, and the app's zero-runtime-dependency constraint stands.
2. **Correct the one unsupported claim**: rosemary harvest `1-12` → `5-11` (Verbraucherzentrale field-herb window), spec table, `items.ts`, and the January `itemsForMonth` test updated together.
3. **Cite, don't integrate.** Published sources are credited in the README data bullet, the `items.ts` header, and the spec's dataset section. Future dataset revisions may be re-derived offline from the Bio Suisse machine-readable HTML and the Verbraucherzentrale month pages — but Bio Suisse publishes no open-data licence, so those pages are cited, not bulk-copied.

## Alternatives considered

- **Integrate BLW/FOAG Marktzahlen (SPARQL on LINDAS)** — the only federal machine-readable data in this domain; it is import volumes and prices, not seasonal availability. Adds a runtime dependency, needs heavy derivation, and would not improve provenance. Rejected.
- **Fetch a calendar at build time** (e.g. Bio Suisse `data-months`) — fragile scraping of a licence-free page that could change layout or terms; silently swapping our reviewed dataset for scraper output is worse than a curated, tested table. Rejected.
- **Narrow all 10 drift items to match one specific calendar** — the drifts are single edge months where the calendars themselves disagree; pinning to one publisher would be false precision. Kept as-is, documented in the research ticket.

## Consequences

- **Positive:** the dataset's provenance is now explicit and auditable (spec → research ticket with per-item verdicts and sources → this ADR); the single implausible range is gone; the zero-dependency static architecture is untouched.
- **Negative:** the calendar still has no single authoritative citation it fully reproduces — it remains a curated reference, so future produce additions need the same publish-and-verify treatment (add to the spec table, check against the cited calendars).
