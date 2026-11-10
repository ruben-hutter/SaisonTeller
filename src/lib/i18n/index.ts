import { de } from './de';
import { en, type StringKey } from './en';
import { fr } from './fr';
import { it } from './it';

export type Locale = 'en' | 'de' | 'fr' | 'it';
export type { StringKey };

export const LOCALES: readonly Locale[] = ['en', 'de', 'fr', 'it'];

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}

const dictionaries: Record<Locale, Record<StringKey, string>> = { en, de, fr, it };

/** Look up a UI string for a locale. */
export function t(locale: Locale, key: StringKey): string {
	return dictionaries[locale][key];
}

/** BCP 47 tags used for `Intl` formatting (month names etc.). */
const intlTags: Record<Locale, string> = {
	en: 'en-GB',
	de: 'de-CH',
	fr: 'fr-CH',
	it: 'it-CH'
};

function formatMonth(locale: Locale, month: number, style: 'long' | 'short'): string {
	const name = new Intl.DateTimeFormat(intlTags[locale], { month: style }).format(
		new Date(Date.UTC(2024, month - 1, 15))
	);
	// de-CH / fr-CH return lowercase first letters; capitalize for display.
	return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Full month name, capitalized ('July', 'Juli', 'Juillet', 'Luglio'). */
export function monthName(locale: Locale, month: number): string {
	return formatMonth(locale, month, 'long');
}

/** Short month name, capitalized ('Jul', 'Jan.', 'Juil.', 'Lug'). */
export function monthShort(locale: Locale, month: number): string {
	return formatMonth(locale, month, 'short');
}
