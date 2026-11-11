<script lang="ts">
	import { monthName, monthShort, t, type Locale } from '$lib/i18n';
	import { ALL_MONTHS } from '$lib/seasons';

	interface Props {
		locale: Locale;
		selected: number;
		/** The real current month (gets a subtle outline). */
		current?: number;
	}

	let { locale, selected, current }: Props = $props();

	const months = ALL_MONTHS;
</script>

<div class="month-row">
	<nav class="months" aria-label={t(locale, 'aria.showMonth')}>
		{#each months as m (m)}
			<a
				class="month"
				href={`/${locale}?m=${m}`}
				aria-current={m === selected ? 'true' : undefined}
				aria-label={`${t(locale, 'aria.showMonth')} ${monthName(locale, m)}`}
				class:selected={m === selected}
				class:today={m === current}
			>
				{monthShort(locale, m)}
			</a>
		{/each}
	</nav>

	{#if current !== undefined && selected !== current}
		<a class="today-link" href={`/${locale}?m=${current}`} aria-label={t(locale, 'aria.backToToday')}>
			{t(locale, 'action.today')}
		</a>
	{/if}
</div>

<style>
	.month-row {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin: 4px 0 14px;
	}

	.months {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
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

	.today-link {
		flex: none;
		padding: 6px 13px;
		border: 1px solid var(--accent);
		border-radius: 999px;
		background: var(--surface);
		color: var(--accent-ink);
		text-decoration: none;
		font-size: 0.82rem;
		font-weight: 600;
		white-space: nowrap;
		box-shadow: var(--shadow);
		transition:
			color 120ms ease,
			background-color 120ms ease;
	}

	.today-link:hover {
		background: var(--accent);
		color: var(--on-accent);
	}
</style>
