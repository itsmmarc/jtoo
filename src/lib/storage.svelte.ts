import { PersistentState } from '@friendofsvelte/state';

export const Fonts = [
	'font-cause',
	'font-comic-relief',
	'font-courier-prime',
	'font-fredoka',
	'font-inter',
	'font-bebas',
	'font-montserrat',
	'font-roboto',
	'font-space-grotesk'
] as const;
export type Font = (typeof Fonts)[number];

export type Settings = {
	font: Font;
	hue: number;
	saturation: number;
	enableMovingBG: boolean;
	enablePRs: boolean;
	enableAvatars: boolean;
	enableTags: boolean;
	enableFlags: boolean;
	enableGradient: boolean;
	enableTeamColors: boolean;
	enableSinglePOV: boolean;
	enablePOVGuide: boolean;
	webSocketToken: string;
};

export type Vector = {
	x: number;
	y: number;
	z: number;
};
export type Zone = {
	p1: Vector;
	p2: Vector;
};
export type Zones = {
	start: Zone;
	end: Zone;
	cp?: Zone[];
};
export type Map = {
	fileName: string;
	shortName: string;
	ID: string;
	imageURL?: string;
	zones?: Zones;
	minimap?: { graphic: string; bounds: Zone };
};

export type MapPRs<T> = {
	[K in keyof T]: { rank: number; time: string };
};

export type MapsInfo<SoldierMapList> = {
	[K in keyof SoldierMapList]: Map;
};

export const TFClasses = ['demo', 'soldier', 'overall'] as const;
export type TFClass = (typeof TFClasses)[number];

export type Rank = {
	[key in TFClass]: number;
};

export type Player = {
	name: string;
	score: number;
	tempusID?: string;
	steamID64?: string;
	avatarURL?: string;
	tag?: string;
	flag?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pr?: MapPRs<any>;
	rank?: Rank;
	WRs?: number;
	TTs?: number;
	bestRun?: string;
	note?: string;
	favouriteMap?: string;
};

export type Overlay = {
	bestOf: number;
	leftPlayer: Player;
	rightPlayer: Player;
	map: Map;
	stage: string;
	class: TFClass;
};

export type Items = {
	players: Player[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	maps: MapsInfo<any>;
	stages: Array<string>;
};

export type Playoffs2026SoldierMapList = {
	pokus?: unknown;
	marigold?: unknown;
	phobos?: unknown;
	oddie?: unknown;
	ahh?: unknown;
	soar?: unknown;
	above?: unknown;
};
export type Playoffs2026DemoMapList = {
	tissue?: unknown;
	carbon?: unknown;
	data?: unknown;
	greenguy2?: unknown;
	legocroc?: unknown;
	nbn?: unknown;
};

export const soldierPlayoffs2026 = {
	players: [
		{ name: '', score: 0, pr: {} },
		{
			name: 'vice',
			tempusID: '10736',
			steamID64: '76561198366368448',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/75f84c1f8d7956ad4521718c53c6a7b381e3acee_full.jpg',
			tag: 'fuck vice',
			flag: 'sg',
			rank: { overall: 1, soldier: 2, demo: 1 },
			pr: {
				pokus: { rank: 1, time: '03:10.935' },
				marigold: { rank: 3, time: '01:18.629' },
				phobos: { rank: 1, time: '01:07.965' },
				oddie: { rank: 4, time: '01:51.855' },
				ahh: { rank: 1, time: '00:59.895' },
				soar: { rank: 3, time: '04:04.995' },
				above: { rank: 5, time: '01:13.305' }
			},
			WRs: 320,
			TTs: 2167,
			bestRun: 'jump_phobos',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Nikita',
			tempusID: '602086',
			steamID64: '76561199514776310',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/7e66f539d7f62409db0a6b9a39f5d7334d549a7a_full.jpg',
			tag: '',
			flag: 'se',
			rank: { overall: 2, soldier: 1, demo: 2579 },
			pr: {
				pokus: { rank: 2, time: '03:13.034' },
				marigold: { rank: 6, time: '01:20.549' },
				phobos: { rank: 7, time: '01:16.215' },
				oddie: { rank: 2, time: '01:48.510' },
				ahh: { rank: 395, time: '01:57.015' },
				soar: { rank: 5, time: '04:14.580' },
				above: { rank: 297, time: '01:49.724' }
			},
			WRs: 423,
			TTs: 535,
			bestRun: '?',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Garf',
			tempusID: '579826',
			steamID64: '76561199243400809',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/45005e86d752dcb1439be9c937ee1ce6e2b4d0ab_full.jpg',
			tag: '',
			flag: 'pl',
			rank: { overall: 8, soldier: 6, demo: 390 },
			pr: {
				pokus: { rank: 57, time: '04:20.640' },
				marigold: { rank: 7, time: '01:22.125' },
				phobos: { rank: 2, time: '01:10.245' },
				oddie: { rank: 3, time: '01:49.770' },
				ahh: { rank: 2, time: '01:01.230' },
				soar: { rank: 4, time: '04:09.945' },
				above: { rank: 2, time: '01:12.945' }
			},
			WRs: 93,
			TTs: 915,
			bestRun: 'jump_yona',
			note: 'hello',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'bunny.',
			tempusID: '357942',
			steamID64: '76561198201985399',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/5f84395a8424e7d4828f6b18c9cb90a12fa24ed4_full.jpg',
			tag: '',
			flag: 'fi',
			rank: { overall: 4, soldier: 4, demo: 42 },
			pr: {
				pokus: { rank: 3, time: '03:16.125' },
				marigold: { rank: 1, time: '01:15.420' },
				phobos: { rank: 4, time: '01:14.070' },
				oddie: { rank: 1, time: '01:47.640' },
				ahh: { rank: 4, time: '01:02.265' },
				soar: { rank: 12, time: '04:30.240' },
				above: { rank: 6, time: '01:14.355' }
			},
			WRs: 149,
			TTs: 615,
			bestRun: 'jump_destination_v2',
			note: '<img src="https://cdn.7tv.app/emote/01J4YTP1E0000FXZ59PB5ZJ8KW/4x.avif" class="rounded-xl object-cover" />', // find better quality if possible
			favouriteMap: 'jump_atrial',
			score: 0
		},
		{
			name: 'Sammy',
			tempusID: '503501',
			steamID64: '76561199001307670',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/a5104f8172127271e4762fc0aa1112fc2b0a0f9f_full.jpg',
			tag: '',
			flag: 'ca',
			rank: { overall: 3, soldier: 3, demo: 45 },
			pr: {
				pokus: { rank: 0, time: '' },
				marigold: { rank: 0, time: '' },
				phobos: { rank: 0, time: '' },
				oddie: { rank: 0, time: '' },
				ahh: { rank: 0, time: '' },
				soar: { rank: 0, time: '' },
				above: { rank: 0, time: '' }
			},
			WRs: 133,
			TTs: 924,
			bestRun: 'jump_junk_solly',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Hass',
			tempusID: '31339',
			steamID64: '76561198152719870',
			avatarURL:
				'https://shared.akamai.steamstatic.com/community_assets/images/items/1913420/1a5409eff27cdf6c32706526a68316820ca66835.gif',
			tag: '',
			flag: 'gb',
			rank: { overall: 21, soldier: 9, demo: 727 },
			pr: {
				pokus: { rank: 0, time: '' },
				marigold: { rank: 0, time: '' },
				phobos: { rank: 0, time: '' },
				oddie: { rank: 0, time: '' },
				ahh: { rank: 0, time: '' },
				soar: { rank: 0, time: '' },
				above: { rank: 0, time: '' }
			},
			WRs: 2,
			TTs: 225,
			bestRun: 'jump_pharaoh',
			note: 'never ask speedy a question',
			favouriteMap: 'jump_lion',
			score: 0
		},
		{
			name: 'Spidda',
			tempusID: '24856',
			steamID64: '76561198057436685',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/31f788519863b79f24b1604e090596ba6961a3ab_full.jpg',
			tag: '',
			flag: 'us',
			rank: { overall: 23, soldier: 11, demo: 795 },
			pr: {
				pokus: { rank: 0, time: '' },
				marigold: { rank: 0, time: '' },
				phobos: { rank: 0, time: '' },
				oddie: { rank: 0, time: '' },
				ahh: { rank: 0, time: '' },
				soar: { rank: 0, time: '' },
				above: { rank: 0, time: '' }
			},
			WRs: 6,
			TTs: 177,
			bestRun: 'jump_descent',
			note: '',
			favouriteMap: '',
			score: 0
		}
	] as Player[],
	maps: {
		null: { filename: '', shortName: '' },
		pokus: {
			fileName: 'jump_pokus_rc4',
			shortName: 'pokus',
			ID: 'jump-pokus',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_pokus_rc4.webp'
			// zones:
		},
		marigold: {
			fileName: 'jump_marigold',
			shortName: 'marigold',
			ID: 'jump-marigold',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_marigold.webp'
			// zones:
		},
		phobos: {
			fileName: 'jump_phobos_zip',
			shortName: 'phobos',
			ID: 'jump-phobos',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_phobos_zip.webp'
			// zones:
		},
		oddie: {
			fileName: 'jump_oddie_a4',
			shortName: 'oddie',
			ID: 'jump-oddie',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_oddie_a4.webp'
			// zones:
		},
		ahh: {
			fileName: 'jump_ahh_c',
			shortName: 'ahh',
			ID: 'jump-ahh',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_ahh_c.webp'
			// zones:
		},
		soar: {
			fileName: 'jump_soar_a4',
			shortName: 'soar',
			ID: 'jump-soar',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_soar_a4.webp'
			// zones:
		},
		above: {
			fileName: 'jump_above_rc1',
			shortName: 'above',
			ID: 'jump-above',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_above_rc1.webp'
			// zones:
		}
	} as MapsInfo<Playoffs2026SoldierMapList>
};

export const demoPlayoffs2026 = {
	players: [
		{ name: '', score: 0, pr: {} },
		{
			...soldierPlayoffs2026.players.filter((p) => p.name == 'vice')[0],
			pr: {
				tissue: { rank: 1, time: '01:09.240' },
				carbon: { rank: 1, time: '01:05.610' },
				data: { rank: 2, time: '01:06.675' },
				greenguy2: { rank: 1, time: '00:44.760' },
				legocroc: { rank: 1, time: '00:35.085' },
				nbn: { rank: 1, time: '04:06.900' }
			}
		},
		{
			name: 'newjuls',
			tempusID: '281915',
			steamID64: '76561198396018338',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/97c996f978b84083afc12e7713f9626cda82ff83_full.jpg',
			tag: '',
			flag: 'nz',
			rank: { overall: 6, soldier: 16, demo: 2 },
			pr: {
				tissue: { rank: 1, time: '03:10.935' },
				carbon: { rank: 3, time: '01:18.629' },
				data: { rank: 1, time: '01:07.965' },
				greenguy2: { rank: 4, time: '01:51.855' },
				legocroc: { rank: 1, time: '00:59.895' },
				nbn: { rank: 3, time: '04:04.995' }
			},
			WRs: 99,
			TTs: 462,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'cander',
			tempusID: '243670',
			steamID64: '76561198318722879',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/132bdddaf081fe2548a3503ed7058980cb189715_full.jpg',
			tag: 'real vice',
			flag: 'id',
			rank: { overall: 7, soldier: 58, demo: 3 },
			pr: {
				tissue: { rank: 4, time: '01:12.825' },
				carbon: { rank: 3, time: '01:08.250' },
				data: { rank: 4, time: '01:14.535' },
				greenguy2: { rank: 3, time: '00:48.885' },
				legocroc: { rank: 2, time: '00:36.885' },
				nbn: { rank: 201, time: '25:52.065' }
			},
			WRs: 498,
			TTs: 1156,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'namee',
			tempusID: '35454',
			steamID64: '76561198096062185',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/265eb8e845c99da4e5cae4563163cb974c3d482e_full.jpg',
			tag: '',
			flag: 'th',
			rank: { overall: 15, soldier: 268, demo: 9 },
			pr: {
				tissue: { rank: 1, time: '03:10.935' },
				carbon: { rank: 3, time: '01:18.629' },
				data: { rank: 1, time: '01:07.965' },
				greenguy2: { rank: 4, time: '01:51.855' },
				legocroc: { rank: 1, time: '00:59.895' },
				nbn: { rank: 3, time: '04:04.995' }
			},
			WRs: 14,
			TTs: 446,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		}
	] as Player[],
	maps: {
		null: { filename: '', shortName: '' },
		tissue: {
			fileName: 'jump_tissue',
			shortName: 'tissue',
			ID: 'jump-tissue',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_tissue.webp'
			// zones:
		},
		carbon: {
			fileName: 'jump_carbon_b1',
			shortName: 'carbon',
			ID: 'jump-carbon',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_carbon_b1.webp'
			// zones:
		},
		data: {
			fileName: 'jump_data_final',
			shortName: 'data',
			ID: 'jump-data',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_data_final.webp'
			// zones:
		},
		greenguy2: {
			fileName: 'jump_greenguy2_b2',
			shortName: 'greenguy2',
			ID: 'jump-greenguy2',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_greenguy2_b2.webp'
			// zones:
		},
		legocroc: {
			fileName: 'jump_legocroc_rc1',
			shortName: 'legocroc',
			ID: 'jump-legocroc',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_legocroc_rc1.webp'
			// zones:
		},
		nbn: {
			fileName: 'jump_nbn_b4b_redo_a1',
			shortName: 'nbn',
			ID: 'jump-nbn',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_nbn_b4b_redo_a1.webp'
			// zones:
		}
	} as MapsInfo<Playoffs2026DemoMapList>
};

export const defaultStages: Array<string> = [
	'',
	'Round 1',
	'Round 2',
	'Quarterfinals',
	'Semifinals',
	'Finals',
	'Grand Finals',
	"Loser's Quarters",
	"Loser's Semis",
	"Loser's Finals"
];

export const defaultSettings: Settings = {
	font: 'font-space-grotesk',
	hue: 0,
	saturation: 100,
	enableMovingBG: true,
	enablePRs: false,
	enableAvatars: true,
	enableTags: false,
	enableFlags: true,
	enableGradient: true,
	enableTeamColors: false,
	enableSinglePOV: false,
	enablePOVGuide: false,
	webSocketToken: ''
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	leftPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, pr: {} },
	rightPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, pr: {} },
	map: { fileName: '', shortName: '' },
	stage: '',
	class: 'soldier'
};

export const defaultItems: Items = {
	players: [{ name: '', score: 0 }],
	maps: { null: { fileName: '', shortName: '' } },
	stages: defaultStages
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings, 'localStorage');

// overlay state
export const overlay = new PersistentState('overlay', defaultOverlay);

// overlay items
export const items = new PersistentState('items', defaultItems);

export function fullReset() {
	settings.current = defaultSettings;
	overlay.current = defaultOverlay;
	items.current = defaultItems;
}

export function loadSoldierPlayoffs2026() {
	items.current.players = soldierPlayoffs2026.players;
	items.current.maps = soldierPlayoffs2026.maps;
	overlay.current = defaultOverlay;
	overlay.current.class = 'soldier';
	settings.current.hue = 10;
	settings.current.saturation = 100;
}

export function loadDemoPlayoffs2026() {
	items.current.players = demoPlayoffs2026.players;
	items.current.maps = demoPlayoffs2026.maps;
	overlay.current = defaultOverlay;
	overlay.current.class = 'demo';
	settings.current.hue = 0;
	settings.current.saturation = 140;
}
