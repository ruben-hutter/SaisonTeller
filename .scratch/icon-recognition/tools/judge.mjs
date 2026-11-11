#!/usr/bin/env node
// Blind-judge a round's renders with a vision model via the z.ai API.
// The model sees ONLY the PNG bytes + a fixed question. No ids, no paths, no hints.
// Usage: node judge.mjs <round> [id ...]   (ids optional: judge a subset)
// Writes results/round<N>.json        { id: [guess1, guess2, guess3] }
//        results/round<N>-raw.json    { id: { blind, model, raw } }   (audit trail)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODEL = 'glm-5.3-flash';
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
if (!round) { console.error('usage: node judge.mjs <round> [id ...]'); process.exit(1); }

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..');
const renderDir = join(dir, 'renders', `round${round}`);
const resultsDir = join(dir, 'results');
mkdirSync(resultsDir, { recursive: true });

const map = JSON.parse(readFileSync(join(renderDir, 'map.json'), 'utf8'));
const auth = JSON.parse(readFileSync(join(process.env.HOME, '.pi/agent/auth.json'), 'utf8'));
const key = auth.zai.key;

const only = process.argv.slice(3);
const ids = only.length ? only : Object.keys(map);

// merge into existing results so partial reruns accumulate
const outPath = join(resultsDir, `round${round}.json`);
const rawPath = join(resultsDir, `round${round}-raw.json`);
const out = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};
const raw = existsSync(rawPath) ? JSON.parse(readFileSync(rawPath, 'utf8')) : {};

// pull the last numbered 1./2./3. list out of a reasoning dump
const extractList = (text) => {
	const lists = text.match(/1[.)][^]*?(?:3[.)][^\n]*)/g) ?? [];
	return lists.length ? lists[lists.length - 1] : text.split('\n').slice(-3).join('\n');
};

const parse = (text) => {
	const lines = text.split('\n').map((l) => l.replace(/^\s*\d+[.)]\s*/, '').trim()).filter((l) => l.length > 0 && !/^<\/?think/i.test(l));
	return lines.slice(0, 3);
};

let done = 0;
const worker = async (queue) => {
	while (queue.length) {
		const id = queue.shift();
		const png = readFileSync(join(renderDir, `${map[id]}.png`)).toString('base64');
		const res = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
			method: 'POST',
			headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
			body: JSON.stringify({
				model: MODEL,
				thinking: { type: 'disabled' },
				messages: [
					{ role: 'user', content: [
						{ type: 'image_url', image_url: { url: `data:image/png;base64,${png}` } },
						{ type: 'text', text: QUESTION }
					] }
				],
				max_tokens: 512
			})
		});
		if (!res.ok) { console.error(`${id}: HTTP ${res.status} ${await res.text()}`); continue; }
		const data = await res.json();
		const msg = data.choices?.[0]?.message ?? {};
		const text = msg.content?.trim() ? msg.content : extractList(msg.reasoning_content ?? '');
		out[id] = parse(text);
		raw[id] = { blind: map[id], model: MODEL, raw: text };
		done++;
		if (done % 10 === 0) console.log(`  ${done}/${ids.length} judged`);
	}
};

const queue = [...ids];
await Promise.all(Array.from({ length: 6 }, () => worker(queue)));

const missing = ids.filter((id) => !out[id]);
writeFileSync(outPath, JSON.stringify(out, null, '\t') + '\n');
writeFileSync(rawPath, JSON.stringify(raw, null, '\t') + '\n');
console.log(`Judged ${done}/${ids.length} → results/round${round}.json${missing.length ? `\nMISSING: ${missing.join(' ')}` : ''}`);
