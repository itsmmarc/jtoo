import { PersistentState } from '@friendofsvelte/state';

export type Settings = {
	font: 'cause' | 'comic-relief' | 'courier-prime' | 'fredoka' | 'inter';
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

export type Rank = {
	soldier: number;
	demo: number;
	overall: number;
};

export type Player = {
	name: string;
	score: number;
	tempusID?: string;
	steamURL?: string;
	avatarURL?: string;
	tag?: string;
	flag?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pr?: MapPRs<any>;
	rank?: Rank;
	numWRs?: number;
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
	tbd?: unknown; // replace me
	greenguy2?: unknown;
	legocroc?: unknown;
};

export const soldierPlayoffs2026 = {
	players: [
		{ name: '', score: 0 },
		{
			name: 'vice',
			tempusID: '10736',
			steamURL: 'vicetfz',
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
			numWRs: 91,
			bestRun: 'jump_phobos',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Nikita',
			tempusID: '602086',
			steamURL: '76561199514776310',
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
			numWRs: 421,
			bestRun: '?',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Garf',
			tempusID: '579826',
			steamURL: '76561199243400809',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/45005e86d752dcb1439be9c937ee1ce6e2b4d0ab_full.jpg',
			tag: '',
			flag: 'pl',
			rank: { overall: 8, soldier: 6, demo: 390 },
			pr: {
				pokus: { rank: 0, time: '' },
				marigold: { rank: 0, time: '' },
				phobos: { rank: 0, time: '' },
				oddie: { rank: 0, time: '' },
				ahh: { rank: 0, time: '' },
				soar: { rank: 0, time: '' },
				above: { rank: 0, time: '' }
			},
			numWRs: 90,
			bestRun: 'jump_yona',
			note: 'hello',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'bunny.',
			tempusID: '357942',
			steamURL: 'HelmiBunny',
			avatarURL:
				'https://avatars.akamai.steamstatic.com/5f84395a8424e7d4828f6b18c9cb90a12fa24ed4_full.jpg',
			tag: '',
			flag: 'fi',
			rank: { overall: 4, soldier: 4, demo: 42 },
			pr: {
				pokus: { rank: 0, time: '' },
				marigold: { rank: 0, time: '' },
				phobos: { rank: 0, time: '' },
				oddie: { rank: 0, time: '' },
				ahh: { rank: 0, time: '' },
				soar: { rank: 0, time: '' },
				above: { rank: 0, time: '' }
			},
			numWRs: 148,
			bestRun: 'jump_destination_v2',
			note: '<img src="https://cdn.7tv.app/emote/01J4YTP1E0000FXZ59PB5ZJ8KW/4x.avif" />', // find better quality if possible
			favouriteMap: 'jump_atrial',
			score: 0
		},
		{
			name: 'Sammy',
			tempusID: '503501',
			steamURL: 'samuelmiamuel',
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
			numWRs: 132,
			bestRun: 'jump_junk_solly',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Hass',
			tempusID: '31339',
			steamURL: '76561198152719870',
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
			numWRs: 2,
			bestRun: 'jump_pharaoh',
			note: 'never ask speedy a question',
			favouriteMap: 'jump_lion',
			score: 0
		},
		{
			name: 'Spidda',
			tempusID: '24856',
			steamURL: 'sleepyiscute',
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
			numWRs: 6,
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
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_pokus_rc4.webp'
			// zones:
		},
		marigold: {
			fileName: 'jump_marigold',
			shortName: 'marigold',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_marigold.webp'
			// zones:
		},
		phobos: {
			fileName: 'jump_phobos_zip',
			shortName: 'phobos',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_phobos_zip.webp'
			// zones:
		},
		oddie: {
			fileName: 'jump_oddie_a4',
			shortName: 'oddie',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_oddie_a4.webp'
			// zones:
		},
		ahh: {
			fileName: 'jump_ahh_c',
			shortName: 'ahh',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_ahh_c.webp'
			// zones:
		},
		soar: {
			fileName: 'jump_soar_a4',
			shortName: 'soar',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_soar_a4.webp'
			// zones:
		},
		above: {
			fileName: 'jump_above_rc1',
			shortName: 'above',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_above_rc1.webp'
			// zones:
		}
	} as MapsInfo<Playoffs2026SoldierMapList>
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
	font: 'cause',
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
	enablePOVGuide: false
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	leftPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, pr: {} },
	rightPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, pr: {} },
	map: { fileName: '', shortName: '' },
	stage: ''
};

export const defaultItems: Items = {
	players: [{ name: '', score: 0 }],
	maps: { null: { fileName: '', shortName: '' } },
	stages: defaultStages
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings);

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
}
