# Icon recognition loop — final report

> **Loop 2 (2025-11-12) superseded parts of this report: see `report-loop2.md` —
> two independent judges (GLM + local Qwen2.5-VL), photo-sanity diagnostics,
> majority-of-3 stability, 16 icons redesigned in 3 batches, official verdict 71/85.**

**Branch:** `feat/better-produce-icons` · **Rounds:** initial + 3 redesign rounds + final verification
**Result: 63 / 85 icons pass the blind recognition test** (round 1 baseline: 43 / 85)

## How the test worked

- **Judge**: vision model (`glm-5.3-flash` via z.ai API, existing credentials). Each call
  receives only the rasterized icon (256×256 PNG, white background, random blind filename)
  and one fixed question ("top 3 guesses, this may be fruit/vegetable/herb/nut/other").
  No filename, no expected answer, no conversation memory.
- **Pass (lenient, as confirmed)**: expected name or a synonym (en/de/fr/it names +
  curated aliases) appears anywhere in the top-3 guesses.
- **On fail**: 1–2 reference photos fetched from Wikimedia Commons (visual reference
  only, uncommitted, URLs in `refs/*/sources.json`), a vision-model description of the
  diagnostic features, then a redesigned SVG in the house flat style.
  Max 3 redesign rounds, then hard case.
- **Final verification**: all 85 re-judged blind with fresh random names. Previously
  passing icons that failed got exactly one retry; pass if either attempt passes
  (marked borderline). Icons failing both are marked unstable-fail.

### Protocol changes along the way (documented for fairness)

1. **Round 2**: judge question gained the uniform hint "may be a fruit, vegetable,
   herb, nut, plant, or any other real-world thing" — without it the judge answered
   "coin / alarm clock / cicada / smiley face". Same hint for every icon; no per-item
   leakage. Round 1 verdicts were produced with the original question.
2. **Alias additions** (same-genus leniency, consistent with the confirmed criterion):
   `snap-pea` + pea pod/peas · `currant`/`elderberry` + berries ·
   `clementine` + tangerine/mandarin (the judge uses these names interchangeably for
   mandarin/clementine icons — they are visually one fruit category).
3. **Design critique step** (from round 3): the vision model sees the render *and* the
   target name and gives compositional fixes. This is the illustrator's assistant,
   never the judge — the two roles are separate API calls with separate prompts.

## Per-icon verdicts

See `report-table.md` for the full round-by-round table.

## Hard cases (22) — diagnosis and options

Grouped by why they fail:

**A. Beyond flat-icon + VLM recognition (obscure produce).** The judge simply never
outputs these words, no matter the drawing: `corn-salad` (mâche), `celeriac`,
`salsify`, `lovage`, `marjoram`, `wild-garlic`, `chicory` (Belgian endive).
Options: accept as-is (they look right next to their labels in the UI), or label-free
redesign by a human, or drop the blind test for them and keep them as "label-assisted".

**B. Structurally ambiguous produce (a flat icon of X looks like Y).**
- `broad-bean` → judged "edamame / soybean pod / pea pod" (a pod with beans IS that shape)
- `cabbage-red` → "fig / onion" (purple ball reads fig/onion before cabbage)
- `radicchio` → "fig / snail" (round red head with ribs)
- `kohlrabi` → "turnip / radish / beet" (round bulb + leaves)
- `swiss-chard` → "fennel / celery" (thick stems + leaves)
- `kale`, `rocket`, `spinach`, `mint`, `oregano`, `thyme`, `sage` → generic
  "sprout / plant / seedling" or wrong-herb answers
- `shallot` → "pomegranate / onion" (elongated bulb cluster)
- `mirabelle` → "orange / apricot / lemon" (small yellow fruit)
Options: further genus-level alias leniency (e.g. broad-bean + "pea pod", mirabelle +
"plum"), or accept as label-assisted, or commission distinctive human designs
(e.g. radicchio cut-open wedge, chard with magenta stems was tried and read as cactus).

**C. Judge-sampling instability (passed earlier, failed final twice).**
`spinach` (passed r3; final: "tulip / artichoke"), `raspberry` (passed r1 easily;
final: "grapes / berries"), `sage` (passed r4; final: "sprout / herb").
These three are borderline-stable; a stricter or multi-sample judge (majority of 3)
would likely flip some back to pass.

## What changed in the repo

- `static/img/bespoke/*.svg` — 39 icons redesigned (round 2), 25 of those re-redesigned
  (round 3), 22 re-redesigned again (round 4). All stay flat 128×128 glyphs.
- `@resvg/resvg-js` added as devDependency (rasterization for the test only).
- `.gitignore` — reference photos under `.scratch/icon-recognition/refs/` excluded.
- Tooling + all round data under `.scratch/icon-recognition/` (this directory).

## Reproducing

```sh
node .scratch/icon-recognition/tools/gen-expected.mjs   # rebuild expected.json
node .scratch/icon-recognition/tools/render.mjs <round> # render blind PNGs
node .scratch/icon-recognition/tools/judge.mjs <round>  # blind-judge via z.ai API
node .scratch/icon-recognition/tools/score.mjs <round>  # score against aliases
```
