#!/usr/bin/env node
// SECOND blind judge: local Qwen2.5-VL via Ollama — independent of the z.ai GLM judge
// (different vendor + weights + no shared prompt history). Identical blind protocol:
// the model sees ONLY the PNG bytes + the same fixed question. No ids, no paths, no hints.
// Usage: node judge2.mjs <round> [id ...]
// Writes results/round<N>-qwen2.json      { id: [guess1, guess2, guess3] }
//        results/round<N>-qwen2-raw.json  { id: { blind, model, raw } }   (audit trail)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5vl:7b';
const OLLAMA = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434/api/chat';
// Fixed question, byte-identical to the GLM judge's (tools/judge.mjs).
const QUESTION = [
	'This image shows a flat, minimalist vector-style illustration (an icon) of a single real-world object.',
	'It may be a fruit, vegetable, herb, nut, plant, or any other real-world thing.',
	'What real-world object does the illustration depict?',
	'Reply with ONLY your top 3 guesses, most likely first, one per line, in exactly this format:',
	'1. <object>',
	'2. <object>',
	'3. <object>',
	'Use short common object names (1-3 words). Do not describe the illustration or mention colors. If unsure, still give your best 3 guesses.'
].join('\n');

const round = process.argv[2];
if (!round) { console.error('usage: node judge2.mjs <round> [id ...]'); process.exit(1); }

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..');
const renderDir = join(dir, 'renders', `round${round}`);
const resultsDir = join(dir, 'results');
mkdirSync(resultsDir, { recursive: true });

const map = JSON.parse(readFileSync(join(renderDir, 'map.json'), 'utf8'));
const suffix = process.env.JUDGE2_SUFFIX ?? 'qwen2';
const outPath = join(resultsDir, `round${round}-${suffix}.json`);
const rawPath = join(resultsDir, `round${round}-${suffix}-raw.json`);
const out = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};
const raw = existsSync(rawPath) ? JSON.parse(readFileSync(rawPath, 'utf8')) : {};

const only = process.argv.slice(3);
const ids = only.length ? only : Object.keys(map);

const parse = (text) => {
	const lines = text.split('\n').map((l) => l.replace(/^\s*\d+[.)]\s*/, '').trim()).filter((l) => l.length > 0 && !/^<\/?think/i.test(l));
	return lines.slice(0, 3);
};

let done = 0;
const worker = async (queue) => {
	while (queue.length) {
		const id = queue.shift();
		const png = readFileSync(join(renderDir, `${map[id]}.png`)).toString('base64');
		const res = await fetch(OLLAMA, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				model: MODEL,
				stream: false,
				messages: [{ role: 'user', content: QUESTION, images: [png] }],
				options: { num_predict: 200, temperature: 0.2 }
			})
		});
		if (!res.ok) { console.error(`${id}: HTTP ${res.status} ${await res.text()}`); continue; }
		const data = await res.json();
		const text = data.message?.content ?? '';
		out[id] = parse(text);
		raw[id] = { blind: map[id], model: MODEL, raw: text };
		done++;
		if (done % 10 === 0) console.log(`  ${done}/${ids.length} judged`);
	}
};

const queue = [...ids];
await Promise.all(Array.from({ length: 4 }, () => worker(queue)));

const missing = ids.filter((id) => !out[id]);
writeFileSync(outPath, JSON.stringify(out, null, '\t') + '\n');
writeFileSync(rawPath, JSON.stringify(raw, null, '\t') + '\n');
console.log(`Judged ${done}/${ids.length} with ${MODEL} → results/round${round}-${suffix}.json${missing.length ? `\nMISSING: ${missing.join(' ')}` : ''}`);
