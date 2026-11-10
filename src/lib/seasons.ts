export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Expand an inclusive month range like '7-10' into month numbers (1..12).
 * Wrap-around ranges are allowed: '10-2' = October..February.
 * The result is always sorted ascending.
 */
export function months(range: string): number[] {
	const match = /^(\d{1,2})-(\d{1,2})$/.exec(range);
	if (!match) throw new Error(`Invalid month range: '${range}'`);
	const start = Number(match[1]);
	const end = Number(match[2]);
	if (start < 1 || start > 12 || end < 1 || end > 12) {
		throw new Error(`Month range out of bounds: '${range}'`);
	}
	const result: number[] = [];
	if (start <= end) {
		for (let m = start; m <= end; m++) result.push(m);
	} else {
		for (let m = start; m <= 12; m++) result.push(m);
		for (let m = 1; m <= end; m++) result.push(m);
		result.sort((a, b) => a - b);
	}
	return result;
}

/** Meteorological season of a month (1..12): spring Mar–May, summer Jun–Aug, autumn Sep–Nov, winter Dec–Feb. */
export function seasonOfMonth(month: number): Season {
	if (month >= 3 && month <= 5) return 'spring';
	if (month >= 6 && month <= 8) return 'summer';
	if (month >= 9 && month <= 11) return 'autumn';
	return 'winter';
}

/** The three months of a season, in calendar order (winter wraps: [12, 1, 2]). */
export function monthsOfSeason(season: Season): number[] {
	switch (season) {
		case 'spring':
			return [3, 4, 5];
		case 'summer':
			return [6, 7, 8];
		case 'autumn':
			return [9, 10, 11];
		case 'winter':
			return [12, 1, 2];
	}
}
