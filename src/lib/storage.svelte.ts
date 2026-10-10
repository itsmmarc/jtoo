import { PersistentState } from '@friendofsvelte/state';
import {
	type Items,
	type Overlay,
	type Settings,
	Player,
	type SteamID3,
	TFMap,
	Tournament,
	type TempusID
} from './types.svelte';
import { addPlayersFromSteamID3, getPlayer } from './util';
import { Tempus2 } from './api/tempus2/api-tempus2';
import { Steam } from './api/steam/api-steam';

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
	jfRelayWebSocketToken: '',
	logWsMessages: false,
	overlayScene: 'DualPovMatchScene',
	obsWsIp: '',
	obsWsPort: undefined,
	obsWsPw: ''
};

export const defaultOverlay: Overlay = {
	bestOf: 3,
	players: [undefined, undefined, undefined, undefined],
	map: '',
	stage: '',
	tournament: '',
	leaderboard: undefined
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

// ws messages
export const wsMessages: PersistentState<any[]> = new PersistentState('wsMessages', []);

export function fullReset() {
	settings.current = defaultSettings;
	overlay.current = defaultOverlay;
	// items.current = defaultItems;
}

// TODO - seperate soldier and demo players
const bootcampSoldierPlayers: string[] = [
	'[U:1:153381898]',
	'[U:1:449416302]',
	'[U:1:1161800600]',
	'[U:1:843065071]',
	'[U:1:173761676]',
	'[U:1:220580073]',
	'[U:1:274524520]',
	'[U:1:394357679]',
	'[U:1:196162396]',
	'[U:1:285397454]',
	'[U:1:197946467]',
	'[U:1:288849900]',
	'[U:1:911365249]',
	'[U:1:209024251]',
	'[U:1:428509153]',
	'[U:1:386769336]',
	'[U:1:1205331]',
	'[U:1:358849226]',
	'[U:1:366336591]',
	'[U:1:298130705]',
	'[U:1:209702177]',
	'[U:1:883755403]',
	'[U:1:1176644786]',
	'[U:1:433739437]',
	'[U:1:172628689]',
	'[U:1:1178234287]',
	'[U:1:125790511]',
	'[U:1:47639232]',
	'[U:1:1238513455]',
	'[U:1:252636943]',
	'[U:1:210594027]',
	'[U:1:1044066317]',
	'[U:1:484874521]',
	'[U:1:298608064]',
	'[U:1:78737110]',
	'[U:1:181840608]',
	'[U:1:1864007529]',
	'[U:1:897125672]',
	'[U:1:112000502]',
	'[U:1:212863037]',
	'[U:1:168737276]',
	'[U:1:1160686771]',
	'[U:1:238550246]',
	'[U:1:1051130653]',
	'[U:1:1208621983]',
	'[U:1:1570772744]',
	'[U:1:950059337]',
	'[U:1:1107924874]',
	'[U:1:85949170]',
	'[U:1:1187198874]',
	'[U:1:177346410]'
];

export async function addBootcampSoldierTournament() {
	await addPlayersFromSteamID3(bootcampSoldierPlayers);
	let tournament = new Tournament();
	tournament.players = bootcampSoldierPlayers.map(
		(p) => Steam.convertSteamId(p, 'SteamID3') as number
	);
	tournament.format = 'MassRace';
	tournament.info = { name: 'Bootcamp Soldiers', class: 'soldier' };
	items.current.players = [...items.current.players];
	items.current.tournaments = [...items.current.tournaments, tournament];
}
