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
import { addPlayersFromSteamID3, getMap, getPlayer } from './util';
import { Tempus2 } from './api/tempus2/api-tempus2';
import { Steam } from './api/steam/api-steam';
import { TempusPlaza } from './api/tempusplaza/api-tempusplaza';

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
	enableFlags: false,
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
const bootcampPlayers: string[] = [
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

const bootcampDemoMaps = ['jump_halcyon_b3', 'jump_matty_b7', 'jump_rush'];
const bootcampSoldierMaps = ['jump_academy2_easy_event', 'jump_bunker_final', 'jump_doom_final'];

export async function importBootcampTournaments() {
	if (!items.current.tournaments.filter((t) => t.info.name == 'Bootcamp Soldiers')[0]) {
		await addBootcampSoldierTournament();
	}
	if (!items.current.tournaments.filter((t) => t.info.name == 'Bootcamp Demomen')[0]) {
		await addBootcampDemoTournament();
	}
}
async function addBootcampSoldierTournament() {
	await addPlayersFromSteamID3(bootcampPlayers);
	let tournament = new Tournament();
	tournament.players = bootcampPlayers.map((p) => Steam.convertSteamId(p, 'SteamID3') as number);
	tournament.players = [...tournament.players].sort((a, b) =>
		getPlayer(a).name.localeCompare(getPlayer(b).name, undefined, { sensitivity: 'base' })
	);

	tournament.maps = [...bootcampSoldierMaps];

	for (const map of bootcampSoldierMaps) {
		if (getMap(map).fileName) continue;

		let mapObj = await Tempus2.fetchMapByName(map);
		if (mapObj) {
			items.current.maps.push(mapObj);
			continue;
		}

		mapObj = new TFMap();
		mapObj.fileName = map;
		mapObj.shortName = TFMap.fileNameToShortName(map);
		mapObj.intendedClass = { soldier: true, demoman: false };
		items.current.maps.push(mapObj);
		console.log(`adding ${map}`);
	}

	getMap('jump_academy2_easy_event').imageURL =
		'https://preview.redd.it/map-update-jump-academy2-rc8-v0-jwxgc72vgv491.jpg?width=2048&format=pjpg&auto=webp&s=e59ae980806f33f0789d7fd15e64816c6c5a6024';

	tournament.format = 'MassRace';
	tournament.info = { name: 'Bootcamp Soldiers', class: 'soldier' };
	console.log('players');
	console.log(items.current.players);
	items.current.players = [...items.current.players].sort((a, b) => {
		console.log(a);
		console.log(b);
		return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
	});
	items.current.tournaments = [...items.current.tournaments, tournament];
	items.current.maps = [...items.current.maps];
}
async function addBootcampDemoTournament() {
	let tournament = new Tournament();
	tournament.players = bootcampPlayers.map((p) => Steam.convertSteamId(p, 'SteamID3') as number);
	tournament.players = [...tournament.players].sort((a, b) =>
		getPlayer(a).name.localeCompare(getPlayer(b).name, undefined, { sensitivity: 'base' })
	);

	tournament.maps = [...bootcampDemoMaps];

	for (const map of bootcampDemoMaps) {
		if (getMap(map).fileName) continue;

		let mapObj = await Tempus2.fetchMapByName(map);
		if (mapObj) {
			items.current.maps.push(mapObj);
			continue;
		}

		mapObj = new TFMap();
		mapObj.fileName = map;
		mapObj.shortName = TFMap.fileNameToShortName(map);
		mapObj.intendedClass = { soldier: true, demoman: false };
		items.current.maps.push(mapObj);
	}

	tournament.format = 'MassRace';
	tournament.info = { name: 'Bootcamp Demomen', class: 'demoman' };
	items.current.players = [...items.current.players].sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
	);
	items.current.tournaments = [...items.current.tournaments, tournament];
	items.current.maps = [...items.current.maps];
}
