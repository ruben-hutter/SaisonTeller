# Batch 2 — illustrator briefs

**Mission:** redraw the 6 icons below, one `<name>.svg` at a time, in
`static/img/bespoke/`. Keep everything else untouched.

## House style (non-negotiable, matches the existing collection)

- `viewBox="0 0 128 128"`, flat 2D vector, **no gradients, no filters, no text, no external refs**.
- Shapes: `<path>`, `<ellipse>`, `<circle>`, `<rect>` with flat fills; accents via
  `stroke` paths with `stroke-linecap="round"`.
- Palette: muted natural tones already used across the set. 2–5 colors per icon.
- Composition: single centered object, ~16–20px safe margin, reads instantly at 48×48 px.
- Slightly rounded/organic silhouettes; friendly, not clinical.
- Draw from the written descriptions — never trace or copy photos.

## Per-icon briefs

### 1. swiss-chard (`swiss-chard.svg`)
**Botanical:** upright bunch, 2-3 broad paddle/oval leaves with wavy edges; VERY THICK
wide stems converging at the base (golden-orange or white); bold central midrib per leaf
in the stem color + matching side veins.
**Colors:** leaf green #2E8B3D, deep green #1E5B2A, thick stems/midribs golden #F5A623
with highlight #FFD166 (or cream-white — pick one).
**Design problem:** current version is a single narrow upright leaf with a magenta stripe —
reads as a bottle/vase/rocket. Fix: a WIDE BUNCH of leaves with fat colored stems; the
stem-to-leaf contrast is the signature. Mass, not slenderness.

### 2. shallot (`shallot.svg`)
**Botanical:** 1-2 elongated egg/teardrop bulbs with pointed curved neck at top, small
root tuft at bottom; papery skin with subtle vertical striations; deep red-purple body
with lighter mauve bands; tan papery flakes at the neck.
**Colors:** body #8E3A5F, mauve band #B96A86, papery tan #C9A06A, cream roots #E5D5B8.
**Design problem:** current single bulb with stripes reads as chestnut/pomegranate.
Fix: emphasize the ONION-family identity — papery vertical striation strokes, clearly
pointed neck with a small green sprout tip, wispy root beard. Elongated, never round.

### 3. radicchio (`radicchio.svg`)
**Botanical:** compact round/oval cabbage-like head (top-side view), cream/ivory base
with bold flame-like dark-red vertical streaks running up the tightly wrapped leaves;
smooth rounded top; optionally 2 outer leaves splaying at the base.
**Colors:** cream/ivory #F2E8D5, red streaks #B02E3C, deep red #8E1F2F, base green tinge
optional #6E7B4F.
**Design problem:** current solid red-purple heart reads as fig/beet/snail. The signature
is the RED-ON-CREAM STRIPES (not solid). A ribbed/streaked round head also aligns it with
the cabbage family read.

### 4. celeriac (`celeriac.svg`)
**Botanical:** whole root, front view — roughly round KNOPPY bulb (irregular bumpy
outline, slightly flattened top), thin brown-tan skin, pale creamy flesh; a few small
celery-like stalk stubs at the crown (cut short, NOT a big leaf fan); a tuft of many
thin tangled root strands hanging from the base.
**Colors:** skin tan-brown #B08D57, darker knobs #8F6F42, flesh cream #E8DCC0, root
strands #A98B5F, stalk stubs pale green #9CAF6E.
**Design problem:** current version reads as turnip/radish/tomato (smooth + bright leaf
fan). Fix: make it brown-tan and KNOBBY (bumpy silhouette + darker knob dots), swap the
big leaf fan for 3-4 short cut stalk stubs, add many wispy roots below. Turnips are
smooth, white-purple, with two long roots — be their opposite.

### 5. rocket (`rocket.svg`)
**Botanical:** 2-3 elongated leaves with DEEP IRREGULAR ROUND LOBES along the blade
(jagged arrow/feather silhouette, like a dandelion leaf), thin pale-green stems.
**Colors:** mid green #4C7A2E, deep green #33591F, pale stems #A8C97F.
**Design problem:** current smooth lance leaves read as "sprout/seedling/plant". Fix:
the LOBES are the identity — each leaf must have 3-4 deep rounded lobes per side with
clear notches between them, visible at 48px. Slight texture blotches optional.

### 6. corn-salad (`corn-salad.svg`)
**Botanical:** low top-down rosette of 6-8 small rounded SPOON-shaped leaves radiating
from a single center point (flat starburst of little spoons); wider at the tip, narrow
at the base; smooth edges; no visible stems.
**Colors:** soft greens #7FA85A / #5C8A3C / light #B5D18A.
**Design problem:** current tuft of grass blades reads as seaweed/grass. Fix: a tidy
LOW ROSETTE of rounded spoon leaves (like a flat green flower); small, rounded, regular
radiation — that is the lamb's-lettuce look.

## Process per icon

1. Rewrite the SVG file completely (fresh composition, don't just patch).
2. QA-render at 128 and 48 px, light + dark, verify the 48 px read is unambiguous.
3. Move to the next. Do NOT touch any other file.
