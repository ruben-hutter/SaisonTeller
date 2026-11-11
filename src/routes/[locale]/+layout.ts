import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	if (!isLocale(params.locale)) {
		// Unknown locale: fall back to English (client-side redirect).
		// `base` is required — redirect/goto locations are resolved as-is,
		// never base-prefixed by SvelteKit.
		redirect(307, `${base}/en`);
	}
	return { locale: params.locale };
};
