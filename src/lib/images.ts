/**
 * Map an emoji character to the filename of its vendored Noto Emoji SVG
 * (under `static/img/produce/`).
 *
 * KEEP IN SYNC with `scripts/fetch-emoji.mjs`: plain node scripts cannot
 * import TypeScript, so the fetch script duplicates this little function.
 * If you change the filename scheme, change both places (the fs test in
 * `items.test.ts` enforces the two agree with the committed files).
 */
export function emojiFileName(emoji: string): string {
	// Strip the emoji variation selector (U+FE0F), e.g. 🌶️ → 1f336.
	const stripped = emoji.replace(/\uFE0F/g, '');
	const codepoints = [...stripped].map((cp) => cp.codePointAt(0)!.toString(16)).join('_');
	return `emoji_u${codepoints}.svg`;
}
