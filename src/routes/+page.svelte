<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { LOCALES, isLocale, type Locale } from '$lib/i18n';

	// Language names in their own language — intentionally not localized.
	const languageNames: Record<Locale, string> = {
		en: 'English',
		de: 'Deutsch',
		fr: 'Français',
		it: 'Italiano'
	};

	// Pre-paint redirect: serialized into the prerendered HTML as a plain inline
	// <script> in <head>, so the browser executes it during HTML parse — before
	// the splash can ever paint. Emitted via {@html} below because Svelte
	// treats a literal <script> in markup as raw text (no {expressions} there).
	// The base path and locale list are interpolated at prerender time; the
	// locale logic mirrors the onMount fallback (first navigator.languages tag
	// whose base language is a supported locale, else 'en').
	// Pathname-guarded because this exact HTML also ships as 404.html (postbuild
	// cp) and is served at arbitrary unknown paths, where it must do nothing —
	// the onMount fallback below already handles those correctly.
	const prePaintRedirect = `<script>
(function () {
	var base = ${JSON.stringify(base)};
	if (location.pathname !== base && location.pathname !== base + '/') return;
	var locales = ${JSON.stringify(LOCALES)};
	var preferred =
		(navigator.languages || [])
			.map(function (tag) {
				return tag.split('-')[0].toLowerCase();
			})
			.find(function (lang) {
				return locales.indexOf(lang) >= 0;
			}) || 'en';
	location.replace(base + '/' + preferred + '?m=' + (new Date().getMonth() + 1));
})();
</${''}script>`;

	// Hydration-time fallback for the same redirect. Normally the inline script
	// above has already navigated away before hydration; this stays load-bearing
	// where that script is inert: 404.html served at unknown paths (JS on) and
	// as a general safety net.
	onMount(() => {
		const preferred =
			navigator.languages
				.map((tag) => tag.split('-')[0]!.toLowerCase())
				.find(isLocale) ?? 'en';
		goto(`${base}/${preferred}?m=${new Date().getMonth() + 1}`, { replaceState: true });
	});
</script>

<svelte:head>
	<title>SaisonTeller</title>
	{@html prePaintRedirect}
</svelte:head>

<!--
	Shared redirect page: must not contain locale-specific content.
	The locale links are server-rendered into the prerendered HTML, so they work
	without JavaScript; with JavaScript the inline script in <svelte:head>
	redirects before first paint, with the onMount goto as a fallback.
-->
<main class="root">
	<h1>SaisonTeller</h1>
	<ul>
		{#each LOCALES as locale (locale)}
			<li>
				<a href={`${base}/${locale}`}>{languageNames[locale]}</a>
			</li>
		{/each}
	</ul>
</main>

<style>
	.root {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 24px;
	}

	h1 {
		font-size: 1.4rem;
		margin: 0 0 12px;
		letter-spacing: 0.01em;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a {
		display: inline-block;
		padding: 8px 16px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		box-shadow: var(--shadow);
		color: var(--text);
		text-decoration: none;
		font-size: 0.95rem;
	}

	a:hover {
		border-color: var(--accent);
		color: var(--accent-ink);
	}
</style>
