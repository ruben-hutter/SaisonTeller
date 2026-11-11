# 09 — Icon options for the produce cards

Status: resolved

## The question

The current Noto-emoji icons give different produce the same glyph (33 glyphs
for 85 items: broccoli/Brussels sprouts/cauliflower all 🥦, 14 herbs all 🌿,
…). Which icon set should the cards use instead?

## The options (explored on the prototype branch `feat/icon-lab`)

- **A · Noto (baseline)** — what `main` ships: charming, Apache-2.0, but more
  than half the items share a glyph.
- **B · Spoonacular photos** (`?set=spoon`) — real ingredient photos, vendored
  offline; 79/85 found (rocket, salsify, mirabelle, clementine, mandarin,
  lovage have no CDN photo → Noto fallback), uneven style, photos are
  Spoonacular's (attribution/terms apply).
- **C · Bespoke SVGs** (`?set=bespoke`) — 85 hand-drawn flat pictograms, one
  per item, zero Noto fallbacks (the first round covered only the 71
  shared-emoji items; the last 14 were drawn after user feedback); 85/85
  visually distinct, one style, 53 KB, project-owned.

## How to browse

```sh
git switch feat/icon-lab && npm install && npm run dev
```

Open `/en` and use the floating black pill at the bottom: ◀/▶ or the ←/→
arrow keys cycle A → B → C; the active set is the `?set=` URL param
(shareable, survives reload). Full stats + pros/cons + recommendation:
`ICON-OPTIONS.md` at the repo root of that branch.

This is a UI-prototype branch on purpose — it will **not** be merged; the
decision gets folded back in a follow-up issue once a variant wins.

## Answer

**Decision: option C (bespoke SVGs) is promoted to production.** The 85
hand-drawn flat glyphs now live at `static/img/bespoke/<id>.svg` on
`feat/promote-bespoke`, id-keyed to the dataset so the `image` emoji field is
gone from `items.ts` entirely. The Noto machinery (vendored SVGs, fetch
script, `emojiFileName()` mapping) is retired. Bespoke glyphs are
project-owned — no attribution required.

The browsable comparison stays archived on branch `feat/icon-lab` (pushed to
origin, never merged): switch to it and run `npm install && npm run dev` to
revisit options A–C side by side.
