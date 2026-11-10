import { isLocale } from '$lib/i18n';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	// The [locale] layout guard redirects unknown locales before this runs;
	// `?m=` and `?view=` are read client-side (see +page.svelte) because
	// prerendered pages have no query params.
	return { locale: isLocale(params.locale) ? params.locale : 'en' };
};
