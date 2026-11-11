#!/usr/bin/env node
// Score a round: read results/round<N>.json ({ id: [g1, g2, g3] }),
// match against expected.json (names + aliases), write results/round<N>-verdicts.json.
// Usage: node score.mjs <round>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const round = process.argv[2];
const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', 'results');
const guessesPath = join(dir, `round${round}.json`);
if (!round || !existsSync(guessesPath)) {
	console.error('usage: node score.mjs <round>  (results/round<N>.json must exist)');
	process.exit(1);
}
const expected = JSON.parse(readFileSync(join(here, '..', 'expected.json'), 'utf8'));
const guesses = JSON.parse(readFileSync(guessesPath, 'utf8'));

const norm = (s) => s.toLowerCase().replace(/[’'´`]/g, "'").replace(/[^a-z0-9äöüéèêàçîôûß' ]/g, ' ').replace(/\s+/g, ' ').trim();
const contains = (haystack, needle) => {
	if (!needle) return false;
	// word-boundary containment either direction
	const h = ` ${norm(haystack)} `;
	const n = ` ${norm(needle)} `;
	return h.includes(n) || norm(haystack) === norm(needle) ||
		new RegExp(`(^| )${norm(needle).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`).test(norm(haystack));
};

const verdicts = {};
let pass = 0, fail = 0;
for (const id of Object.keys(guesses)) {
	const { names, aliases } = expected[id];
	const g = (guesses[id] ?? []).filter(Boolean);
	if (g.length === 0) { verdicts[id] = { verdict: 'MISSING', guesses: g, hit: null }; fail++; continue; }
	const synonyms = [...Object.values(names), ...aliases];
	let hit = null;
	for (const syn of synonyms) {
		for (const guess of g) {
			if (contains(guess, syn)) { hit = hit ?? { guess, synonym: syn }; }
		}
	}
	const verdict = hit ? 'PASS' : 'FAIL';
	if (hit) pass++; else fail++;
	verdicts[id] = { verdict, guesses: g, hit };
}
writeFileSync(join(dir, `round${round}-verdicts.json`), JSON.stringify(verdicts, null, '\t') + '\n');
const fails = Object.entries(verdicts).filter(([, v]) => v.verdict !== 'PASS').map(([id]) => id);
console.log(`PASS ${pass} / FAIL ${fail}`);
console.log(`fails: ${fails.join(' ') || '(none)'}`);
