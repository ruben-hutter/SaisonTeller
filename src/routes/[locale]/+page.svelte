<script lang="ts">
	import { page } from '$app/state';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import MonthSwitcher from '$lib/components/MonthSwitcher.svelte';
	import {
		isStorageMonth,
		items,
		itemsForMonth,
		splitBySeasonNow,
		type Category,
		type ProduceItem
	} from '$lib/data/items';
	import { LOCALES, monthName, t, type Locale, type StringKey } from '$lib/i18n';
	import { seasonOfMonth } from '$lib/seasons';
	import { BROWSER } from 'esm-env';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Local UI state (deliberately not in the URL): category filter + search.
	let search = $state('');
	let category = $state<Category | 'all'>('all');

	const locale: Locale = $derived(data.locale);

	// Query params are read client-side: prerendered pages carry no query params,
	// so SSR falls back to the build-date month; on hydration the real URL
	// (e.g. /de?m=7) is picked up immediately.
	const searchParams = $derived(BROWSER ? page.url.searchParams : undefined);
	const month: number = $derived.by(() => {
		const raw = Number(searchParams?.get('m'));
		return Number.isInteger(raw) && raw >= 1 && raw <= 12 ? raw : new Date().getMonth() + 1;
	});
	const season = $derived(seasonOfMonth(month));
	const seasonLabel = $derived(t(locale, `season.${season}`));

	const chips: { value: Category | 'all'; labelKey: StringKey }[] = [
		{ value: 'all', labelKey: 'cat.all' },
		{ value: 'vegetable', labelKey: 'cat.vegetables' },
		{ value: 'fruit', labelKey: 'cat.fruits' },
		{ value: 'herb', labelKey: 'cat.herbs' },
		{ value: 'nut', labelKey: 'cat.nuts' }
	];

	function normalize(value: string): string {
		return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
	}

	/** Category chip + search (matches the name in any of the four languages). */
	function matches(item: ProduceItem): boolean {
		if (category !== 'all' && item.category !== category) return false;
		const query = normalize(search.trim());
		if (!query) return true;
		return Object.values(item.names).some((name) => normalize(name).includes(query));
	}

	const monthResult = $derived.by(() => {
		const { harvest, storage } = itemsForMonth(month);
		return { harvest: harvest.filter(matches), storage: storage.filter(matches) };
	});

	// With an active query the grid ignores the month filter and shows every
	// match, grouped by whether it is in season in the selected month — so
	// out-of-season results can tell the user *when* the item is in season
	// (the strip still highlights the selected month).
	const searching = $derived(search.trim().length > 0);
	const searchResult = $derived(splitBySeasonNow(items.filter(matches), month));

	const realMonth = new Date().getMonth() + 1;
</script>

<svelte:head>
	<title>{t(locale, 'app.name')} — {t(locale, 'app.tagline')}</title>
	<meta name="description" content={t(locale, 'footer.note')} />
</svelte:head>

<div class="page" data-season={season}>
	<header class="site-header">
		<div class="header-inner">
			<div class="brand-block">
				<a class="brand" href={`/${locale}`}>{t(locale, 'app.name')}</a>
				<p class="tagline">{t(locale, 'app.tagline')}</p>
			</div>
			<ul class="langs">
				{#each LOCALES as l (l)}
					<li>
						<a
							href={`/${l}?m=${month}`}
							aria-current={l === locale ? 'true' : undefined}
							class:current={l === locale}
						>
							{l.toUpperCase()}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</header>

	<main class="content">
		<MonthSwitcher {locale} selected={month} current={realMonth} />

		<div class="toolbar">
			<div class="controls">
				<div class="chips">
					{#each chips as chip (chip.value)}
						<button
							class="chip"
							class:active={category === chip.value}
							aria-pressed={category === chip.value}
							onclick={() => (category = chip.value)}
						>
							{t(locale, chip.labelKey)}
						</button>
					{/each}
				</div>
				<input
					class="search"
					type="search"
					bind:value={search}
					placeholder={t(locale, 'search.placeholder')}
					aria-label={t(locale, 'aria.search')}
				/>
			</div>
		</div>

		<p class="legend">
			<span class="pair">
				<span class="swatch" data-s="harvest" aria-hidden="true"></span>
				{t(locale, 'legend.harvest')}
			</span>
			<span class="pair">
				<span class="swatch" data-s="storage" aria-hidden="true"></span>
				{t(locale, 'legend.storage')}
			</span>
		</p>

		{#snippet cardGrid(
			list: ProduceItem[],
			highlightMonth: number,
			markStorage: boolean,
			dimmed = false
		)}
			<div class="grid">
				{#each list as item (item.id)}
					<ItemCard
						{item}
						{locale}
						highlight={highlightMonth}
						fromStorage={markStorage && isStorageMonth(item, highlightMonth)}
						{dimmed}
					/>
				{/each}
			</div>
		{/snippet}

		<h1>
			{monthName(locale, month)}
			<span class="sep" aria-hidden="true">·</span>
			<span class="season-name">{seasonLabel}</span>
		</h1>
		{#if searching}
			{#if searchResult.inSeason.length === 0 && searchResult.notInSeason.length === 0}
				<p class="empty">{t(locale, 'results.none')}</p>
			{:else}
				{#if searchResult.inSeason.length}
					<h2>{t(locale, 'results.inSeason')}</h2>
					{@render cardGrid(searchResult.inSeason, month, true)}
				{/if}
				{#if searchResult.notInSeason.length}
					<h2 class="muted-heading">{t(locale, 'results.notInSeason')}</h2>
					{@render cardGrid(searchResult.notInSeason, month, true, true)}
				{/if}
			{/if}
		{:else if monthResult.harvest.length === 0 && monthResult.storage.length === 0}
			<p class="empty">{t(locale, 'results.none')}</p>
		{:else}
			{#if monthResult.harvest.length}
				<h2>{t(locale, 'legend.harvest')}</h2>
				{@render cardGrid(monthResult.harvest, month, false)}
			{/if}
			{#if monthResult.storage.length}
				<h2 class="storage-heading">{t(locale, 'legend.storage')}</h2>
				{@render cardGrid(monthResult.storage, month, true)}
			{/if}
		{/if}
	</main>

	<footer class="site-footer">
		<div class="footer-inner">
			<p>{t(locale, 'footer.note')}</p>
		</div>
	</footer>
</div>

<style>
	.page {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	/* Header */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: color-mix(in srgb, var(--bg) 90%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--border);
	}

	.header-inner {
		max-width: 1080px;
		margin: 0 auto;
		padding: 10px 20px;
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	.brand-block {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
	}

	.brand {
		color: var(--text);
		font-weight: 700;
		font-size: 1.15rem;
		letter-spacing: 0.01em;
		text-decoration: none;
	}

	.brand:hover {
		color: var(--accent-ink);
	}

	.tagline {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.langs {
		margin-left: auto;
		display: flex;
		gap: 2px;
		list-style: none;
		padding: 0;
	}

	.langs a {
		display: inline-block;
		padding: 4px 9px;
		border: 1px solid transparent;
		border-radius: 999px;
		color: var(--text-muted);
		font-size: 0.78rem;
		text-decoration: none;
		transition:
			color 120ms ease,
			border-color 120ms ease;
	}

	.langs a:hover {
		color: var(--text);
	}

	.langs a.current {
		color: var(--accent-ink);
		border-color: var(--accent);
		font-weight: 600;
	}

	/* Content */
	.content {
		flex: 1;
		width: 100%;
		max-width: 1080px;
		margin: 0 auto;
		padding: 18px 20px 48px;
	}

	.toolbar {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		padding: 6px 13px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text-muted);
		font-size: 0.84rem;
		cursor: pointer;
		transition:
			color 120ms ease,
			border-color 120ms ease,
			background-color 120ms ease;
	}

	.chip:hover {
		color: var(--text);
		border-color: var(--accent);
	}

	.chip.active {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
		font-weight: 600;
	}

	.search {
		flex: 1 1 180px;
		max-width: 280px;
		margin-left: auto;
		padding: 8px 12px;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text);
		font: inherit;
		font-size: 0.9rem;
	}

	.search::placeholder {
		color: var(--text-muted);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		margin: 14px 0 6px;
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	.pair {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}

	.swatch {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.swatch[data-s='harvest'] {
		background: var(--accent);
	}

	.swatch[data-s='storage'] {
		background: color-mix(in srgb, var(--accent) var(--storage-alpha), transparent);
	}

	h1 {
		margin: 16px 0 14px;
		font-size: 1.55rem;
		line-height: 1.25;
	}

	h1 .sep {
		color: var(--text-muted);
		font-weight: 400;
		margin: 0 2px;
	}

	h1 .season-name {
		color: var(--accent-ink);
	}

	h2 {
		margin: 18px 0 10px;
		font-size: 1.02rem;
		color: var(--accent-ink);
	}

	h2.storage-heading,
	h2.muted-heading {
		color: var(--text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 12px;
	}

	@media (max-width: 479.98px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.empty {
		margin: 28px 0;
		color: var(--text-muted);
	}

	/* Footer */
	.site-footer {
		border-top: 1px solid var(--border);
	}

	.footer-inner {
		max-width: 1080px;
		margin: 0 auto;
		padding: 16px 20px;
	}

	.footer-inner p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.8rem;
	}
</style>
