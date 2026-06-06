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
	useWebSocket: boolean;
	webSocketToken: string;
};

// unused, intended for minimap
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
	useWebSocket: false,
	webSocketToken: ''
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	leftPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, tempusPrs: {} },
	rightPlayer: { name: '', avatarURL: '', tag: '', flag: '', score: 0, tempusPrs: {} },
	map: { fileName: '', shortName: '', ID: '' },
	stage: '',
	class: 'soldier'
};

export const defaultItems: Items = {
	players: [{ name: '', score: 0 }],
	maps: { null: { fileName: '', shortName: '', ID: '' } },
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
