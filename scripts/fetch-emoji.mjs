#!/usr/bin/env node
/**
 * Download the Noto Emoji SVGs used by the produce dataset into
 * `static/img/produce/` (plus the upstream LICENSE), so the app works
 * offline and needs no downloads at build time.
 *
 * Usage: npm run emoji:fetch   (plain node, zero dependencies)
 *
 * KEEP IN SYNC with `src/lib/images.ts` — plain node cannot import the
 * TypeScript helper, so the filename scheme is duplicated here. The fs
 * test in `src/lib/data/items.test.ts` fails if the two drift apart.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(repoRoot, 'static', 'img', 'produce');
const itemsFile = join(repoRoot, 'src', 'lib', 'data', 'items.ts');

// The flat per-emoji SVGs live under `2D/svg/` since the 2025 repo restructure
// (the old top-level `svg/` path is kept as a legacy fallback).
const SOURCES = [
	'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/2D/svg/',
	'https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/2D/svg/',
	'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/'
];
const LICENSE_URL =
	'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/LICENSE';

/**
 * Same logic as `emojiFileName()` in `src/lib/images.ts` (see sync note above):
 * strip U+FE0F, then hex-join the remaining codepoints.
 */
function emojiFileName(emoji) {
	const stripped = emoji.replace(/\uFE0F/g, '');
	const codepoints = [...stripped].map((cp) => cp.codePointAt(0).toString(16)).join('_');
	return `emoji_u${codepoints}.svg`;
}

function extractEmojis(source) {
	const matches = [...source.matchAll(/image: '([^']+)'/g)].map((m) => m[1]);
	if (matches.length === 0) {
		throw new Error(`No \`image: '…'\` entries found in ${itemsFile} — did the format change?`);
	}
	return matches;
}

async function fetchText(url) {
	const response = await fetch(url, { redirect: 'follow' });
	if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
	return response.text();
}

async function download(url, dest) {
	for (const base of SOURCES) {
		try {
			const body = await fetchText(base + url);
			writeFileSync(dest, body);
			return;
		} catch (error) {
			console.error(`  ! ${base}${url} failed: ${error.message}`);
		}
	}
	throw new Error(`Could not download ${url} from any source`);
}

async function main() {
	const emojis = extractEmojis(readFileSync(itemsFile, 'utf8'));
	const files = [...new Set(emojis.map(emojiFileName))].sort();
	console.log(`${emojis.length} emojis in dataset → ${files.length} distinct SVG files`);

	mkdirSync(outDir, { recursive: true });

	const missing = files.filter((file) => !existsSync(join(outDir, file)));
	if (missing.length === 0) {
		console.log('All SVGs already present, nothing to download.');
	} else {
		console.log(`Downloading ${missing.length} missing SVG(s)…`);
		for (const file of missing) {
			await download(file, join(outDir, file));
			console.log(`  + ${file}`);
		}
	}

	const licensePath = join(outDir, 'LICENSE');
	if (!existsSync(licensePath)) {
		writeFileSync(licensePath, await fetchText(LICENSE_URL));
		console.log('  + LICENSE');
	}

	const stillMissing = files.filter((file) => !existsSync(join(outDir, file)));
	if (stillMissing.length > 0) {
		console.error(`FAILED: missing after download: ${stillMissing.join(', ')}`);
		process.exit(1);
	}
	console.log(`Done: ${files.length} SVGs + LICENSE in ${outDir}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
