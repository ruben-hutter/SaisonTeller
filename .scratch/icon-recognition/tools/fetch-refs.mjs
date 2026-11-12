#!/usr/bin/env node
// Fetch reference photos for failing items from Wikimedia Commons.
// Usage: node fetch-refs.mjs <id ...>
// Saves .scratch/icon-recognition/refs/<id>/<n>.jpg + sources.json (url, title, license)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TERMS = {
	'artichoke': 'globe artichoke vegetable fresh',
	'broad-bean': 'fava bean pods fresh',
	'brussels-sprouts': 'brussels sprouts stalk',
	'cabbage-white': 'cabbage head vegetables market',
	'cabbage-red': 'red cabbage head',
	'cabbage-savoy': 'savoy cabbage head',
	'celeriac': 'celeriac root',
	'chicory': 'endive chicory vegetable',
	'corn-salad': "lamb's lettuce mâche",
	'fennel': 'fennel bulb vegetable',
	'kale': 'curly kale leaves',
	'kohlrabi': 'kohlrabi bulbs vegetable',
	'lettuce': 'butterhead lettuce',
	'onion': 'yellow onion bulbs',
	'potato': 'raw potatoes variety',
	'radicchio': 'radicchio head',
	'rhubarb': 'rhubarb stalks leaves',
	'rocket': 'arugula leaves',
	'salsify': 'black salsify scorzonera roots',
	'shallot': 'shallots bulbs',
	'spinach': 'fresh spinach leaves',
	'swiss-chard': 'swiss chard',
	'mirabelle': 'mirabelle plums',
	'quince': 'Cydonia oblonga quinces fruit',
	'clementine': 'clementines fruit',
	'mandarin': 'mandarin fruit leaf',
	'basil': 'fresh basil leaves',
	'chervil': 'chervil plant leaves',
	'lovage': 'lovage plant leaves',
	'marjoram': 'sweet marjoram plant',
	'mint': 'fresh mint leaves',
	'oregano': 'origanum plant',
	'rosemary': 'rosemary sprig',
	'sage': 'salvia officinalis leaves garden sage',
	'thyme': 'thyme herb plant',
	'wild-garlic': 'ramsons wild garlic leaves',
	'chestnut': 'sweet chestnuts husk',
	'raspberry': 'raspberries fruit fresh',
	'hazelnut': 'hazelnuts husk',
	'walnut': 'walnut shell half'
};

const here = dirname(fileURLToPath(import.meta.url));
const ids = process.argv.slice(2);
if (!ids.length) { console.error('usage: node fetch-refs.mjs <id ...>'); process.exit(1); }

const UA = 'SaisonTeller-icon-lab/1.0 (https://github.com/ruben-hutter/SaisonTeller; local dev tooling) node-fetch';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// serialize + polite: Wikimedia rate limits aggressive clients
const politeGet = async (url, tries = 5) => {
	for (let i = 0; i < tries; i++) {
		const res = await fetch(url, { headers: { 'user-agent': UA } });
		if (res.status === 429) { await sleep(15000 * (i + 1)); continue; }
		const text = await res.text();
		if (res.ok && !text.includes('too many requests')) return text;
		await sleep(8000 * (i + 1));
	}
	throw new Error(`gave up on ${url}`);
};

for (const id of ids) {
	const term = TERMS[id];
	if (!term) { console.error(`no search term for ${id}`); continue; }
	const dir = join(here, '..', 'refs', id);
	mkdirSync(dir, { recursive: true });
	if (existsSync(join(dir, 'sources.json'))) { console.log(`${id}: already fetched`); continue; }

	const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term + ' filetype:bitmap')}&gsrlimit=6&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&format=json`;
	const body = await politeGet(api);
	await sleep(1200);
	const data = JSON.parse(body);
	const pages = Object.values(data.query?.pages ?? {});
	const sources = [];
	let n = 0;
	for (const p of pages) {
		const info = p.imageinfo?.[0];
		if (!info || n >= 2) continue;
		const url = info.thumburl ?? info.url;
		if (!/\.(jpe?g|png)(\?|$)/i.test(url)) continue;
		const buf = Buffer.from(await (await fetch(url, { headers: { 'user-agent': UA } })).arrayBuffer());
		await sleep(1200);
		if (buf.length < 5000 || buf.slice(0, 100).toString('utf8').includes('too many requests')) continue; // skip broken/rate-limited payloads
		n++;
		writeFileSync(join(dir, `${n}.jpg`), buf);
		sources.push({ file: `${n}.jpg`, page: info.descriptionurl, title: p.title });
	}
	writeFileSync(join(dir, 'sources.json'), JSON.stringify(sources, null, '\t') + '\n');
	console.log(`${id}: ${sources.length} photo(s)`);
}
