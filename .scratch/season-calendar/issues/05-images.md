# 05 — Produce card images (Noto Emoji, vendored)

Status: ready-for-agent

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
