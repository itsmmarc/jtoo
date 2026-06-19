import { PersistentState } from '@friendofsvelte/state';
import { type Bracket } from './Bracket.svelte';

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

export const MonoFonts = [
	'font-dm-mono',
	'font-anonymous-pro',
	'font-ubuntu-mono',
	'font-azaret-mono',
	'font-chivo-mono',
	'font-spline-sans-mono'
] as const;
export type MonoFont = (typeof MonoFonts)[number];

export type Settings = {
	font: Font;
	monoFont: MonoFont;
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
	useShortMapNames: boolean;
	useWebSocket: boolean;
	webSocketToken: string;
};

// unused, intended for minimap
// export type Vector = {
// 	x: number;
// 	y: number;
// 	z: number;
// };
// export type Zone = {
// 	p1: Vector;
// 	p2: Vector;
// };
// export type Zones = {
// 	start: Zone;
// 	end: Zone;
// 	cp?: Zone[];
// };
export type Map = {
	fileName: string;
	shortName: string;
	ID: string;
	imageURL?: string;
	// zones?: Zones;
	// minimap?: { graphic: string; bounds: Zone };
};

export type MapPRs<T> = {
	[K in keyof T]: { rank: number; time: string };
};

export type MapsInfo<T> = {
	[K in keyof T]: Map;
};

export const TFClasses = ['demo', 'soldier', 'overall'] as const;
export type TFClass = (typeof TFClasses)[number];

export type Rank = {
	[key in TFClass]: number;
};

export type Player = {
	name: string;
	isCompetitor: boolean;
	score: number;
	tempusID?: string;
	steamID3?: number;
	avatarURL?: string;
	tag?: string;
	flag?: string;
	pr?: string; // only used for manual PRs
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tempusPrs?: MapPRs<any>;
	rank?: Rank;
	WRs?: number;
	TTs?: number;
	bestRun?: string;
	note?: string;
	favouriteMap?: string;
};

export const nullPlayer: Player = { name: '', isCompetitor: false, score: 0 } as const;

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
	bracket: Bracket;
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

export const defaultBracket: Bracket = {
	Upper: {
		QuarterFinals: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'SemiFinals', 0, 'A'],
				loseDest: ['Lower', 'Round1', 0, 'A']
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'SemiFinals', 0, 'B'],
				loseDest: ['Lower', 'Round1', 0, 'B']
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'SemiFinals', 1, 'A'],
				loseDest: ['Lower', 'Round1', 1, 'A']
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'SemiFinals', 1, 'B'],
				loseDest: ['Lower', 'Round1', 1, 'B']
			}
		],
		SemiFinals: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'Final', 0, 'A'],
				loseDest: ['Lower', 'QuarterFinals', 0, 'B']
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'Final', 0, 'B'],
				loseDest: ['Lower', 'QuarterFinals', 1, 'B']
			}
		],
		Final: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'GrandFinal', 0, 'A'],
				loseDest: ['Lower', 'Final', 0, 'B']
			}
		],
		GrandFinal: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: null,
				loseDest: null
			}
		]
	},
	Lower: {
		Round1: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Lower', 'QuarterFinals', 0, 'A'],
				loseDest: null
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Lower', 'QuarterFinals', 1, 'A'],
				loseDest: null
			}
		],
		QuarterFinals: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Lower', 'SemiFinal', 0, 'A'],
				loseDest: null
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Lower', 'SemiFinal', 0, 'B'],
				loseDest: null
			}
		],
		SemiFinal: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Lower', 'Final', 0, 'A'],
				loseDest: null
			}
		],
		Final: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'GrandFinal', 0, 'B'],
				loseDest: null
			}
		]
	}
};

export const defaultSettings: Settings = {
	font: 'font-space-grotesk',
	monoFont: 'font-chivo-mono',
	hue: 0,
	saturation: 100,
	enableMovingBG: true,
	enablePRs: true,
	enableAvatars: true,
	enableTags: false,
	enableFlags: true,
	enableGradient: true,
	enableTeamColors: true,
	enableSinglePOV: false,
	enablePOVGuide: false,
	useShortMapNames: true,
	useWebSocket: false,
	webSocketToken: ''
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	leftPlayer: {
		name: '',
		isCompetitor: false,
		avatarURL: '',
		tag: '',
		flag: '',
		score: 0,
		tempusPrs: {}
	},
	rightPlayer: {
		name: '',
		isCompetitor: false,
		avatarURL: '',
		tag: '',
		flag: '',
		score: 0,
		tempusPrs: {}
	},
	map: { fileName: '', shortName: '', ID: '' },
	stage: '',
	class: 'soldier'
};

export const defaultItems: Items = {
	players: [nullPlayer],
	maps: { null: { fileName: '', shortName: '', ID: '' } },
	stages: defaultStages,
	bracket: defaultBracket
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings, 'localStorage');

// overlay state
export const overlay = new PersistentState('overlay', defaultOverlay);

// overlay items
export const items = new PersistentState('items', defaultItems);

export function fullReset() {
	console.log(defaultBracket);
	settings.current = defaultSettings;
	overlay.current = defaultOverlay;
	items.current = defaultItems;
}
