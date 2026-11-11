#!/usr/bin/env node
// Describe reference photos of a produce item via the vision model,
// focused on features an icon illustrator needs. (Describer knows the
// produce name on purpose — it is NOT the blind judge.)
// Usage: node describe-refs.mjs <id ...>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODEL = 'glm-5.3-flash';

const here = dirname(fileURLToPath(import.meta.url));
const expected = JSON.parse(readFileSync(join(here, '..', 'expected.json'), 'utf8'));
const auth = JSON.parse(readFileSync(join(process.env.HOME, '.pi/agent/auth.json'), 'utf8'));

for (const id of process.argv.slice(2)) {
	const dir = join(here, '..', 'refs', id);
	if (!existsSync(join(dir, '1.jpg'))) { console.error(`${id}: no photos`); continue; }
	const name = expected[id].names.en;
	const content = [{
		type: 'text',
		text: [
			`These are photos of ${name} (${expected[id].category}).`,
			'You are helping an illustrator draw a small FLAT VECTOR ICON of this produce — no gradients, minimal detail.',
			'From the photos, answer in compact bullets:',
			'1. OVERALL SILHOUETTE: the single most recognizable 2D outline (which view/angle reads best).',
			'2. DISTINGUISHERS: the 2-4 visual features that tell it apart from similar-looking produce.',
			'3. COLORS: 2-4 flat colors as hex codes.',
			'Be concrete and short.'
		].join('\n')
	}];
	for (const f of ['1.jpg', '2.jpg']) {
		if (existsSync(join(dir, f))) {
			content.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${readFileSync(join(dir, f)).toString('base64')}` } });
		}
	}
	const res = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${auth.zai.key}` },
		body: JSON.stringify({
			model: MODEL,
			thinking: { type: 'disabled' },
			messages: [{ role: 'user', content }],
			max_tokens: 900
		})
	});
	const data = await res.json();
	const text = data.choices?.[0]?.message?.content ?? `(no content; finish=${data.choices?.[0]?.finish_reason})`;
	writeFileSync(join(dir, 'description.md'), `# ${name} — icon reference\n\n${text}\n`);
	console.log(`${id}: described (${text.length} chars)`);
}
