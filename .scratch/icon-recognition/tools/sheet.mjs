#!/usr/bin/env node
// Build contact-sheet HTML files for visual inspection / screenshot testing.
// These sheets are for the HUMAN-IN-THE-LOOP orchestrator (and design critic) only —
// they carry filenames/labels and are NEVER shown to blind recognition judges.
//
// Usage:
//   node sheet.mjs <outdir> inspect  [id ...]              current icons, 256/128/64/48, light+dark
//   node sheet.mjs <outdir> compare <gitref> [id ...]      old (gitref) vs new, 128+48, light+dark
//
// Then screenshot with: npx playwright screenshot --full-page \
//   --viewport-size=<W>,600 "file://<outdir>/sheet-<n>.html" <outdir>/sheet-<n>.png
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const svgDir = join(root, 'static/img/bespoke');
const expected = JSON.parse(readFileSync(join(here, '..', 'expected.json'), 'utf8'));

const outDir = resolve(process.argv[2]);
const mode = process.argv[3] ?? 'inspect';
mkdirSync(outDir, { recursive: true });

const LIGHT = '#ffffff'; // app light surface
const DARK = '#1d2126'; // app dark surface

const svgFor = (id, gitref) => {
	if (!gitref) return readFileSync(join(svgDir, `${id}.svg`), 'utf8');
	return execFileSync('git', ['-C', root, 'show', `${gitref}:static/img/bespoke/${id}.svg`], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
};

// inline SVG as data URI (file:// pages may not load file:// imgs in some setups)
const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const tile = (svg, size, bg, pad) =>
	`<div class="tile" style="width:${size + 2 * pad}px;height:${size + 2 * pad}px;background:${bg}">` +
	`<img src="${dataUri(svg)}" width="${size}" height="${size}"></div>`;

const enName = (id) => expected[id]?.names?.en ?? id;

let ids = process.argv.slice(mode === 'compare' ? 5 : 4);
if (!ids.length) ids = Object.keys(expected);

const blocks = [];
if (mode === 'inspect') {
	for (const id of ids) {
		const svg = svgFor(id);
		const cells = [
			tile(svg, 256, LIGHT, 8), tile(svg, 128, LIGHT, 4), tile(svg, 64, LIGHT, 4), tile(svg, 48, LIGHT, 4),
			tile(svg, 256, DARK, 8), tile(svg, 128, DARK, 4), tile(svg, 64, DARK, 4), tile(svg, 48, DARK, 4)
		].join('');
		blocks.push(`<div class="row"><div class="label">${id} <span>(${enName(id)})</span></div><div class="tiles">${cells}</div></div>`);
	}
} else {
	const gitref = process.argv[4];
	for (const id of ids) {
		const oldSvg = svgFor(id, gitref);
		const newSvg = svgFor(id);
		const panel = (svg, tag) =>
			`<div class="panel"><div class="tag">${tag}</div>` +
			tile(svg, 128, LIGHT, 4) + tile(svg, 128, DARK, 4) + tile(svg, 48, LIGHT, 4) + tile(svg, 48, DARK, 4) +
			`</div>`;
		blocks.push(`<div class="row cmp"><div class="label">${id} <span>(${enName(id)})</span></div><div class="tiles">${panel(oldSvg, 'OLD')}${panel(newSvg, 'NEW')}</div></div>`);
	}
}

const css = `<style>
body{margin:0;background:#e8e8ee;font-family:system-ui,sans-serif}
.row{display:flex;align-items:center;gap:16px;padding:10px 16px;border-bottom:1px solid #d0d0d8}
.cmp{gap:32px}
.label{width:180px;font-weight:600;font-size:14px}.label span{font-weight:400;color:#666;font-size:12px}
.tiles{display:flex;gap:10px;align-items:center}
.panel{display:flex;gap:8px;align-items:center}
.tag{font-size:11px;font-weight:700;color:#fff;background:#556;padding:2px 6px;border-radius:4px}
.tile{display:flex;align-items:center;justify-content:center;border-radius:6px}
</style>`;

const PER_SHEET = 8;
let n = 0;
for (let i = 0; i < blocks.length; i += PER_SHEET) {
	n++;
	const html = `<!doctype html><html><body>${css}${blocks.slice(i, i + PER_SHEET).join('')}</body></html>`;
	writeFileSync(join(outDir, `sheet-${String(n).padStart(2, '0')}.html`), html);
}
console.log(`${blocks.length} icon(s) → ${n} sheet(s) in ${outDir}`);
