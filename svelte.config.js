import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// GitHub Pages project site: everything is served under /SaisonTeller/.
		// The base is constant — dev (`vite dev`) and preview also live under it:
		// http://localhost:5173/SaisonTeller/ and http://localhost:4173/SaisonTeller/.
		paths: {
			base: '/SaisonTeller',
			// Absolute URLs (not ./-relative): 404.html is served by GitHub Pages at
			// any unknown path depth, where relative links would break.
			relative: false
		},
		prerender: {
			entries: ['/', '/en', '/de', '/fr', '/it']
		}
	}
};

export default config;
