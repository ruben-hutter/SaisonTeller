import { describe, expect, it } from 'vitest';
import { emojiFileName } from './images';

describe('emojiFileName', () => {
	it('maps a single-codepoint emoji to its Noto Emoji filename', () => {
		expect(emojiFileName('🍅')).toBe('emoji_u1f345.svg');
		expect(emojiFileName('🥬')).toBe('emoji_u1f96c.svg');
	});

	it('strips the emoji variation selector (U+FE0F)', () => {
		// 🌶️ is stored upstream as emoji_u1f336.svg — no VS16 in the filename.
		expect(emojiFileName('🌶️')).toBe('emoji_u1f336.svg');
	});

	it('joins multi-codepoint emojis with underscores', () => {
		expect(emojiFileName('🇨🇭')).toBe('emoji_u1f1e8_1f1ed.svg');
	});
});
