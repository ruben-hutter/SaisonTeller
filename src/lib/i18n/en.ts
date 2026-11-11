export const en = {
	'app.name': 'SaisonTeller',
	'app.tagline': "What's in season now",
	'season.spring': 'Spring',
	'season.summer': 'Summer',
	'season.autumn': 'Autumn',
	'season.winter': 'Winter',
	'cat.all': 'All',
	'cat.vegetables': 'Vegetables',
	'cat.fruits': 'Fruits',
	'cat.herbs': 'Herbs',
	'cat.nuts': 'Nuts',
	'label.storage': 'from storage',
	'label.originSouth': 'Southern Europe',
	'search.placeholder': 'Search…',
	'legend.harvest': 'harvest',
	'legend.storage': 'storage',
	'results.none': 'Nothing matches these filters.',
	'aria.showMonth': 'Show month',
	'aria.search': 'Search produce',
	'footer.note':
		'Reference calendar for Switzerland & Central Europe — nature varies by year and region.'
} as const;

export type StringKey = keyof typeof en;
