import { describe, expect, it } from 'vitest';
import { months, seasonOfMonth, type Season } from './seasons';

describe('months range helper', () => {
	it('expands a plain range ascending', () => {
		expect(months('7-10')).toEqual([7, 8, 9, 10]);
		expect(months('1-3')).toEqual([1, 2, 3]);
	});

	it('expands a single-month range', () => {
		expect(months('5-5')).toEqual([5]);
	});

	it('expands the full year', () => {
		expect(months('1-12')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
	});

	it('expands wrap-around ranges, sorted ascending', () => {
		expect(months('10-2')).toEqual([1, 2, 10, 11, 12]);
		expect(months('12-2')).toEqual([1, 2, 12]);
		expect(months('11-4')).toEqual([1, 2, 3, 4, 11, 12]);
	});

	it('rejects malformed or out-of-bounds ranges', () => {
		expect(() => months('7')).toThrow();
		expect(() => months('a-b')).toThrow();
		expect(() => months('0-5')).toThrow();
		expect(() => months('5-13')).toThrow();
	});
});

describe('seasonOfMonth', () => {
	it('maps every month to its season', () => {
		const expected: Season[] = [
			'winter',
			'winter',
			'spring',
			'spring',
			'spring',
			'summer',
			'summer',
			'summer',
			'autumn',
			'autumn',
			'autumn',
			'winter'
		];
		for (let m = 1; m <= 12; m++) {
			expect(seasonOfMonth(m)).toBe(expected[m - 1]);
		}
	});
});
