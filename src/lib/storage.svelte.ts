import { PersistentState } from '@friendofsvelte/state';
import {
	type Counters,
	type Items,
	type Overlay,
	type Settings,
	Player,
	TFMap,
	Tournament
} from './types';

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

export const defaultCounters: Counters = {
	tournamentId: 0
};

// counters
export const counters = new PersistentState('counters', defaultCounters);

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
	enablePOVGuide: false,
	useShortMapNames: true,
	ksnWebSocketToken: '',
	overlayScene: 'MatchScene',
	obsWsIp: '',
	obsWsPw: ''
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	players: [undefined, undefined, undefined, undefined],
	map: '',
	stage: '',
	tournament: new Tournament()
};

export const defaultItems: Items = {
	players: [new Player()],
	maps: [new TFMap()],
	stages: defaultStages,
	tournaments: [new Tournament()]
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings, 'localStorage');

// overlay state
export const overlay = new PersistentState('overlay', defaultOverlay);

// overlay items
export const items = new PersistentState('items', defaultItems);

export function fullReset() {
	counters.current = defaultCounters;
	settings.current = defaultSettings;
	overlay.current = defaultOverlay;
	// items.current = defaultItems;
}
