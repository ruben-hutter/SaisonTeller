import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { de } from '../i18n/de';
import { en } from '../i18n/en';
import { emojiFileName } from '../images';
import { fr } from '../i18n/fr';
import { it as itDict } from '../i18n/it';
import type { Locale } from '../i18n';
import { items, itemsForMonth, splitBySeasonNow, type ProduceItem } from './items';

const CATEGORIES = ['vegetable', 'fruit', 'herb', 'nut'];
const LOCALE_KEYS: Locale[] = ['en', 'de', 'fr', 'it'];

function isAscending(values: number[]): boolean {
	return values.every((value, index) => index === 0 || value > values[index - 1]);
}

describe('items dataset integrity', () => {
	it('has the expected total number of items', () => {
		expect(items.length).toBe(85);
	});

	it('has unique kebab-case ids', () => {
		const ids = items.map((item) => item.id);
		expect(new Set(ids).size).toBe(items.length);
		for (const id of ids) {
			expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
		}
	});

	it('only uses known categories', () => {
		for (const item of items) {
			expect(CATEGORIES).toContain(item.category);
		}
	});

	it('names every item in all four locales, non-empty', () => {
		for (const item of items) {
			const keys = Object.keys(item.names);
			expect([...keys].sort()).toEqual([...LOCALE_KEYS].sort());
			for (const locale of LOCALE_KEYS) {
				expect(item.names[locale].trim().length).toBeGreaterThan(0);
			}
		}
	});

	it('has a non-empty, ascending harvest within 1..12', () => {
		for (const item of items) {
			expect(item.harvest.length).toBeGreaterThan(0);
			expect(isAscending(item.harvest)).toBe(true);
			for (const month of item.harvest) {
				expect(month).toBeGreaterThanOrEqual(1);
				expect(month).toBeLessThanOrEqual(12);
				expect(Number.isInteger(month)).toBe(true);
			}
		}
	});

	it('has ascending storage within 1..12, disjoint from harvest', () => {
		for (const item of items) {
			if (!item.storage) continue;
			expect(item.storage.length).toBeGreaterThan(0);
			expect(isAscending(item.storage)).toBe(true);
			const overlap = item.storage.filter((month) => item.harvest.includes(month));
			expect(overlap, item.id).toEqual([]);
			for (const month of item.storage) {
				expect(month).toBeGreaterThanOrEqual(1);
				expect(month).toBeLessThanOrEqual(12);
				expect(Number.isInteger(month)).toBe(true);
			}
		}
	});

	it('only uses known origins', () => {
		for (const item of items) {
			const origin = item.origin ?? 'local';
			expect(['local', 'south']).toContain(origin);
		}
	});

	it('gives every item a non-empty image emoji', () => {
		for (const item of items) {
			expect(item.image.trim().length, item.id).toBeGreaterThan(0);
		}
	});

	it('maps every image emoji to an existing vendored SVG', () => {
		// Strongest guard for the image feature: the exact file the card
		// <img src> points at must exist in static/img/produce/.
		for (const item of items) {
			const file = join(process.cwd(), 'static', 'img', 'produce', emojiFileName(item.image));
			expect(existsSync(file), `${file} (${item.id})`).toBe(true);
		}
	});
	it('marks exactly the six southern items', () => {
		const south = items.filter((item) => item.origin === 'south').map((item) => item.id);
		expect(south.sort()).toEqual(
			['clementine', 'fig', 'grapefruit', 'lemon', 'mandarin', 'orange'].sort()
		);
	});
});

describe('i18n dictionary key parity', () => {
	const dictionaries: Record<string, Record<string, string>> = {
		en,
		de,
		fr,
		it: itDict
	};

	it('all four dictionaries have identical key sets', () => {
		const reference = Object.keys(en).sort();
		for (const [name, dictionary] of Object.entries(dictionaries)) {
			expect(Object.keys(dictionary).sort(), name).toEqual(reference);
		}
	});
});

describe('itemsForMonth', () => {
	it('splits items into fresh harvest and storage-only availability', () => {
		const { harvest, storage } = itemsForMonth(1); // January
		const harvestIds = harvest.map((item) => item.id);
		const storageIds = storage.map((item) => item.id);

		// Fresh in January: rosemary, mushrooms, and the winter/wrap-around crops.
		expect(harvestIds).toContain('rosemary');
		expect(harvestIds).toContain('mushroom-cultivated');
		expect(harvestIds).toContain('brussels-sprouts');
		expect(harvestIds).toContain('kale');
		expect(harvestIds).toContain('corn-salad');
		expect(harvestIds).toContain('lemon');
		// Storage-only in January.
		expect(storageIds).toContain('apple');
		expect(storageIds).toContain('onion');
		expect(storageIds).toContain('potato');
		// Nothing appears in both groups.
		expect(harvestIds.filter((id) => storageIds.includes(id))).toEqual([]);
	});

	it('never places a storage item in the harvest group', () => {
		for (let month = 1; month <= 12; month++) {
			const { harvest, storage } = itemsForMonth(month);
			const storageSet = new Set(storage.map((item) => item.id));
			for (const item of harvest as ProduceItem[]) {
				expect(storageSet.has(item.id), `${item.id} in month ${month}`).toBe(false);
			}
		}
	});

	it('returns a reasonable September (peak harvest month)', () => {
		const { harvest } = itemsForMonth(9);
		expect(harvest.length).toBeGreaterThan(30);
	});
});

describe('splitBySeasonNow', () => {
	const byId = (id: string): ProduceItem => {
		const item = items.find((candidate) => candidate.id === id);
		if (!item) throw new Error(`no item ${id}`);
		return item;
	};

	it('places an out-of-season item in the not-in-season group (zucchini in November)', () => {
		const { inSeason, notInSeason } = splitBySeasonNow([byId('zucchini')], 11);
		expect(inSeason).toEqual([]);
		expect(notInSeason.map((item) => item.id)).toEqual(['zucchini']);
	});

	it('places an in-season item in the in-season group (zucchini in June)', () => {
		const { inSeason, notInSeason } = splitBySeasonNow([byId('zucchini')], 6);
		expect(inSeason.map((item) => item.id)).toEqual(['zucchini']);
		expect(notInSeason).toEqual([]);
	});

	it('counts storage-only months as in season (apple in May)', () => {
		// Apple: harvest 8–11, storage 12–7 → May is storage-only, still in season.
		const { inSeason, notInSeason } = splitBySeasonNow([byId('apple')], 5);
		expect(inSeason.map((item) => item.id)).toEqual(['apple']);
		expect(notInSeason).toEqual([]);
	});

	it('keeps the input order within both groups', () => {
		// Chili harvests 7-10 → out of season in November; apple harvests 8-11.
		const list = [byId('zucchini'), byId('apple'), byId('chili')];
		const { inSeason, notInSeason } = splitBySeasonNow(list, 11);
		expect(inSeason.map((item) => item.id)).toEqual(['apple']);
		expect(notInSeason.map((item) => item.id)).toEqual(['zucchini', 'chili']);
	});
});
