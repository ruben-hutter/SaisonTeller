# Spec: SaisonTeller — seasonal produce webapp

## Goal

A fully static, prerendered webapp showing which fruits, vegetables, herbs and nuts are in season per month or per season, for Switzerland / Central Europe. Four locales (en, de, fr, it), responsive, system light/dark theme (`prefers-color-scheme` only, no toggle). Zero runtime dependencies.

## Stack

SvelteKit 2 + Svelte 5 (TypeScript, runes syntax), `@sveltejs/adapter-static` (everything prerendered), Vite 7, vitest 3, svelte-check 4. No UI framework, no CSS framework, no i18n library. Hand-rolled typed i18n dictionaries. Pinned majors: `svelte ^5`, `@sveltejs/kit ^2`, `@sveltejs/adapter-static ^3`, `@sveltejs/vite-plugin-svelte ^6`, `vite ^7`, `typescript ^5`, `vitest ^3`, `svelte-check ^4`.

## Routing & i18n

- Locale in the URL path: `/en`, `/de`, `/fr`, `/it`. Root `/` is a tiny prerendered page that client-side detects `navigator.languages` (base language ∈ {en,de,fr,it}, else `en`) and redirects to `/{locale}?m={currentMonth}`.
- Month and view are **query params**: `/{locale}?m=1..12&view=month|season`. Month switcher, view toggle and language links are real `<a href>` links (shareable, prerender-friendly).
- Invalid `m` → current month. Missing `m` → current month (browser date at runtime; build date baked into prerendered HTML — hydration corrects it).
- Query params are read client-side from SvelteKit's `page` state (`$app/state`, guarded by `BROWSER`): SvelteKit throws on `url.searchParams` inside `load` during prerendering, so `+page.ts` only validates the locale; the component derives `month`/`view` reactively from `page.url.searchParams` (undefined during SSR → fallback).
- Search box and category chips are local component state, not URL.
- `prerender.entries` = `['/', '/en', '/de', '/fr', '/it']`; `export const prerender = true` in root `+layout.ts`. `[locale]` layout guard: unknown locale → client-side redirect to `/en`.
- i18n: `src/lib/i18n/{index,en,de,fr,it}.ts`; `StringKey` derived from the `en` dictionary; `t(locale, key)` helper; vitest asserts key parity across all four dictionaries. Month/season names from `Intl.DateTimeFormat` (tags `en-GB`, `de-CH`, `fr-CH`, `it-CH`), short month names capitalized via helper (de/fr return lowercase from `Intl`).

## Data model

`src/lib/data/items.ts` exports `items: ProduceItem[]` and `itemsForMonth(month)`:

```ts
type Category = 'vegetable' | 'fruit' | 'herb' | 'nut';
type Origin = 'local' | 'south';            // 'south' = Mediterranean produce, gets a badge
interface ProduceItem {
  id: string;                               // kebab-case, unique
  category: Category;
  names: Record<Locale, string>;            // en | de | fr | it
  harvest: number[];                        // peak months, 1..12, ascending
  storage?: number[];                       // good from storage, 1..12, ascending, disjoint from harvest
  origin?: Origin;                          // default 'local'
}
```

`itemsForMonth(month)` → `{ harvest: ProduceItem[]; storage: ProduceItem[] }`.

`src/lib/seasons.ts`: `seasonOfMonth(m)` (spring 3–5, summer 6–8, autumn 9–11, winter 12,1–2), `monthsOfSeason(season)`, and `months('7-10')` inclusive range helper with wrap-around (`'10-2'` = 1,2,10,11,12; output ascending). Spinach and chervil have two harvest ranges concatenated (`[...months('4-6'), ...months('9-11')]`).

Dataset: **85 items** (46 vegetables, 23 fruits, 13 herbs, 3 nuts; 6 with `origin: 'south'`: fig, clementine, grapefruit, lemon, mandarin, orange). Full table transcribed below — the single source of truth for `items.ts`.

## Views

- **Month view (default)**: h1 = month name + season name (season accent color). Grid of cards for items whose `harvest` contains the month, then a second group for items whose `storage` contains the month ("from storage" tag, slightly dimmed accent).
- **Season view**: h1 = season name; three sections (one per month of the season, h2 month name + card grid). Within each section one grid, harvest items first, storage items tagged (decision: no separate storage subgroup per month — the tag carries the distinction).
- Filters: category chips (All / Vegetables / Fruits / Herbs / Nuts) + search input. Search matches the item name in any of the 4 languages, case-insensitive; diacritics normalized (`NFD` + strip `\p{Diacritic}`) so e.g. "chicoree" finds "Chicorée". Empty result → localized `results.none`.
- Card: name, category-colored dot, optional "Southern Europe" badge, 12-month availability strip — one dot per month: filled = harvest, light = storage, selected month = ring highlight. Dots are `aria-hidden`; a visually-hidden summary ("harvest: … / storage: …" using `legend.*` keys and `Intl` month names) describes the strip to screen readers.
- Availability strip: the ring highlights the month being viewed — the selected `m` in month view, and the section's month in season view (each section's grid answers "what's in season in this month"; ringing all three sections' months keeps every card meaningful rather than only marking where the user came from).

## Design

- Season accents (light/dark): spring `#3f9d5c`/`#7dcb9a`, summer `#d9a404`/`#e8c04a`, autumn `#d97a2b`/`#e59a5f`, winter `#4a8fc2`/`#7fb3d9`, set as `--accent` via `data-season` on the main container. Category dot colors: vegetable green, fruit red/pink, herb teal, nut brown (adjusted per theme).
- Contrast: to hold 4.5:1 for *text*, each season also defines a `--accent-ink` (darkened accent for light theme; in dark theme the given accents are light enough to be used directly as text color). Accent *fills* (selected month, active chip) use near-black `--on-accent` text in both themes. All text/surface pairs verified ≥ 4.5:1 in both themes.
- Layout: sticky header (brand `app.name` → link to `/{locale}`, tagline, language links with `aria-current`), month strip (12 `<a>`, selected = accent fill, real current month = subtle outline), month/season segmented toggle (`role="group"` + `aria.toggleView`), chips + search on one wrapping row, legend near the grid, footer with `footer.note`. Grid `repeat(auto-fill, minmax(230px, 1fr))`, gap 12px, single column under 480px.
- Feel: calm, generous whitespace, system font stack, subtle borders + soft shadows, radius ~10px, focus-visible rings in accent, `prefers-reduced-motion` respected. No emoji icons.

## Accessibility

Chips `<button aria-pressed>`; month links `aria-label="{aria.showMonth} {Month}"` + `aria-current="true"` when selected; view-toggle links `aria-current="true"` when active; search input `aria-label`; strips have visually-hidden summaries; contrast ≥ 4.5:1 in both themes.

## Decisions where the brief was silent

1. **`<html lang>` per locale**: `hooks.server.ts` rewrites `lang="en"` → `lang="{locale}"` via `transformPageChunk` (pathname-based), which adapter-static bakes into each prerendered page.
2. **Root page no-JS**: the four locale links are server-rendered into the prerendered HTML (present with or without JS), which fulfills the brief's `<noscript>` intent; the client script auto-redirects after hydration.
3. **`View` type** (`'month' | 'season'`) lives in a small `src/lib/types.ts`.
4. **Query params at hydration**: since `+page.ts` cannot read `url.searchParams` during prerender, the page component derives `m`/`view` from `page` state (`$app/state`) with a `BROWSER` guard; on hydration the real URL (`/de?m=7&view=season`) is picked up immediately, no re-navigation needed.
5. **Language/month/view links** always carry explicit `m` and `view` params (deterministic shareable URLs); the brand link goes to bare `/{locale}` per brief.
6. **Footer** = `footer.note` only (it already contains the region hint).
7. **Card sort order** = dataset order (vegetables → fruits → herbs → nuts).
8. **README.md** and a small `static/favicon.svg` added; `hooks.server.ts` added (both outside the brief's file list, needed for the above).
9. **Season view per month**: single grid (harvest first, storage tagged), see Views.

## Dataset (source of truth)

`H` = harvest, `S` = storage, `origin=south` marked. Ranges inclusive, wrap allowed.

| id | cat | en | de | fr | it | H | S | origin |
|---|---|---|---|---|---|---|---|---|
| artichoke | veg | Artichoke | Artischocke | Artichaut | Carciofo | 7-10 | | |
| asparagus | veg | Asparagus | Spargel | Asperge | Asparagi | 4-6 | | |
| beetroot | veg | Beetroot | Rote Bete | Betterave rouge | Barbabietola rossa | 6-10 | 11-2 | |
| broad-bean | veg | Broad bean | Dicke Bohne | Fève | Fava | 5-8 | | |
| broccoli | veg | Broccoli | Brokkoli | Brocoli | Broccolo | 6-11 | | |
| brussels-sprouts | veg | Brussels sprouts | Rosenkohl | Chou de Bruxelles | Cavolo di Bruxelles | 10-2 | | |
| cabbage-white | veg | White cabbage | Weißkohl | Chou blanc | Cavolo cappuccio | 6-11 | 12-5 | |
| cabbage-red | veg | Red cabbage | Rotkohl | Chou rouge | Cavolo rosso | 9-11 | 12-2 | |
| cabbage-savoy | veg | Savoy cabbage | Wirsing | Chou de Milan | Cavolo verza | 9-11 | 12-2 | |
| carrot | veg | Carrot | Karotte | Carotte | Carota | 5-10 | 11-4 | |
| cauliflower | veg | Cauliflower | Blumenkohl | Chou-fleur | Cavolfiore | 5-11 | | |
| celeriac | veg | Celeriac | Knollensellerie | Céleri-rave | Sedano rapa | 8-11 | 12-3 | |
| celery | veg | Celery | Stangensellerie | Céleri branche | Sedano | 7-11 | | |
| chicory | veg | Belgian endive | Chicorée | Endive | Cicoria belga | 10-11 | 12-3 | |
| chili | veg | Chili pepper | Chilischote | Piment | Peperoncino | 7-10 | | |
| corn-salad | veg | Lamb’s lettuce | Feldsalat | Mâche | Valerianella | 10-3 | | |
| cucumber | veg | Cucumber | Gurke | Concombre | Cetriolo | 6-9 | | |
| eggplant | veg | Aubergine | Aubergine | Aubergine | Melanzana | 7-10 | | |
| fennel | veg | Fennel | Fenchel | Fenouil | Finocchio | 6-10 | | |
| garlic | veg | Garlic | Knoblauch | Ail | Aglio | 7-8 | 9-5 | |
| green-bean | veg | Green bean | Grüne Bohne | Haricot vert | Fagiolino | 6-10 | | |
| kale | veg | Curly kale | Grünkohl | Chou frisé | Cavolo riccio | 11-2 | | |
| kohlrabi | veg | Kohlrabi | Kohlrabi | Chou-rave | Cavolo rapa | 5-10 | | |
| leek | veg | Leek | Lauch | Poireau | Porro | 6-11 | 12-3 | |
| lettuce | veg | Lettuce | Kopfsalat | Laitue | Lattuga | 4-11 | | |
| mushroom-cultivated | veg | Cultivated mushrooms | Champignons | Champignons de Paris | Funghi coltivati | 1-12 | | |
| mushroom-wild | veg | Wild mushrooms | Waldpilze | Champignons sauvages | Funghi selvatici | 9-11 | | |
| onion | veg | Onion | Zwiebel | Oignon | Cipolla | 6-8 | 9-5 | |
| parsnip | veg | Parsnip | Pastinake | Panais | Pastinaca | 10-11 | 12-3 | |
| pea | veg | Pea | Erbse | Petit pois | Pisello | 5-8 | | |
| pepper | veg | Bell pepper | Paprika | Poivron | Peperone | 7-10 | | |
| potato | veg | Potato | Kartoffel | Pomme de terre | Patata | 5-8 | 9-4 | |
| pumpkin | veg | Pumpkin & squash | Kürbis | Courge | Zucca | 9-10 | 11-2 | |
| radicchio | veg | Radicchio | Radicchio | Radicchio | Radicchio | 10-1 | | |
| radish | veg | Radish | Radieschen | Radis | Ravanello | 4-10 | | |
| rhubarb | veg | Rhubarb | Rhabarber | Rhubarbe | Rabarbaro | 4-6 | | |
| rocket | veg | Rocket | Rucola | Roquette | Rucola | 4-10 | | |
| salsify | veg | Salsify | Schwarzwurzel | Scorsonère | Scorzonera | 10-11 | 12-2 | |
| shallot | veg | Shallot | Schalotte | Échalote | Scalogno | 7-8 | 9-12 | |
| snap-pea | veg | Snap peas | Zuckerschoten | Pois gourmands | Piselli mangiatutto | 6-8 | | |
| spinach | veg | Spinach | Spinat | Épinard | Spinacio | 4-6,9-11 | | |
| sweet-corn | veg | Sweetcorn | Zuckermais | Maïs sucré | Mais dolce | 8-10 | | |
| swiss-chard | veg | Swiss chard | Mangold | Blette | Bietola | 6-10 | | |
| tomato | veg | Tomato | Tomate | Tomate | Pomodoro | 6-10 | | |
| turnip | veg | Turnip | Weiße Rübe | Navet | Rapa bianca | 6-10 | | |
| zucchini | veg | Zucchini | Zucchini | Courgette | Zucchina | 6-9 | | |
| apple | fruit | Apple | Apfel | Pomme | Mela | 8-11 | 12-7 | |
| apricot | fruit | Apricot | Aprikose | Abricot | Albicocca | 7-8 | | |
| blackberry | fruit | Blackberry | Brombeere | Mûre | Mora | 7-10 | | |
| blueberry | fruit | Blueberry | Heidelbeere | Myrtille | Mirtillo | 6-9 | | |
| cherry | fruit | Sweet cherry | Kirsche | Cerise | Ciliegia | 6-7 | | |
| currant | fruit | Red & black currant | Johannisbeere | Groseille & cassis | Ribes | 6-8 | | |
| elderberry | fruit | Elderberry | Holunderbeere | Baie de sureau | Sambuco | 8-9 | | |
| fig | fruit | Fig | Feige | Figue | Fico | 8-10 | | south |
| grape | fruit | Grape | Traube | Raisin | Uva | 8-10 | | |
| melon | fruit | Melon | Melone | Melon | Melone | 7-9 | | |
| mirabelle | fruit | Mirabelle plum | Mirabelle | Mirabelle | Mirabella | 7-8 | | |
| nectarine-peach | fruit | Peach & nectarine | Pfirsich & Nektarine | Pêche & nectarine | Pesca & nettarina | 7-9 | | |
| pear | fruit | Pear | Birne | Poire | Pera | 8-11 | 12-4 | |
| plum | fruit | Plum | Pflaume | Prune | Susina | 8-9 | | |
| quince | fruit | Quince | Quitte | Coing | Mela cotogna | 9-10 | | |
| raspberry | fruit | Raspberry | Himbeere | Framboise | Lampone | 6-10 | | |
| strawberry | fruit | Strawberry | Erdbeere | Fraise | Fragola | 5-7 | | |
| watermelon | fruit | Watermelon | Wassermelone | Pastèque | Anguria | 7-9 | | |
| clementine | fruit | Clementine | Clementine | Clémentine | Clementina | 11-1 | | south |
| grapefruit | fruit | Grapefruit | Grapefruit | Pamplemousse | Pompelmo | 11-2 | | south |
| lemon | fruit | Lemon | Zitrone | Citron | Limone | 11-4 | | south |
| mandarin | fruit | Mandarin | Mandarine | Mandarine | Mandarino | 11-1 | | south |
| orange | fruit | Orange | Orange | Orange | Arancia | 12-4 | | south |
| basil | herb | Basil | Basilikum | Basilic | Basilico | 6-9 | | |
| chervil | herb | Chervil | Kerbel | Cerfeuil | Cerfoglio | 4-6,9-10 | | |
| chives | herb | Chives | Schnittlauch | Ciboulette | Erba cipollina | 4-10 | | |
| dill | herb | Dill | Dill | Aneth | Aneto | 5-9 | | |
| lovage | herb | Lovage | Liebstöckel | Livèche | Levistico | 4-7 | | |
| marjoram | herb | Marjoram | Majoran | Marjolaine | Maggiorana | 6-9 | | |
| mint | herb | Mint | Pfefferminze | Menthe | Menta | 4-10 | | |
| oregano | herb | Oregano | Oregano | Origan | Origano | 6-9 | | |
| parsley | herb | Parsley | Petersilie | Persil | Prezzemolo | 4-11 | | |
| rosemary | herb | Rosemary | Rosmarin | Romarin | Rosmarino | 1-12 | | |
| sage | herb | Sage | Salbei | Sauge | Salvia | 5-10 | | |
| thyme | herb | Thyme | Thymian | Thym | Timo | 5-10 | | |
| wild-garlic | herb | Wild garlic | Bärlauch | Ail des ours | Aglio orsino | 3-5 | | |
| chestnut | nut | Sweet chestnut | Esskastanie | Châtaigne | Castagna | 10-11 | | |
| hazelnut | nut | Hazelnut | Haselnuss | Noisette | Nocciola | 9-10 | | |
| walnut | nut | Walnut | Walnuss | Noix | Noce | 9-10 | | |

## UI strings (source of truth)

| key | en | de | fr | it |
|---|---|---|---|---|
| app.name | SaisonTeller | SaisonTeller | SaisonTeller | SaisonTeller |
| app.tagline | What's in season now | Was jetzt Saison hat | Ce qui est de saison | Cosa è di stagione |
| view.month | Month | Monat | Mois | Mese |
| view.season | Season | Saison | Saison | Stagione |
| season.spring | Spring | Frühling | Printemps | Primavera |
| season.summer | Summer | Sommer | Été | Estate |
| season.autumn | Autumn | Herbst | Automne | Autunno |
| season.winter | Winter | Winter | Hiver | Inverno |
| cat.all | All | Alle | Tout | Tutto |
| cat.vegetables | Vegetables | Gemüse | Légumes | Verdura |
| cat.fruits | Fruits | Obst | Fruits | Frutta |
| cat.herbs | Herbs | Kräuter | Herbes | Erbe |
| cat.nuts | Nuts | Nüsse | Fruits à coque | Frutta secca |
| label.storage | from storage | aus dem Lager | de stockage | da magazzino |
| label.originSouth | Southern Europe | Südeuropa | Europe du Sud | Europa del Sud |
| search.placeholder | Search… | Suchen… | Rechercher… | Cerca… |
| legend.harvest | harvest | Ernte | récolte | raccolto |
| legend.storage | storage | Lager | stockage | magazzino |
| results.none | Nothing matches these filters. | Nichts passt zu diesen Filtern. | Rien ne correspond à ces filtres. | Nulla corrisponde a questi filtri. |
| aria.showMonth | Show month | Monat anzeigen | Afficher le mois | Mostra mese |
| aria.toggleView | Switch between month and season view | Zwischen Monats- und Saisonansicht wechseln | Basculer entre vue mensuelle et saisonnière | Passa tra vista mensile e stagionale |
| aria.search | Search produce | Produkte suchen | Rechercher des produits | Cerca prodotti |
| footer.note | Reference calendar for Switzerland & Central Europe — nature varies by year and region. | Referenzkalender für die Schweiz & Mitteleuropa — die Natur variiert je nach Jahr und Region. | Calendrier de référence pour la Suisse et l’Europe centrale — la nature varie selon l’année et la région. | Calendario di riferimento per la Svizzera e l’Europa centrale — la natura varia secondo anno e regione. |

Page `<title>`: `{app.name} — {app.tagline}`; meta description = `footer.note`.

## Done-when

1. `npm run build` succeeds (adapter-static, prerendered `/`, `/en`, `/de`, `/fr`, `/it`).
2. `npm test` and `npm run check` pass.
3. All 4 locales complete (key-parity test).
4. Responsive, system theme, keyboard + screen-reader basics, contrast ≥ 4.5:1 both themes.
5. Code review vs `main` run and findings addressed.
6. GLOSSARY.md + ADR-0001 present.
7. Clean `git status --porcelain` on `feat/season-calendar`.

## Comments

- Round 2 changed presentation only; the dataset gained a single `image: string` (emoji) per item, everything else untouched.
- Season view removed (ADR-0001 Update appended): month navigation only, `?m=` is the sole query param; season accent + season label next to the month heading remain.
- Card illustrations: Google Noto Emoji SVGs vendored under `static/img/produce/` via `scripts/fetch-emoji.mjs` (`npm run emoji:fetch`); upstream restructured to `2D/svg/`, so that path is primary. `emojiFileName()` in `src/lib/images.ts` and the script share (duplicated, sync-noted) filename logic; an fs test enforces every referenced file exists.
- Search now spans the whole dataset when a query is active: matches split into localized "In season now" / "Not in season now" groups; out-of-season cards are dimmed (head only, strip stays legible); the strip ring keeps marking the selected month.
- Availability strip cells carry month numbers 1–12 (9px tabular digits, ≥12px cells, `minmax(12px,1fr)` columns; verified 320px no-overflow); strip is `role="img"` with an `aria.stripLabel`-based label listing harvest (+storage) months.
- "Today" pill (localized `action.today`, `aria.backToToday`) appears in the month row whenever the selected month ≠ current month — hydration-only in prerendered HTML, covered by a `svelte/server` render test of MonthSwitcher.
- `monthsOfSeason` and the `View` type were deleted (unused after season-view removal); `seasonOfMonth` stays.
