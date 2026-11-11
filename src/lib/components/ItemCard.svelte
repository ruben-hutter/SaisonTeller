<script lang="ts">
	import { isHarvestMonth, isStorageMonth, type ProduceItem } from '$lib/data/items';
	import { emojiFileName } from '$lib/images';
	import { t, type Locale } from '$lib/i18n';
	import { ALL_MONTHS } from '$lib/seasons';

	interface Props {
		item: ProduceItem;
		locale: Locale;
		/** Month highlighted with a ring on the availability strip. */
		highlight: number;
		/** True when shown in the "from storage" group (dimmed accent, tag). */
		fromStorage?: boolean;
		/** True for "not in season now" search results: dimmed card, strip stays legible. */
		dimmed?: boolean;
	}

	let { item, locale, highlight, fromStorage = false, dimmed = false }: Props = $props();

	// Degrade gracefully if a vendored SVG is missing: show the plain emoji.
	let imgFailed = $state(false);

	const fileName = $derived(emojiFileName(item.image));

	const monthNumbers = ALL_MONTHS;

	// Concise screen-reader description of the visual strip: month numbers, not names.
	const stripLabel = $derived.by(() => {
		const parts = [`${t(locale, 'aria.stripLabel')}: ${item.harvest.join(', ')}`];
		if (item.storage?.length) {
			parts.push(`${t(locale, 'legend.storage')}: ${item.storage.join(', ')}`);
		}
		return parts.join('; ');
	});
</script>

<article class="card" class:from-storage={fromStorage} class:dimmed={dimmed}>
	<div class="head">
		{#if imgFailed}
			<span class="pic pic-fallback" aria-hidden="true">{item.image}</span>
		{:else}
			<img
				class="pic"
				src={`/img/produce/${fileName}`}
				alt=""
				aria-hidden="true"
				width="48"
				height="48"
				onerror={() => (imgFailed = true)}
			/>
		{/if}
		<div class="meta">
			<h3 class="name">{item.names[locale]}</h3>
			<div class="tags">
				<span class="dot" data-category={item.category} aria-hidden="true"></span>
				{#if item.origin === 'south'}
					<span class="badge">{t(locale, 'label.originSouth')}</span>
				{/if}
				{#if fromStorage}
					<span class="storage-tag">{t(locale, 'label.storage')}</span>
				{/if}
			</div>
		</div>
	</div>

	<span class="strip" role="img" aria-label={stripLabel}>
		{#each monthNumbers as m (m)}
			<span
				class="cell"
				class:harvest={isHarvestMonth(item, m)}
				class:storage={isStorageMonth(item, m)}
				class:now={m === highlight}
				aria-hidden="true"
			>
				{m}
			</span>
		{/each}
	</span>
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 14px 14px 13px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.card.from-storage {
		background: color-mix(in srgb, var(--surface) 86%, var(--bg));
	}

	/* "Not in season now" search result: dim the card, keep the strip fully
	 legible — it is what tells the user when the item IS in season. */
	.card.dimmed .head {
		opacity: 0.55;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.pic {
		flex: none;
		width: 48px;
		height: 48px;
		border-radius: 10px;
		background: var(--surface-dim);
		object-fit: contain;
	}

	/* Fallback when the vendored SVG is missing: the plain emoji character. */
	.pic-fallback {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 30px;
		line-height: 1;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
		min-height: 10px;
	}

	.name {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
	}

	.dot {
		flex: none;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.dot[data-category='vegetable'] {
		background: var(--dot-vegetable);
	}

	.dot[data-category='fruit'] {
		background: var(--dot-fruit);
	}

	.dot[data-category='herb'] {
		background: var(--dot-herb);
	}

	.dot[data-category='nut'] {
		background: var(--dot-nut);
	}

	.badge,
	.storage-tag {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		padding: 2px 8px;
		border-radius: 999px;
		white-space: nowrap;
	}

	.badge {
		color: var(--accent-ink);
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--border));
	}

	.storage-tag {
		/* Slightly dimmed accent — this item is not fresh this month. */
		color: color-mix(in srgb, var(--accent-ink) 55%, var(--text-muted));
		border: 1px dashed color-mix(in srgb, var(--accent) 40%, var(--border));
	}

	.strip {
		display: grid;
		grid-template-columns: repeat(12, minmax(12px, 1fr));
		gap: 3px;
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 16px;
		border-radius: 4px;
		background: var(--surface-dim);
		color: var(--text-muted);
		font-size: 9px;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.cell.harvest {
		background: var(--accent);
		color: var(--on-accent);
		font-weight: 700;
	}

	.cell.storage {
		background: color-mix(in srgb, var(--accent) var(--storage-alpha), transparent);
	}

	.cell.now {
		box-shadow:
			0 0 0 2px var(--surface),
			0 0 0 3.5px var(--accent-ink);
	}
</style>
