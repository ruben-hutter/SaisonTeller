#!/usr/bin/env node
// Design critique: vision model sees the current render + knows the intended
// produce (NOT blind — this is the illustrator's assistant, not the judge).
// Returns concrete compositional fixes.
// Usage: node critique.mjs <round> <id ...>
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODEL = 'glm-5.3-flash';
const round = process.argv[2];
const here = dirname(fileURLToPath(import.meta.url));
const expected = JSON.parse(readFileSync(join(here, '..', 'expected.json'), 'utf8'));
const map = JSON.parse(readFileSync(join(here, '..', 'renders', `round${round}`, 'map.json'), 'utf8'));
const auth = JSON.parse(readFileSync(join(process.env.HOME, '.pi/agent/auth.json'), 'utf8'));

for (const id of process.argv.slice(3)) {
	const png = readFileSync(join(here, '..', 'renders', `round${round}`, `${map[id]}.png`)).toString('base64');
	const { names, aliases } = expected[id];
	const res = await fetch('https://api.z.ai/api/coding/paas/v4/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${auth.zai.key}` },
		body: JSON.stringify({
			model: MODEL,
			thinking: { type: 'disabled' },
			messages: [{ role: 'user', content: [
				{ type: 'image_url', image_url: { url: `data:image/png;base64,${png}` } },
				{ type: 'text', text: [
					`This flat vector icon is SUPPOSED to depict: ${names.en} (synonyms: ${aliases.join(', ')}).`,
					'A blind image-recognition test failed for it.',
					'As an icon-design coach, answer in short bullets:',
					'1. WHAT IT READS AS NOW: which visual elements cause the misread (name the misread).',
					'2. TOP 3 FIXES: the most impactful compositional changes (shape, color, silhouette, add/remove).',
					'3. CANONICAL VIEW: the single most recognizable way to draw this produce as a flat icon.',
					'Be concrete and brutally honest.'
				].join('\n') }
			] }],
			max_tokens: 900
		})
	});
	const data = await res.json();
	const text = data.choices?.[0]?.message?.content ?? '(no content)';
	writeFileSync(join(here, '..', 'results', `critique-${id}-r${round}.md`), `# ${id} (round ${round})\n\n${text}\n`);
	console.log(`${id}: critiqued`);
}
