#!/usr/bin/env node
// Render all bespoke SVGs to blind-named PNGs for a round.
// Usage: node render.mjs <round> [id ...]   (ids optional: render a subset)
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const round = process.argv[2];
if (!round) { console.error('usage: node render.mjs <round> [id ...]'); process.exit(1); }

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const svgDir = join(root, 'static/img/bespoke');
const outDir = join(here, '..', 'renders', `round${round}`);
mkdirSync(outDir, { recursive: true });

const expected = JSON.parse(readFileSync(join(here, '..', 'expected.json'), 'utf8'));
const only = process.argv.slice(3);
const ids = only.length ? only : Object.keys(expected);
// map.json accumulates across runs of the same round; blind names are stable per id+round.
const mapPath = join(outDir, 'map.json');
const map = existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, 'utf8')) : {};

for (const id of ids) {
	const svg = readFileSync(join(svgDir, `${id}.svg`), 'utf8');
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: 256 },
		background: 'rgba(255,255,255,1)'
	});
	const png = resvg.render().asPng();
	const blind = map[id] ?? randomBytes(6).toString('hex');
	map[id] = blind;
	writeFileSync(join(outDir, `${blind}.png`), png);
}
writeFileSync(mapPath, JSON.stringify(map, null, '\t') + '\n');
console.log(`Rendered ${ids.length} icon(s) → renders/round${round}/ (${Object.keys(map).length} total, blind names in map.json)`);
