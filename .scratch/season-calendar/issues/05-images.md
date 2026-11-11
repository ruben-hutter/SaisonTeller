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

## Comments (code review round)

- The spec review caught that `pepper` had been given 🎯-adjacent U+1F391 (🎑 moon-viewing ceremony) instead of 🫑 U+1FAD1 (bell pepper) — a codepoint slip in the one-off data script. Fixed; `emoji_u1f391.svg` removed, `emoji_u1fad1.svg` fetched. A fresh programmatic comparison of all 85 id→emoji pairs against the TASK.md table now reports zero mismatches.
- Hardened `items.test.ts`: new test pins the exact set of 33 distinct `emojiFileName()` results, so any accidental glyph change fails loudly (the fs-existence test alone was self-consistent only, as the review noted).
- `image:` lines reordered to sit after `names` inside each item, matching the interface field order.

## Comments (browser verification)

- Headless-Chromium check of the production build found a Svelte 5 hydration quirk: on a direct `/{locale}?m=N` load, `src` attributes on `<img>` nodes claimed from the prerendered HTML (or cloned while the keyed each re-keys from the build-month grid to `?m=N`) are not re-patched — 27 of 53 July cards kept November images. Text, aria-labels, class toggles and link hrefs all patched fine; only `img src` was affected.
- Fix: the card re-asserts `src` in a `$effect` (runs after hydration; no-op when already correct). Verified: direct `?m=7` and client-side navigation both render 53/53 correct images; `onerror` emoji fallback still works when a file is missing.
