import type { Handle } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';

/**
 * Bake the correct `lang` attribute into each locale page's prerendered HTML
 * (app.html ships `lang="en"`; /de, /fr, /it get theirs rewritten at build time).
 */
export const handle: Handle = ({ event, resolve }) => {
	const segment = event.url.pathname.split('/')[1] ?? '';
	if (isLocale(segment)) {
		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace(/(<html[^>]*\slang=")en(")/, `$1${segment}$2`)
		});
	}
	return resolve(event);
};
