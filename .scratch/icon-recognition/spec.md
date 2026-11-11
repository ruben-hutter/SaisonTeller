# Icon recognition loop — spec

**Status:** ready-for-agent
**Branch:** `feat/better-produce-icons` (worktree `better-produce-icons`)

## Goal

Objectively validate (and iteratively improve) all 85 bespoke produce glyphs in
`static/img/bespoke/` using a blind image-recognition loop, so every icon is
recognizable as its intended object on first sight.

## Locked decisions (confirmed with user)

- **Judge:** a fresh, context-free `worker` subagent per check. Input is the
  rendered PNG only — never the filename (blind random names), the SVG source,
  or the expected object. It returns its top-3 guesses.
- **Pass criterion (lenient):** the expected object name **or a synonym**
  (item's en/de/fr/it names + curated aliases in `aliases.json`) appears
  anywhere in the judge's top-3 guesses.
- **On fail:** fetch real photos of the object from Wikimedia Commons as visual
  reference **only** (repo rule: glyphs stay project-owned, nothing copied),
  redesign the SVG in the existing flat 128×128 glyph style, re-render, re-check.
- **Safety valve:** max 3 redesign rounds per icon; still failing afterwards →
  marked "hard case" and reported to the user. No infinite loops.
- **Rendering:** 256×256 PNG, white background, via `@resvg/resvg-js`
  (devDependency).

## Tooling (this directory)

- `aliases.json` — curated synonyms per item id (incl. genus-level leniency
  where a flat icon cannot be more specific, e.g. the three cabbages).
- `tools/gen-expected.mjs` — parses `src/lib/data/items.ts` into
  `expected.json` (id → category, names ×4 locales, aliases).
- `tools/render.mjs <round>` — renders all SVGs to
  `renders/round<N>/<blind-hash>.png` and writes `renders/round<N>/map.json`
  (id → blind name; never shown to judges).
- `tools/score.mjs <round>` — scores `results/round<N>.json` (id → 3 guesses,
  collected from judge subagents) against `expected.json`; writes
  `results/round<N>-verdicts.json`.

## Report

`report.md` — final table: per icon, round-1 guesses & verdict, per-round
redesign notes, final verdict. Hard cases listed at the bottom.
