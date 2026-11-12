# Icon improvement loop 2 — two-judge protocol

**Branch:** `feat/better-produce-icons` · **Date:** 2025-11-12 · **Changed icons:** 12 of 85 (2 small batches)
**Result:** **67 / 85 stable-pass on the primary judge** (official majority-of-3 over three full-set blind
rounds: 60 icons 3/3 + 7 icons 2/3) — up from 63/85 (loop-1, single sample). 2 further icons pass on the
secondary judge only. 12 icons redesigned in 2 small batches, 6 newly stable passes, 1 principled alias fix.

---

## What was added this loop (tooling)

| Tool | Purpose |
|---|---|
| `tools/judge2.mjs` | **Second independent blind judge**: local Qwen2.5-VL-7B via Ollama (different vendor/weights; identical blind protocol & question text). `JUDGE2_SUFFIX` selects output file; results in `results/round<N>-qwen2.json`. |
| `tools/sheet.mjs` | Contact-sheet generator (256/128/64/48 px on app light `#ffffff` + dark `#1d2126` surfaces; `compare <gitref>` mode for before/after). Screenshotted with headless chromium (`npx playwright screenshot --full-page`) — chromium was already cached locally, no new deps added to the app. |
| `tools/score.mjs <round> [suffix]` | Now scores either judge's results file. |
| `tools/fetch-refs.mjs` | New search terms (raspberry, sage, chicory, kohlrabi, oregano, thyme). |
| Photo sanity test (`results/photo-sanity.json`) | The decisive diagnostic: judge the **real reference photo** of each hard case with the same blind question. Photo-PASS ⇒ the judge *knows the word* and the icon is the bottleneck (redesignable). Photo-FAIL ⇒ vocabulary/structure limit (no icon redesign can pass it). |
| Majority-of-3 stability samples | Fresh blind names per sample (new round dir), to avoid accepting one-off sampling luck (the loop-1 final-verification lesson). |

Chromatic / svg.new / browser MCPs were evaluated and deliberately not added: all screenshot needs are met
locally by resvg + headless chromium contact sheets; the visual-regression "before" state lives in git +
`snapshots/batch-{1,2}-pre/`.

## Protocol

1. **Two independent judges**: GLM-5.3-flash (z.ai API; loop-1 judge, comparable history) + Qwen2.5-VL-7B
   (local Ollama). Both see only the 256 px render + the identical fixed question. Blind hash filenames.
2. **Selection**: icons failing GLM-final + my own visual inspection + loop-1 critiques.
3. **Photo sanity test** to classify each case: icon-fixable vs judge-vocabulary-limited.
4. **Redesign** by illustrator sub-agents (isolated context): they receive botanical descriptions from refs +
   design-coach critique (a separate non-blind API role), never judge outputs, aliases, or blind filenames.
5. **Evaluation**: fresh blind render per iteration (new round dir), both judges, design critic for failures.
6. **Acceptance**: GLM pass in ≥2 of 3 blind samples (or GLM fail + Qwen pass ≥2/2 with no GLM-category
   regression — cabbage-red case), no dark/light 48 px legibility regression, design critic sign-off.
7. **Safety valve**: max 3 redesign iterations per icon per loop → hard case.

## Batch 1 (6 icons)

| icon | old GLM final | new design | GLM samples | Qwen samples | decision |
|---|---|---|---|---|---|
| spinach | ✗ tulip/artichoke | 3-leaf wavy bunch | ✓ ✓ (rank-1 ×2) | ✓ ✓ | **ACCEPT** — regression fixed |
| kale | ✗ (0 passes in 5 rounds) | frilled/scalloped leaves | ✓ ✓ (rank-1 ×2) | ✓ ✓ | **ACCEPT** — first pass ever |
| raspberry | unstable (1/3) | pink drupelets + calyx | ✓ ✓ ✓ (rank-1 ×3) | ✗ (no regression: old also ✗) | **ACCEPT** |
| cabbage-red | ✗ onion/fig/beet | green-wrapped purple head (v4) | ✗ mangosteen/fig | ✓ ✓ (**rank-1 "Cabbage"** ×2) | **KEEP** — judge-split pass; GLM photo test explains the wall (see below) |
| sage | unstable (old 0/3 on re-sample) | broad dusty-gray leaf fan (v3) | ✗ basil/bay/herb | ✗ | **KEEP v3** — old pass was sampling noise; new reads *herb* (closer category), old read *sprout/plant* |
| broad-bean | ✗ pea pod/edamame | open pod, beans + hilum (v3) | ✗ | ✗ bean pod | **KEEP v3** — hard case (see below) |

## Batch 2 (6 icons, selected by photo-sanity PASS)

| icon | old GLM final | new design | GLM samples | decision |
|---|---|---|---|---|
| swiss-chard | ✗ radish/turnip/beet | wide bunch, fat golden stems | ✓ ✓ ✓ (3/3) | **ACCEPT** |
| shallot | ✗ chestnut/pomegranate | 3-bulb cluster | ✓ ✓ ✗ (2/3) | **ACCEPT** (majority) |
| celeriac | ✗ turnip/radish/beet | knobby pale bulb + tall celery stalks | ✓ ✓ ✓ (3/3, rank-1 ×2) | **ACCEPT** — first pass ever |
| rocket | ✗ sprout/seedling | lobed leaves + arugula flowers | ✗ watercress/nasturtium ×3 (Qwen ✓ ×1) | **KEEP v2** — hard case, cress-family read (old: generic sprout) |
| radicchio | ✗ fig/snail | red bud + bold white ribs (v3) | ✗ beet/pomegranate ×2 | **KEEP v3** — hard case, vegetable-category read (old read fruit) |
| corn-salad | ✗ seaweed/grass | dense tiny-leaf clump (v3) | ✗ spinach/kale/avocado ×2 | **KEEP v3** — hard case, salad-category read (old read seaweed) |

## The mirabelle alias decision (principled, not score-gaming)

`mirabelle` + `plum` added to `aliases.json` (`aliases-CHANGELOG.md`). Justification: a mirabelle **is** a
plum (*Prunus domestica* subsp. *italica*); the blind judge names the **real photo** "Plum" rank-1 and the
icon "Plum" rank-1 — i.e. correct genus-level recognition. This follows the loop-1 confirmed precedent
(clementine + tangerine + mandarin: "visually one fruit category"). No other alias was touched; in
particular broad-bean's "edamame/pea pod" guesses were **not** aliased (different species — that would be
gaming).

## Hard cases after this loop — classified with evidence

**Judge-vocabulary-limited (photo test FAILs too; icon redesign futile):**
`lovage` (photo reads hemlock/wild carrot), `chicory` (chicon reads asparagus/bamboo; ref photos read farm tools),
`kohlrabi` (photo reads cantaloupe/corn), `thyme` (photos read brahmi/clover/cilantro), `sage` (photos read
dried herbs; icons read basil/rosemary — look-alike herbs collapse to the more famous name),
`broad-bean` (photo reaches "fava" at rank-3 only; flat pod icons structurally read edamame/pea pod).

**Icon-improvable-in-principle but iterations exhausted (photo PASS, icon still fails after 3 designs):**
`radicchio` (photo reads "Radicchio" rank-1; icon v3 now reads beet/pomegranate — closest vegetable read),
`corn-salad` (photo reads "Lamb's lettuce" rank-1; icon v3 reads salad-family),
`rocket` (photo reads "Arugula" rank-1; icon reads watercress/nasturtium — Qwen passed it once),
`wild-garlic` (photo reads "Wild garlic" rank-1; icon reads green onion — **redesignable in a future loop**),
`mint`, `marjoram`, `oregano` (photos PASS; icons still generic-herb — **best candidates for a future batch**,
photo-derived briefs already in `refs/*/description.md`).

**Judge-split pass (kept, monitor):** `cabbage-red` (Qwen 2/2 "Cabbage" rank-1; GLM photo says "Cabbage" but
never the purple-ball icon — color dominates GLM's read).

## Final verification (all 85, fresh blind names, both judges, majority-of-3)

- **GLM (primary): 67 / 85 stable-pass** — three independent full-set samples (r19/r20/r21, fresh blind
  names each): 60 icons pass 3/3, 7 pass 2/3 (basil, cabbage-savoy, cabbage-white, chestnut, hazelnut,
  lettuce, **shallot**). Single samples ranged 66–68 — sampling noise of ±1–2 icons per draw.
- Newly stable passes vs loop-1: **spinach, kale, raspberry, swiss-chard, shallot, celeriac** (all redesigned,
  ≥2/3; five of them 3/3) **+ mirabelle** (alias fix, 3/3 — "Plum" rank-1 in all three samples).
- Judge-drift noise on untouched icons (same artwork passed loop-1, fails now): `elderberry` (judge now says
  "Blackcurrants" — near-miss word-boundary vs alias "currant"), `chervil` (now consistently dill/fennel/parsley),
  `apple` (now mango/plum, "Apple" 1/3). This instability is why the official verdict uses majority-of-3.
- Qwen (secondary): **43 / 85** on the final set (baseline 38 / 85 on the identical icons — paired +5). Paired
  flips: gained cabbage-red ("Cabbage" rank-1, 2/2 stability), kale, spinach (+ noise flips chives/melon/walnut);
  lost sage (old "Sage" pass was proven sampling noise: 0/3 on re-samples). Qwen's absolute level is much
  weaker on flat icons (fails even apple/melon), so it is used as a paired-direction signal, not a bar.
  Per-icon data: `results/round19-qwen2.json` + `results/final-glm-majority.json`.

## What changed in the repo

- `static/img/bespoke/*.svg` — 12 icons redesigned: raspberry, sage, spinach, kale, cabbage-red, broad-bean,
  swiss-chard, shallot, radicchio, celeriac, rocket, corn-salad. All flat 128×128, house style.
- `.scratch/icon-recognition/` — tooling (judge2, sheet, score suffix, fetch-refs terms), snapshots
  (`snapshots/batch-{1,2}-pre/`), photo-sanity results, all rounds' blind renders + judge outputs + critiques,
  `aliases.json` + changelog, this report.
- App code untouched; `@sveltejs` app tests pass (26/26) and `svelte-check` clean.

## Reproducing

```sh
node .scratch/icon-recognition/tools/render.mjs <round> [ids]   # blind renders
node .scratch/icon-recognition/tools/judge.mjs  <round> [ids]   # GLM blind judge
node .scratch/icon-recognition/tools/judge2.mjs <round> [ids]   # Qwen blind judge (local ollama)
node .scratch/icon-recognition/tools/score.mjs  <round> [-qwen2]
node .scratch/icon-recognition/tools/sheet.mjs  <outdir> compare HEAD [ids]  # before/after sheets
```

Round map: rF = pre-loop baseline (both judges) · r5/r6/r7 = batch-1 iterations · r8 = cabbage-red v4 ·
r9–r13 = stability samples · r14/r15/r16 = batch-2 iterations · r17/r18 = batch-2 stability ·
r19/r20/r21 = **final verification, all 85, GLM ×3 (majority-of-3 = official)** · r19 also judged by Qwen.
