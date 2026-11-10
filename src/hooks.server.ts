import type { Handle } from '@sveltejs/kit';
import { LOCALES } from '$lib/i18n';

/**
 * Bake the correct `lang` attribute into each locale page's prerendered HTML
 * (app.html ships `lang="en"`; /de, /fr, /it get theirs rewritten at build time).
 */
export const handle: Handle = ({ event, resolve }) => {
	const segment = event.url.pathname.split('/')[1] ?? '';
	if ((LOCALES as readonly string[]).includes(segment)) {
		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('<html lang="en">', `<html lang="${segment}">`)
		});
	}
	return resolve(event);
};
