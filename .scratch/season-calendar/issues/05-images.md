# 05 — Produce card images (Noto Emoji, vendored)

Status: resolved

## What

Every produce card gets a small colorful illustration so the app reads less text-heavy.

- Add `image: string` (single emoji) to every `ProduceItem` — mapping table in TASK.md covers all 85 ids exactly; glyph repetition within a family (cabbages share 🥬, citrus shares 🍊) is intentional.
- Vendor Google Noto Emoji SVGs (Apache-2.0) under `static/img/produce/` — only the distinct glyphs used. No hotlinking; must work offline.
- `scripts/fetch-emoji.mjs` (plain node, no deps, `npm run emoji:fetch`): extracts `image: '<emoji>'` from `src/lib/data/items.ts` as text, strips U+FE0F, maps codepoints to `emoji_u<cp>.svg`, downloads missing files (raw.githubusercontent, jsdelivr fallback), skips existing, fails loudly if any missing. Also saves the noto-emoji `LICENSE` as `static/img/produce/LICENSE` and a README credit line.
- Shared pure helper `src/lib/images.ts`: `emojiFileName(emoji)`; the fetch script duplicates the logic (node can't import TS) — sync comments in both places.
- Card layout: 48px rounded image (aria-hidden, alt=""), flex row image + name + tags, strip below; `onerror` falls back to the plain emoji character.

## Tests

- `items.test.ts`: every item has a non-empty `image`; every file returned by `emojiFileName()` exists in `static/img/produce/` (fs check).

## Done

- `npm run emoji:fetch` clean; SVGs + LICENSE committed; no downloads at build time.

## Comments

- `image` added to all 85 items (exact TASK.md mapping; 33 distinct glyphs). `src/lib/images.ts` exposes `emojiFileName()`; `scripts/fetch-emoji.mjs` duplicates the 3-line logic with sync comments in both places (`npm run emoji:fetch`).
- Judgment call: noto-emoji restructured its repo — the flat `svg/` dir is now `2D/svg/` on `main`, so the task's documented URLs 404. The fetch script's primary sources were updated to `2D/svg/` (raw + jsdelivr), with the legacy `svg/` path kept as a last-resort fallback. All 33 SVGs + upstream LICENSE committed under `static/img/produce/`; re-running the script is idempotent ("All SVGs already present").
- Card layout: 48px rounded `<img>` (alt="" + aria-hidden, name text adjacent), flex head with a meta column (name over dot/badge/storage tags), strip below; `onerror` swaps to the plain emoji character via local `$state`.
- Tests: `items.test.ts` — non-empty `image` per item + fs existence check for every `emojiFileName()` result; `images.test.ts` — 🌶️ → `emoji_u1f336.svg` (VS16 stripped), multi-codepoint joining.
- Zero new dependencies: added `src/env.d.ts` ambient shims (`node:fs`, `node:path`, `process`) so svelte-check resolves the fs test without @types/node.
- Proof: `npm test` 23 passed; `npm run check` clean; `npm run build` prerenders 5 pages; built `en.html` contains `<img … src="/img/produce/emoji_u….svg" …>` tags (17 distinct SVGs for the November grid); `footer.credit` line in all four locales (2025-11-11).
