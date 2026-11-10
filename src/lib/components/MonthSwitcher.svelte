<script lang="ts">
	import { monthName, monthShort, t, type Locale } from '$lib/i18n';
	import { ALL_MONTHS } from '$lib/seasons';
	import type { View } from '$lib/types';

	interface Props {
		locale: Locale;
		selected: number;
		view: View;
		/** The real current month (gets a subtle outline). */
		current?: number;
	}

	let { locale, selected, view, current }: Props = $props();

	const months = ALL_MONTHS;
</script>

<nav class="months" aria-label={t(locale, 'view.month')}>
	{#each months as m (m)}
		<a
			class="month"
			href={`/${locale}?m=${m}&view=${view}`}
			aria-current={m === selected ? 'true' : undefined}
			aria-label={`${t(locale, 'aria.showMonth')} ${monthName(locale, m)}`}
			class:selected={m === selected}
			class:today={m === current}
		>
			{monthShort(locale, m)}
		</a>
	{/each}
</nav>

<style>
	.months {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 4px 0 14px;
	}

	.month {
		min-width: 44px;
		text-align: center;
		padding: 6px 9px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.82rem;
		transition:
			color 120ms ease,
			border-color 120ms ease;
	}

	.month:hover {
		color: var(--text);
		border-color: var(--accent);
	}

	.month.selected {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
		font-weight: 600;
	}

	.month.today:not(.selected) {
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 45%, transparent);
	}
</style>
