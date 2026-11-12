# Batch 1 — illustrator briefs

**Mission:** redraw the 6 icons below, one `<name>.svg` at a time, in
`static/img/bespoke/`. Keep everything else untouched.

## House style (non-negotiable, matches the existing collection)

- `viewBox="0 0 128 128"`, flat 2D vector, **no gradients, no filters, no text, no external refs**.
- Shapes: `<path>`, `<ellipse>`, `<circle>`, `<rect>` with flat fills; accents via
  `stroke` paths with `stroke-linecap="round"` (see tomato.svg for the accent idiom).
- Palette: muted natural tones already used across the set (greens #2E7D32/#4C7A2E/#66BB6A family,
  warm reds #DE4A38, deep purples, warm yellows). 2–5 colors per icon.
- Composition: single centered object, ~16–20px safe margin, reads instantly at 48×48 px.
- Slightly rounded/organic silhouettes; the set is friendly, not clinical.
- Project ownership: draw from the written descriptions below — never trace or copy photos.

## Per-icon briefs

### 1. raspberry (`raspberry.svg`)
**Botanical:** dome/cone of clustered round drupelets (bumpy body, NOT smooth),
thimble-like with a slight hollow at the bottom, small green leafy calyx/crown on top.
**Colors:** body #E23B57, drupelet shade #B21F3E, calyx green #4C9A45, optional light-pink highlight #F58EA0.
**Why:** current version reads as a smooth red tomato/grape cluster — hue is too
tomato-red and the body is smooth. Push pink-magenta, show drupelet bumps clearly,
make the silhouette conical and add the calyx.

### 2. sage (`sage.svg`)
**Botanical:** sprig with a visible green stem and 2–3 pairs of LONG, narrow,
pointed, lanceolate leaves attached at staggered heights; soft matte gray-green
("dusty sage") color; one subtle lighter center vein per leaf.
**Colors:** dusty gray-green #9CAF88 and #7E9B6E family, stem green #6B8E5A.
**Why:** current version reads as a moth/butterfly (two round wing-like leaves +
central body + dots). Kill the symmetry, no round leaves, no dots.

### 3. spinach (`spinach.svg`)
**Botanical:** small bunch of 3 tender, wavy-edged dark-green spinach leaves with
thin pale stems converging at the base; leaves are soft, slightly crinkled triangles
with gentle S-curves, NOT a tight rosette and NOT a tulip.
**Colors:** deep green #2E7D32, mid green #66BB6A, pale stem #C8E6C9.
**Why:** previous simpler version (3 curved leaves + pale stem, less side foliage)
worked better; the current extra side leaves make it read as a tulip bud.
Aim for that simpler read with clearer leaf waviness.

### 4. kale (`kale.svg`)
**Botanical:** bunch of curly kale: 3–5 long leaves with strongly FRILLY/SCALLOPED
wavy edges (the frill is THE identifier), standing in a loose fan from a short stem.
**Colors:** deep green #2F5D2A, mid green #4E7A3A, light green #A8C97F.
**Why:** current version has smooth edges — reads as generic plant/tree/tulip.
The ruffled outline is the whole point; make edges visibly wavy even at 48 px.

### 5. cabbage-red (`cabbage-red.svg`)
**Botanical:** roundish head of red cabbage viewed 3/4 from top: tight rosette of
overlapping leaves, wavy/scalloped outer silhouette, 2–3 visible concentric leaf
layers with thin lighter vein lines radiating from a small center; short stem nub below.
**Colors:** deep purple #6A2E8A family, lavender leaf separation #9B6BB3, pale vein strokes.
**Why:** current version reads as a purple ice-cream scoop / berry — the sphere +
swoosh highlights are the problem. Wavy leaf edges + vein lines + stem nub are the fix.

### 6. broad-bean (`broad-bean.svg`)
**Botanical:** one open bean pod, side view, slightly kidney-curved with a tapered
stem tip; inside, 3–4 fat flat bean halves, each with a distinct dark hilum line
(the black "eyebrow" on the bean edge) on a pale felt-like pod lining.
**Colors:** pod green #7CB342, lining pale #DCEDC8, beans #558B2F/#8BC34A, hilum near-black #33691E.
**Why:** current version reads as a lime wedge / jelly bean — beans must look like
BEANS (oval with hilum line) inside an OPEN pod with a visible crease, not circles
floating in a smooth blob.

## Process per icon

1. Rewrite the SVG file completely (fresh composition, don't just patch).
2. Sanity-render at 128 and 48 px and confirm the 48 px read is unambiguous.
3. Move to the next. Do NOT touch any other file.
