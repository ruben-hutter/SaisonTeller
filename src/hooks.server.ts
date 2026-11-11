import { base } from '$app/paths';
import type { Handle } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';

/**
 * Bake the correct `lang` attribute into each locale page's prerendered HTML
 * (app.html ships `lang="en"`; /de, /fr, /it get theirs rewritten at build time).
 */
export const handle: Handle = ({ event, resolve }) => {
	// Prerendered (and dev) pathnames include the configured base path —
	// strip it before picking the first segment (match the full segment,
	// not a prefix, so a path like /SaisonTellerox is left alone).
	const path = event.url.pathname;
	const stripped = path === base || path.startsWith(`${base}/`) ? path.slice(base.length) : path;
	const segment = stripped.split('/')[1] ?? '';
	if (isLocale(segment)) {
		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace(/(<html[^>]*\slang=")en(")/, `$1${segment}$2`)
		});
	}
	return resolve(event);
};
