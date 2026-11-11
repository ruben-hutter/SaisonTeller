#!/usr/bin/env node
// Parse src/lib/data/items.ts → .scratch/icon-recognition/expected.json
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const src = readFileSync(join(root, 'src/lib/data/items.ts'), 'utf8');
const aliases = JSON.parse(readFileSync(join(root, '.scratch/icon-recognition/aliases.json'), 'utf8'));

// Uniform blocks:
//   {
//     id: 'artichoke',
//     category: 'vegetable',
//     names: { en: 'Artichoke', de: 'Artischocke', fr: 'Artichaut', it: 'Carciofo' },
const blockRe = /id:\s*'([^']+)',\s*\n\s*category:\s*'([^']+)',\s*\n\s*names:\s*\{\s*en:\s*'([^']*)',\s*de:\s*'([^']*)',\s*fr:\s*'([^']*)',\s*it:\s*'([^']*)'/g;

const items = {};
let m;
while ((m = blockRe.exec(src))) {
	const [, id, category, en, de, fr, it] = m;
	items[id] = { category, names: { en, de, fr, it }, aliases: aliases[id] ?? [] };
}

const ids = Object.keys(items);
if (ids.length !== 85) {
	console.error(`Parsed ${ids.length} items — expected 85. Aborting.`);
	process.exit(1);
}
for (const [id, a] of Object.entries(aliases)) {
	if (!items[id]) { console.error(`alias for unknown id: ${id}`); process.exit(1); }
	if (a.length === 0) { console.error(`empty alias list: ${id}`); process.exit(1); }
}
writeFileSync(join(root, '.scratch/icon-recognition/expected.json'), JSON.stringify(items, null, '\t') + '\n');
console.log(`Wrote expected.json with ${ids.length} items.`);
