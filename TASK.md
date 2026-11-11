# Task: SaisonTeller round 2 — images, search beyond season, numbered strips, today button

Round 2 on the SaisonTeller app (it exists — round 1 merged to `main`; you sit in a fresh worktree off it). Work autonomously (AFK): decisions below are settled, don't re-litigate. The app source is already in this worktree; this round **changes** it. Read `TASK.md`? — this file IS the task. Also read `.scratch/season-calendar/spec.md` and `docs/agents/*.md` for conventions.

## Goal — five changes

1. **Images on produce cards** — the app reads as "a lot of text"; give every item a small colorful illustration.
2. **Remove the season view toggle** — month navigation only. Keep the season *coloring* (users like it): season accent + season label next to the month heading stay.
3. **Search beyond the current month** — searching "zucchina" in November must find it and show that it's not in season *now* (and when it is).
4. **Numbered month strips** — the 12 availability dots on each card get month numbers 1–12.
5. **"Back to today" button** — jump back to the current month from any month.

## Environment

- Node v24, npm, registry reachable, internet available (needed for image downloads).
- Repo conventions: `docs/agents/issue-tracker.md` (issues under `.scratch/season-calendar/issues/`, `Status:` lines), `docs/agents/domain.md`.

## Change 1 — Images (Noto Emoji SVGs, bundled)

- Add `image: string` (a single emoji) to each `ProduceItem`; mapping table below covers all 85 ids exactly.
- Vendor real SVG files: **Google Noto Emoji** (github.com/googlefonts/noto-emoji, `svg/emoji_u<codepoints>.svg` naming, Apache-2.0). Download once, commit under `static/img/produce/` (only the ~30 distinct glyphs needed). Do NOT hotlink; the app must work offline.
- Script `scripts/fetch-emoji.mjs` (plain node, no deps, `npm run emoji:fetch`): reads `src/lib/data/items.ts` as text, extracts `image: '<emoji>'` values, strips variation selector U+FE0F, maps each remaining codepoint (`toString(16)`, underscore-joined for multi-codepoint) to `emoji_u<cp>.svg`, downloads missing files from `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/` (fallback: `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/svg/`), skips existing, fails loudly if any is missing. Also fetch the noto-emoji `LICENSE` and save it as `static/img/produce/LICENSE` (plus a README line crediting Noto Emoji).
- Shared pure helper `src/lib/images.ts`: `emojiFileName(emoji: string): string` used by the card component; the fetch script duplicates that 3-line logic (node can't import TS) — note that in a comment in both places so they stay in sync.
- Card layout: 48px image (rounded, `aria-hidden="true"`, `alt=""` — the name text is adjacent), flex row with name + tags, availability strip below. `onerror` fallback: swap the `<img>` for the plain emoji character as text (platform emoji) so a missing file degrades gracefully.
- Cards look calmer, not busier: image left, name right, strip below — keep the current card padding/borders.

### image mapping (exact, all 85)

artichoke 🥬 · asparagus 🌱 · beetroot 🍠 · broad-bean 🫘 · broccoli 🥦 · brussels-sprouts 🥦 · cabbage-white 🥬 · cabbage-red 🥬 · cabbage-savoy 🥬 · carrot 🥕 · cauliflower 🥦 · celeriac 🥔 · celery 🌿 · chicory 🥬 · chili 🌶️ · corn-salad 🌱 · cucumber 🥒 · eggplant 🍆 · fennel 🌿 · garlic 🧄 · green-bean 🫛 · kale 🥬 · kohlrabi 🥬 · leek 🧅 · lettuce 🥗 · mushroom-cultivated 🍄 · mushroom-wild 🍄 · onion 🧅 · parsnip 🥕 · pea 🫛 · pepper 🫑 · potato 🥔 · pumpkin 🎃 · radicchio 🥬 · radish 🌶️ · rhubarb 🌿 · rocket 🌿 · salsify 🥕 · shallot 🧅 · snap-pea 🫛 · spinach 🥗 · sweet-corn 🌽 · swiss-chard 🥬 · tomato 🍅 · turnip 🥔 · zucchini 🥒 · apple 🍎 · apricot 🍑 · blackberry 🫐 · blueberry 🫐 · cherry 🍒 · currant 🍇 · elderberry 🫐 · fig 🍇 · grape 🍇 · melon 🍈 · mirabelle 🍑 · nectarine-peach 🍑 · pear 🍐 · plum 🍑 · quince 🍐 · raspberry 🍓 · strawberry 🍓 · watermelon 🍉 · clementine 🍊 · grapefruit 🍊 · lemon 🍋 · mandarin 🍊 · orange 🍊 · basil 🌿 · chervil 🌿 · chives 🌱 · dill 🌿 · lovage 🌿 · marjoram 🌿 · mint 🍀 · oregano 🌿 · parsley 🌿 · rosemary 🌿 · sage 🌿 · thyme 🌿 · wild-garlic 🌱 · chestnut 🌰 · hazelnut 🌰 · walnut 🌰

(Glyph repetition within a family is intentional — cabbages share 🥬, citrus shares 🍊. Don't "fix" it.)

## Change 2 — Remove season view

- Delete the Month/Season segmented toggle, the `view` query param and all season-view rendering (3-month sections). Routes/links keep `?m=<1..12>` only.
- Keep: season accent coloring (container `data-season`), season label next to the month heading (e.g. "November · Autumn"), month strip visuals unchanged.
- Remove now-unused code: `view.*` UI strings, `aria.toggleView`, and `monthsOfSeason` if nothing uses it after this (keep `seasonOfMonth` — accent + heading need it). Update the tests accordingly; don't delete coverage for things that remain.
- ADR-0001 mentions `view=season` as part of the query-param decision: append a short "## Update" section noting the season view was removed in round 2 (ADRs aren't silently rewritten).

## Change 3 — Search beyond the current month

- Non-empty search query ⇒ the grid shows **all items matching the query** (any-language name match, as today), filtered by active category chip, split into two groups with localized subheadings:
  - **"In season now"** (harvest or storage contains the selected month) — normal cards.
  - **"Not in season now"** (all other matches) — cards dimmed (e.g. `opacity ~0.55`, strip still fully visible/legible), so users see *when* the item is in season via the numbered strip.
- Render a group subheading only when that group is non-empty; keep the existing empty-state line only when nothing matches at all.
- Month-strip highlight (current month ring) still refers to the *selected* month — this is what makes out-of-season results informative.

## Change 4 — Numbered month strips

- Each of the 12 strip cells shows its month number (1–12). Cells: harvest = accent-filled (readable number text on it), storage = light fill, other = faint; current month = ring/outline. Two-digit numbers fit — use ~8–9px font, keep cells ≥ 12px wide. Verify nothing overflows at 320px viewport width.
- A11y: give the strip a concise `aria-label` listing harvest months (e.g. "Harvest: 6, 7, 8, 9" + storage when present); cells stay `aria-hidden`.

## Change 5 — Today button

- When the selected month ≠ current month, show a small pill button "Today" (localized, key `action.today`) near the month strip; `<a href="?m={currentMonth}">`, `aria-label` = `aria.backToToday`. Hidden when already on the current month.

## Strings (exact)

Add to all four dictionaries:

| key | en | de | fr | it |
|---|---|---|---|---|
| results.inSeason | In season now | Jetzt Saison | En saison | Di stagione |
| results.notInSeason | Not in season now | Aktuell keine Saison | Hors saison | Fuori stagione |
| action.today | Today | Heute | Aujourd'hui | Oggi |
| aria.backToToday | Back to the current month | Zurück zum aktuellen Monat | Retour au mois en cours | Torna al mese corrente |
| aria.stripLabel | Harvest months | Erntemonate | Mois de récolte | Mesi di raccolto |
| footer.credit | Illustrations: Noto Emoji (Apache 2.0) | Bilder: Noto Emoji (Apache 2.0) | Illustrations : Noto Emoji (Apache 2.0) | Immagini: Noto Emoji (Apache 2.0) |

Remove (all locales): `view.month`, `view.season`, `aria.toggleView`. Everything else stays untouched. The dictionary-parity test must still pass.

## Repo conventions (required)

1. Append a `## Comments` section (if absent) to `.scratch/season-calendar/spec.md` documenting round-2 decisions in 5–10 lines.
2. New tickets `.scratch/season-calendar/issues/05-images.md`, `06-search-beyond-season.md`, `07-month-numbers-today.md`, `08-remove-season-view.md` — `Status: ready-for-agent`, set `resolved` + proof line as you complete each.
3. Commits (conventional): `feat(images)`, `feat(search)`, `feat(ui)`, `docs(spec)` — or similarly logical, reviewable chunks.
4. `GLOSSARY.md`: no new domain terms expected; leave it unless something truly new emerged.

## Tests (keep green + extend)

- Extend `items.test.ts`: every item has a non-empty `image`; **every image file referenced by `emojiFileName()` exists in `static/img/produce/`** (fs check — this is the strongest guard for change 1).
- Dictionary parity test still passes with the adds/removes above.
- Search/selection logic: if you extracted a pure helper for the in-season/out-of-season split, unit-test it (e.g. zucchina in month 11 → out-of-season group; in month 6 → in-season group). If the logic stays inline in the component, say so in the issue and cover it via the data helpers you do have.

## Done-when (all must hold)

1. `npm run emoji:fetch` runs clean and all SVGs are committed; no downloads needed at build time.
2. `npm test` passes; `npm run check` passes; `npm run build` prerenders `/`, `/en`, `/de`, `/fr`, `/it` (still exactly 5 pages).
3. Grep-proof from the build: cards contain `<img` tags; `view=season` appears nowhere; strip cells contain month numbers; the today button link exists in a non-current-month page (e.g. render a page with `?m=1`… verify via a quick preview-server curl or a component-level check — prerendered `?m=` variants share HTML, so use your judgment and document what you verified).
4. Responsive at 320px: no horizontal overflow; strip numbers legible.
5. `/code-review` ran against the diff vs `main`; findings addressed.
6. `git status --porcelain` clean; `TASK.md` deleted at the very end.
7. Final report: what changed per change (1–5), file list, verification evidence, any judgment calls you made.

## Watch out for

- Svelte 5 runes (`$props`, `$state`, `$derived`) — match the existing code style.
- The prerendered pages share one HTML per locale (query params aren't prerendered separately) — anything month-specific must be computed client-side from `?m` / current date, exactly as the existing code already does. Don't regress that.
- Don't add dependencies. Don't re-add a theme toggle. Don't touch the dataset's months/names — this round changes presentation, not data (except the new `image` field).
- The `[locale]` page is large — keep your edits surgical; read before rewriting.
- Noto emoji filenames: 🌶️ is `emoji_u1f336.svg` (VS16 stripped) — your filename logic must match what the fetch script downloads (that's what the fs test enforces).
