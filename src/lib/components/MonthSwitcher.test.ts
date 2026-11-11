import { describe, expect, it } from 'vitest';
import { base } from '$app/paths';
import { render } from 'svelte/server';
import MonthSwitcher from './MonthSwitcher.svelte';

// The prerendered HTML always ships with selected === current (build-date
// fallback), so the Today button can only be observed after hydration picks
// up `?m=`. This renders the component directly for the same guarantee.
describe('MonthSwitcher', () => {
	it('shows a Today link back to the current month when another month is selected', () => {
		const { body } = render(MonthSwitcher, {
			props: { locale: 'en', selected: 1, current: 11 }
		});
		expect(body).toContain('today-link');
		expect(body).toContain(`href="${base}/en?m=11"`);
		expect(body).toContain('aria-label="Back to the current month"');
		expect(body).toContain('>Today</a>');
	});

	it('hides the Today link when already on the current month', () => {
		const { body } = render(MonthSwitcher, {
			props: { locale: 'de', selected: 11, current: 11 }
		});
		expect(body).not.toContain('today-link');
		expect(body).not.toContain('Heute');
	});

	it('links every month pill with ?m= only', () => {
		const { body } = render(MonthSwitcher, {
			props: { locale: 'fr', selected: 6, current: 6 }
		});
		expect(body).toContain(`href="${base}/fr?m=12"`);
		expect(body).not.toContain('view=');
	});
});
