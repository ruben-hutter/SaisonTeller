import { redirect } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	if (!isLocale(params.locale)) {
		// Unknown locale: fall back to English (client-side redirect).
		redirect(307, '/en');
	}
	return { locale: params.locale };
};
