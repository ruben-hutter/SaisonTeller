<script lang="ts">
	import type { ProduceItem } from '$lib/data/items';
	import { monthName, t, type Locale } from '$lib/i18n';

	interface Props {
		item: ProduceItem;
		locale: Locale;
		/** Month highlighted with a ring on the availability strip. */
		highlight: number;
		/** True when shown in the "from storage" group (dimmed accent, tag). */
		fromStorage?: boolean;
	}

	let { item, locale, highlight, fromStorage = false }: Props = $props();

	const monthNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

	// Screen-reader alternative to the visual availability strip.
	const summary = $derived.by(() => {
		const harvest = item.harvest.map((m) => monthName(locale, m)).join(', ');
		const parts = [`${t(locale, 'legend.harvest')}: ${harvest}`];
		if (item.storage?.length) {
			parts.push(
				`${t(locale, 'legend.storage')}: ${item.storage.map((m) => monthName(locale, m)).join(', ')}`
			);
		}
		return parts.join('; ');
	});
</script>

<article class="card" class:from-storage={fromStorage}>
	<div class="head">
		<span class="dot" data-category={item.category} aria-hidden="true"></span>
		<h3 class="name">{item.names[locale]}</h3>
		{#if item.origin === 'south'}
			<span class="badge">{t(locale, 'label.originSouth')}</span>
		{/if}
		{#if fromStorage}
			<span class="storage-tag">{t(locale, 'label.storage')}</span>
		{/if}
	</div>

	<span class="strip" aria-hidden="true">
		{#each monthNumbers as m (m)}
			<span
				class="cell"
				class:harvest={item.harvest.includes(m)}
				class:storage={(item.storage ?? []).includes(m)}
				class:now={m === highlight}
			></span>
		{/each}
	</span>
	<span class="vh">{item.names[locale]}: {summary}</span>
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

	.head {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
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
		grid-template-columns: repeat(12, 1fr);
		gap: 3px;
		height: 9px;
	}

	.cell {
		border-radius: 999px;
		background: var(--surface-dim);
	}

	.cell.harvest {
		background: var(--accent);
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
