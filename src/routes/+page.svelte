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

	// Client-side language detection: base language of navigator.languages,
	// falling back to English. Runs after hydration only.
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
</svelte:head>

<!--
	Shared redirect page: must not contain locale-specific content.
	The locale links are server-rendered into the prerendered HTML, so they work
	without JavaScript; with JavaScript the script above redirects automatically.
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
