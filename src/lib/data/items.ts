import type { Locale } from '../i18n';
import { months } from '../seasons';

export type Category = 'vegetable' | 'fruit' | 'herb' | 'nut';

/** 'south' = Mediterranean produce; gets a "Southern Europe" badge in the UI. */
export type Origin = 'local' | 'south';

export interface ProduceItem {
	/** Kebab-case, unique. */
	id: string;
	category: Category;
	/** Display name per locale. */
	names: Record<Locale, string>;
	/** Illustration emoji — vendored as a Noto Emoji SVG via `emojiFileName()`. */
	image: string;
	/** Peak harvest months, 1..12, ascending. */
	harvest: number[];
	/** Months the item is still available from storage, 1..12, ascending, disjoint from harvest. */
	storage?: number[];
	/** Defaults to 'local'. */
	origin?: Origin;
}

/**
 * Reference calendar for Switzerland & Central Europe.
 * Source of truth: `.scratch/season-calendar/spec.md` (dataset table).
 */
export const items: ProduceItem[] = [
	// --- Vegetables -----------------------------------------------------------
	{
		id: 'artichoke',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Artichoke', de: 'Artischocke', fr: 'Artichaut', it: 'Carciofo' },
		harvest: months('7-10')
	},
	{
		id: 'asparagus',
		image: '🌱',
		category: 'vegetable',
		names: { en: 'Asparagus', de: 'Spargel', fr: 'Asperge', it: 'Asparagi' },
		harvest: months('4-6')
	},
	{
		id: 'beetroot',
		image: '🍠',
		category: 'vegetable',
		names: { en: 'Beetroot', de: 'Rote Bete', fr: 'Betterave rouge', it: 'Barbabietola rossa' },
		harvest: months('6-10'),
		storage: months('11-2')
	},
	{
		id: 'broad-bean',
		image: '🫘',
		category: 'vegetable',
		names: { en: 'Broad bean', de: 'Dicke Bohne', fr: 'Fève', it: 'Fava' },
		harvest: months('5-8')
	},
	{
		id: 'broccoli',
		image: '🥦',
		category: 'vegetable',
		names: { en: 'Broccoli', de: 'Brokkoli', fr: 'Brocoli', it: 'Broccolo' },
		harvest: months('6-11')
	},
	{
		id: 'brussels-sprouts',
		image: '🥦',
		category: 'vegetable',
		names: {
			en: 'Brussels sprouts',
			de: 'Rosenkohl',
			fr: 'Chou de Bruxelles',
			it: 'Cavolo di Bruxelles'
		},
		harvest: months('10-2')
	},
	{
		id: 'cabbage-white',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'White cabbage', de: 'Weißkohl', fr: 'Chou blanc', it: 'Cavolo cappuccio' },
		harvest: months('6-11'),
		storage: months('12-5')
	},
	{
		id: 'cabbage-red',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Red cabbage', de: 'Rotkohl', fr: 'Chou rouge', it: 'Cavolo rosso' },
		harvest: months('9-11'),
		storage: months('12-2')
	},
	{
		id: 'cabbage-savoy',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Savoy cabbage', de: 'Wirsing', fr: 'Chou de Milan', it: 'Cavolo verza' },
		harvest: months('9-11'),
		storage: months('12-2')
	},
	{
		id: 'carrot',
		image: '🥕',
		category: 'vegetable',
		names: { en: 'Carrot', de: 'Karotte', fr: 'Carotte', it: 'Carota' },
		harvest: months('5-10'),
		storage: months('11-4')
	},
	{
		id: 'cauliflower',
		image: '🥦',
		category: 'vegetable',
		names: { en: 'Cauliflower', de: 'Blumenkohl', fr: 'Chou-fleur', it: 'Cavolfiore' },
		harvest: months('5-11')
	},
	{
		id: 'celeriac',
		image: '🥔',
		category: 'vegetable',
		names: { en: 'Celeriac', de: 'Knollensellerie', fr: 'Céleri-rave', it: 'Sedano rapa' },
		harvest: months('8-11'),
		storage: months('12-3')
	},
	{
		id: 'celery',
		image: '🌿',
		category: 'vegetable',
		names: { en: 'Celery', de: 'Stangensellerie', fr: 'Céleri branche', it: 'Sedano' },
		harvest: months('7-11')
	},
	{
		id: 'chicory',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Belgian endive', de: 'Chicorée', fr: 'Endive', it: 'Cicoria belga' },
		harvest: months('10-11'),
		storage: months('12-3')
	},
	{
		id: 'chili',
		image: '🌶️',
		category: 'vegetable',
		names: { en: 'Chili pepper', de: 'Chilischote', fr: 'Piment', it: 'Peperoncino' },
		harvest: months('7-10')
	},
	{
		id: 'corn-salad',
		image: '🌱',
		category: 'vegetable',
		names: { en: 'Lamb’s lettuce', de: 'Feldsalat', fr: 'Mâche', it: 'Valerianella' },
		harvest: months('10-3')
	},
	{
		id: 'cucumber',
		image: '🥒',
		category: 'vegetable',
		names: { en: 'Cucumber', de: 'Gurke', fr: 'Concombre', it: 'Cetriolo' },
		harvest: months('6-9')
	},
	{
		id: 'eggplant',
		image: '🍆',
		category: 'vegetable',
		names: { en: 'Aubergine', de: 'Aubergine', fr: 'Aubergine', it: 'Melanzana' },
		harvest: months('7-10')
	},
	{
		id: 'fennel',
		image: '🌿',
		category: 'vegetable',
		names: { en: 'Fennel', de: 'Fenchel', fr: 'Fenouil', it: 'Finocchio' },
		harvest: months('6-10')
	},
	{
		id: 'garlic',
		image: '🧄',
		category: 'vegetable',
		names: { en: 'Garlic', de: 'Knoblauch', fr: 'Ail', it: 'Aglio' },
		harvest: months('7-8'),
		storage: months('9-5')
	},
	{
		id: 'green-bean',
		image: '🫛',
		category: 'vegetable',
		names: { en: 'Green bean', de: 'Grüne Bohne', fr: 'Haricot vert', it: 'Fagiolino' },
		harvest: months('6-10')
	},
	{
		id: 'kale',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Curly kale', de: 'Grünkohl', fr: 'Chou frisé', it: 'Cavolo riccio' },
		harvest: months('11-2')
	},
	{
		id: 'kohlrabi',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Kohlrabi', de: 'Kohlrabi', fr: 'Chou-rave', it: 'Cavolo rapa' },
		harvest: months('5-10')
	},
	{
		id: 'leek',
		image: '🧅',
		category: 'vegetable',
		names: { en: 'Leek', de: 'Lauch', fr: 'Poireau', it: 'Porro' },
		harvest: months('6-11'),
		storage: months('12-3')
	},
	{
		id: 'lettuce',
		image: '🥗',
		category: 'vegetable',
		names: { en: 'Lettuce', de: 'Kopfsalat', fr: 'Laitue', it: 'Lattuga' },
		harvest: months('4-11')
	},
	{
		id: 'mushroom-cultivated',
		image: '🍄',
		category: 'vegetable',
		names: {
			en: 'Cultivated mushrooms',
			de: 'Champignons',
			fr: 'Champignons de Paris',
			it: 'Funghi coltivati'
		},
		harvest: months('1-12')
	},
	{
		id: 'mushroom-wild',
		image: '🍄',
		category: 'vegetable',
		names: {
			en: 'Wild mushrooms',
			de: 'Waldpilze',
			fr: 'Champignons sauvages',
			it: 'Funghi selvatici'
		},
		harvest: months('9-11')
	},
	{
		id: 'onion',
		image: '🧅',
		category: 'vegetable',
		names: { en: 'Onion', de: 'Zwiebel', fr: 'Oignon', it: 'Cipolla' },
		harvest: months('6-8'),
		storage: months('9-5')
	},
	{
		id: 'parsnip',
		image: '🥕',
		category: 'vegetable',
		names: { en: 'Parsnip', de: 'Pastinake', fr: 'Panais', it: 'Pastinaca' },
		harvest: months('10-11'),
		storage: months('12-3')
	},
	{
		id: 'pea',
		image: '🫛',
		category: 'vegetable',
		names: { en: 'Pea', de: 'Erbse', fr: 'Petit pois', it: 'Pisello' },
		harvest: months('5-8')
	},
	{
		id: 'pepper',
		image: '🎑',
		category: 'vegetable',
		names: { en: 'Bell pepper', de: 'Paprika', fr: 'Poivron', it: 'Peperone' },
		harvest: months('7-10')
	},
	{
		id: 'potato',
		image: '🥔',
		category: 'vegetable',
		names: { en: 'Potato', de: 'Kartoffel', fr: 'Pomme de terre', it: 'Patata' },
		harvest: months('5-8'),
		storage: months('9-4')
	},
	{
		id: 'pumpkin',
		image: '🎃',
		category: 'vegetable',
		names: { en: 'Pumpkin & squash', de: 'Kürbis', fr: 'Courge', it: 'Zucca' },
		harvest: months('9-10'),
		storage: months('11-2')
	},
	{
		id: 'radicchio',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Radicchio', de: 'Radicchio', fr: 'Radicchio', it: 'Radicchio' },
		harvest: months('10-1')
	},
	{
		id: 'radish',
		image: '🌶️',
		category: 'vegetable',
		names: { en: 'Radish', de: 'Radieschen', fr: 'Radis', it: 'Ravanello' },
		harvest: months('4-10')
	},
	{
		id: 'rhubarb',
		image: '🌿',
		category: 'vegetable',
		names: { en: 'Rhubarb', de: 'Rhabarber', fr: 'Rhubarbe', it: 'Rabarbaro' },
		harvest: months('4-6')
	},
	{
		id: 'rocket',
		image: '🌿',
		category: 'vegetable',
		names: { en: 'Rocket', de: 'Rucola', fr: 'Roquette', it: 'Rucola' },
		harvest: months('4-10')
	},
	{
		id: 'salsify',
		image: '🥕',
		category: 'vegetable',
		names: { en: 'Salsify', de: 'Schwarzwurzel', fr: 'Scorsonère', it: 'Scorzonera' },
		harvest: months('10-11'),
		storage: months('12-2')
	},
	{
		id: 'shallot',
		image: '🧅',
		category: 'vegetable',
		names: { en: 'Shallot', de: 'Schalotte', fr: 'Échalote', it: 'Scalogno' },
		harvest: months('7-8'),
		storage: months('9-12')
	},
	{
		id: 'snap-pea',
		image: '🫛',
		category: 'vegetable',
		names: { en: 'Snap peas', de: 'Zuckerschoten', fr: 'Pois gourmands', it: 'Piselli mangiatutto' },
		harvest: months('6-8')
	},
	{
		id: 'spinach',
		image: '🥗',
		category: 'vegetable',
		names: { en: 'Spinach', de: 'Spinat', fr: 'Épinard', it: 'Spinacio' },
		harvest: [...months('4-6'), ...months('9-11')]
	},
	{
		id: 'sweet-corn',
		image: '🌽',
		category: 'vegetable',
		names: { en: 'Sweetcorn', de: 'Zuckermais', fr: 'Maïs sucré', it: 'Mais dolce' },
		harvest: months('8-10')
	},
	{
		id: 'swiss-chard',
		image: '🥬',
		category: 'vegetable',
		names: { en: 'Swiss chard', de: 'Mangold', fr: 'Blette', it: 'Bietola' },
		harvest: months('6-10')
	},
	{
		id: 'tomato',
		image: '🍅',
		category: 'vegetable',
		names: { en: 'Tomato', de: 'Tomate', fr: 'Tomate', it: 'Pomodoro' },
		harvest: months('6-10')
	},
	{
		id: 'turnip',
		image: '🥔',
		category: 'vegetable',
		names: { en: 'Turnip', de: 'Weiße Rübe', fr: 'Navet', it: 'Rapa bianca' },
		harvest: months('6-10')
	},
	{
		id: 'zucchini',
		image: '🥒',
		category: 'vegetable',
		names: { en: 'Zucchini', de: 'Zucchini', fr: 'Courgette', it: 'Zucchina' },
		harvest: months('6-9')
	},
	// --- Fruits ---------------------------------------------------------------
	{
		id: 'apple',
		image: '🍎',
		category: 'fruit',
		names: { en: 'Apple', de: 'Apfel', fr: 'Pomme', it: 'Mela' },
		harvest: months('8-11'),
		storage: months('12-7')
	},
	{
		id: 'apricot',
		image: '🍑',
		category: 'fruit',
		names: { en: 'Apricot', de: 'Aprikose', fr: 'Abricot', it: 'Albicocca' },
		harvest: months('7-8')
	},
	{
		id: 'blackberry',
		image: '🫐',
		category: 'fruit',
		names: { en: 'Blackberry', de: 'Brombeere', fr: 'Mûre', it: 'Mora' },
		harvest: months('7-10')
	},
	{
		id: 'blueberry',
		image: '🫐',
		category: 'fruit',
		names: { en: 'Blueberry', de: 'Heidelbeere', fr: 'Myrtille', it: 'Mirtillo' },
		harvest: months('6-9')
	},
	{
		id: 'cherry',
		image: '🍒',
		category: 'fruit',
		names: { en: 'Sweet cherry', de: 'Kirsche', fr: 'Cerise', it: 'Ciliegia' },
		harvest: months('6-7')
	},
	{
		id: 'currant',
		image: '🍇',
		category: 'fruit',
		names: {
			en: 'Red & black currant',
			de: 'Johannisbeere',
			fr: 'Groseille & cassis',
			it: 'Ribes'
		},
		harvest: months('6-8')
	},
	{
		id: 'elderberry',
		image: '🫐',
		category: 'fruit',
		names: { en: 'Elderberry', de: 'Holunderbeere', fr: 'Baie de sureau', it: 'Sambuco' },
		harvest: months('8-9')
	},
	{
		id: 'fig',
		image: '🍇',
		category: 'fruit',
		names: { en: 'Fig', de: 'Feige', fr: 'Figue', it: 'Fico' },
		harvest: months('8-10'),
		origin: 'south'
	},
	{
		id: 'grape',
		image: '🍇',
		category: 'fruit',
		names: { en: 'Grape', de: 'Traube', fr: 'Raisin', it: 'Uva' },
		harvest: months('8-10')
	},
	{
		id: 'melon',
		image: '🍈',
		category: 'fruit',
		names: { en: 'Melon', de: 'Melone', fr: 'Melon', it: 'Melone' },
		harvest: months('7-9')
	},
	{
		id: 'mirabelle',
		image: '🍑',
		category: 'fruit',
		names: { en: 'Mirabelle plum', de: 'Mirabelle', fr: 'Mirabelle', it: 'Mirabella' },
		harvest: months('7-8')
	},
	{
		id: 'nectarine-peach',
		image: '🍑',
		category: 'fruit',
		names: {
			en: 'Peach & nectarine',
			de: 'Pfirsich & Nektarine',
			fr: 'Pêche & nectarine',
			it: 'Pesca & nettarina'
		},
		harvest: months('7-9')
	},
	{
		id: 'pear',
		image: '🍐',
		category: 'fruit',
		names: { en: 'Pear', de: 'Birne', fr: 'Poire', it: 'Pera' },
		harvest: months('8-11'),
		storage: months('12-4')
	},
	{
		id: 'plum',
		image: '🍑',
		category: 'fruit',
		names: { en: 'Plum', de: 'Pflaume', fr: 'Prune', it: 'Susina' },
		harvest: months('8-9')
	},
	{
		id: 'quince',
		image: '🍐',
		category: 'fruit',
		names: { en: 'Quince', de: 'Quitte', fr: 'Coing', it: 'Mela cotogna' },
		harvest: months('9-10')
	},
	{
		id: 'raspberry',
		image: '🍓',
		category: 'fruit',
		names: { en: 'Raspberry', de: 'Himbeere', fr: 'Framboise', it: 'Lampone' },
		harvest: months('6-10')
	},
	{
		id: 'strawberry',
		image: '🍓',
		category: 'fruit',
		names: { en: 'Strawberry', de: 'Erdbeere', fr: 'Fraise', it: 'Fragola' },
		harvest: months('5-7')
	},
	{
		id: 'watermelon',
		image: '🍉',
		category: 'fruit',
		names: { en: 'Watermelon', de: 'Wassermelone', fr: 'Pastèque', it: 'Anguria' },
		harvest: months('7-9')
	},
	{
		id: 'clementine',
		image: '🍊',
		category: 'fruit',
		names: { en: 'Clementine', de: 'Clementine', fr: 'Clémentine', it: 'Clementina' },
		harvest: months('11-1'),
		origin: 'south'
	},
	{
		id: 'grapefruit',
		image: '🍊',
		category: 'fruit',
		names: { en: 'Grapefruit', de: 'Grapefruit', fr: 'Pamplemousse', it: 'Pompelmo' },
		harvest: months('11-2'),
		origin: 'south'
	},
	{
		id: 'lemon',
		image: '🍋',
		category: 'fruit',
		names: { en: 'Lemon', de: 'Zitrone', fr: 'Citron', it: 'Limone' },
		harvest: months('11-4'),
		origin: 'south'
	},
	{
		id: 'mandarin',
		image: '🍊',
		category: 'fruit',
		names: { en: 'Mandarin', de: 'Mandarine', fr: 'Mandarine', it: 'Mandarino' },
		harvest: months('11-1'),
		origin: 'south'
	},
	{
		id: 'orange',
		image: '🍊',
		category: 'fruit',
		names: { en: 'Orange', de: 'Orange', fr: 'Orange', it: 'Arancia' },
		harvest: months('12-4'),
		origin: 'south'
	},
	// --- Herbs ----------------------------------------------------------------
	{
		id: 'basil',
		image: '🌿',
		category: 'herb',
		names: { en: 'Basil', de: 'Basilikum', fr: 'Basilic', it: 'Basilico' },
		harvest: months('6-9')
	},
	{
		id: 'chervil',
		image: '🌿',
		category: 'herb',
		names: { en: 'Chervil', de: 'Kerbel', fr: 'Cerfeuil', it: 'Cerfoglio' },
		harvest: [...months('4-6'), ...months('9-10')]
	},
	{
		id: 'chives',
		image: '🌱',
		category: 'herb',
		names: { en: 'Chives', de: 'Schnittlauch', fr: 'Ciboulette', it: 'Erba cipollina' },
		harvest: months('4-10')
	},
	{
		id: 'dill',
		image: '🌿',
		category: 'herb',
		names: { en: 'Dill', de: 'Dill', fr: 'Aneth', it: 'Aneto' },
		harvest: months('5-9')
	},
	{
		id: 'lovage',
		image: '🌿',
		category: 'herb',
		names: { en: 'Lovage', de: 'Liebstöckel', fr: 'Livèche', it: 'Levistico' },
		harvest: months('4-7')
	},
	{
		id: 'marjoram',
		image: '🌿',
		category: 'herb',
		names: { en: 'Marjoram', de: 'Majoran', fr: 'Marjolaine', it: 'Maggiorana' },
		harvest: months('6-9')
	},
	{
		id: 'mint',
		image: '🍀',
		category: 'herb',
		names: { en: 'Mint', de: 'Pfefferminze', fr: 'Menthe', it: 'Menta' },
		harvest: months('4-10')
	},
	{
		id: 'oregano',
		image: '🌿',
		category: 'herb',
		names: { en: 'Oregano', de: 'Oregano', fr: 'Origan', it: 'Origano' },
		harvest: months('6-9')
	},
	{
		id: 'parsley',
		image: '🌿',
		category: 'herb',
		names: { en: 'Parsley', de: 'Petersilie', fr: 'Persil', it: 'Prezzemolo' },
		harvest: months('4-11')
	},
	{
		id: 'rosemary',
		image: '🌿',
		category: 'herb',
		names: { en: 'Rosemary', de: 'Rosmarin', fr: 'Romarin', it: 'Rosmarino' },
		harvest: months('1-12')
	},
	{
		id: 'sage',
		image: '🌿',
		category: 'herb',
		names: { en: 'Sage', de: 'Salbei', fr: 'Sauge', it: 'Salvia' },
		harvest: months('5-10')
	},
	{
		id: 'thyme',
		image: '🌿',
		category: 'herb',
		names: { en: 'Thyme', de: 'Thymian', fr: 'Thym', it: 'Timo' },
		harvest: months('5-10')
	},
	{
		id: 'wild-garlic',
		image: '🌱',
		category: 'herb',
		names: { en: 'Wild garlic', de: 'Bärlauch', fr: 'Ail des ours', it: 'Aglio orsino' },
		harvest: months('3-5')
	},
	// --- Nuts -----------------------------------------------------------------
	{
		id: 'chestnut',
		image: '🌰',
		category: 'nut',
		names: { en: 'Sweet chestnut', de: 'Esskastanie', fr: 'Châtaigne', it: 'Castagna' },
		harvest: months('10-11')
	},
	{
		id: 'hazelnut',
		image: '🌰',
		category: 'nut',
		names: { en: 'Hazelnut', de: 'Haselnuss', fr: 'Noisette', it: 'Nocciola' },
		harvest: months('9-10')
	},
	{
		id: 'walnut',
		image: '🌰',
		category: 'nut',
		names: { en: 'Walnut', de: 'Walnuss', fr: 'Noix', it: 'Noce' },
		harvest: months('9-10')
	}
];

/** True when the item is freshly harvested in this month. */
export function isHarvestMonth(item: ProduceItem, month: number): boolean {
	return item.harvest.includes(month);
}

/** True when the item is available from storage (not fresh) in this month. */
export function isStorageMonth(item: ProduceItem, month: number): boolean {
	return (item.storage ?? []).includes(month);
}

/** Items in season for a month, split into fresh harvest and storage-only availability. */
export function itemsForMonth(month: number): { harvest: ProduceItem[]; storage: ProduceItem[] } {
	return {
		harvest: items.filter((item) => isHarvestMonth(item, month)),
		storage: items.filter((item) => isStorageMonth(item, month))
	};
}

/** True when the item is available in this month at all (fresh harvest or from storage). */
export function isInSeason(item: ProduceItem, month: number): boolean {
	return isHarvestMonth(item, month) || isStorageMonth(item, month);
}

/**
 * Split a list of items (e.g. search matches) into "in season now" and
 * "not in season now" relative to a month.
 */
export function splitBySeasonNow(
	list: ProduceItem[],
	month: number
): { inSeason: ProduceItem[]; notInSeason: ProduceItem[] } {
	return {
		inSeason: list.filter((item) => isInSeason(item, month)),
		notInSeason: list.filter((item) => !isInSeason(item, month))
	};
}
