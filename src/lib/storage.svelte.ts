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
import { addPlayersFromSteamID3, getMap, getPlayer, getTournament } from './util';
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

	const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
	await sleep(2000);

	let bootcampSoldierLeaderboards = items.current.tournaments.filter(
		(t) => t.info.name == 'Bootcamp Soldiers'
	)[0].leaderboards;
	console.log(bootcampSoldierLeaderboards);
	if (bootcampSoldierLeaderboards) {
		restoreAcademyLeaderboard();
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

export function restoreAcademyLeaderboard() {
	console.log('restoring academy leaderboard');

	if (
		items.current.tournaments
			.filter((t) => t.info.name == 'Bootcamp Soldiers')[0]
			.leaderboards.some((t) => t.id === 182)
	)
		return;
	items.current.tournaments.filter((t) => t.info.name == 'Bootcamp Soldiers')[0].leaderboards = [
		{
			id: 182,
			map: 'jump_academy2_easy_event',
			leaderboard: [
				{
					position: 1,
					steamId3: 274524520,
					prCs: 29704.498291015625,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 2,
					steamId3: 1205331,
					prCs: 29807.998657226562,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 3,
					steamId3: 1570772744,
					prCs: 30394.500732421875,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 4,
					steamId3: 209024251,
					prCs: 31426.498413085938,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 5,
					steamId3: 173761676,
					prCs: 32590.499877929688,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 6,
					steamId3: 238550246,
					prCs: 32720.999145507812,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 7,
					steamId3: 1208621983,
					prCs: 32890.49987792969,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 8,
					steamId3: 1051130653,
					prCs: 33145.49865722656,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 9,
					steamId3: 285397454,
					prCs: 34013.99841308594,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 10,
					steamId3: 125790511,
					prCs: 34514.99938964844,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 11,
					steamId3: 846446001,
					prCs: 34531.500244140625,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 12,
					steamId3: 210594027,
					prCs: 35575.50048828125,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 13,
					steamId3: 1238513455,
					prCs: 37231.500244140625,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 14,
					steamId3: 433739437,
					prCs: 38875.50048828125,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 15,
					steamId3: 1280310205,
					prCs: 40045.49865722656,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 16,
					steamId3: 449416302,
					prCs: 41003.997802734375,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 17,
					steamId3: 112000502,
					prCs: 42680.999755859375,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 18,
					steamId3: 386769336,
					prCs: 42738.00048828125,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 19,
					steamId3: 1044066317,
					prCs: 44431.500244140625,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 20,
					steamId3: 1160686771,
					prCs: 45947.998046875,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 21,
					steamId3: 1221028872,
					prCs: 49303.50036621094,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 22,
					steamId3: 1864007529,
					prCs: 50626.49841308594,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 23,
					steamId3: 1306487452,
					prCs: 51473.9990234375,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 24,
					steamId3: 1178234287,
					prCs: 66670.49560546875,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 25,
					steamId3: 181840608,
					prCs: 83560.498046875,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 26,
					steamId3: 366336591,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 27,
					steamId3: 1161800600,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 28,
					steamId3: 207457615,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 29,
					steamId3: 298130705,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 30,
					steamId3: 153381898,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 31,
					steamId3: 220580073,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 32,
					steamId3: 252636943,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 33,
					steamId3: 428509153,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 34,
					steamId3: 394357679,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 35,
					steamId3: 85949170,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 36,
					steamId3: 212863037,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 37,
					steamId3: 843065071,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 38,
					steamId3: 288849900,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 39,
					steamId3: 172628689,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 40,
					steamId3: 177346410,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 41,
					steamId3: 141252761,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 42,
					steamId3: 209702177,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 43,
					steamId3: 194459329,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 44,
					steamId3: 484874521,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				},
				{
					position: 45,
					steamId3: 1187198874,
					prCheckpointsCs: {},
					currentCheckpointsCs: {}
				}
			]
		},
		...items.current.tournaments.filter((t) => t.info.name == 'Bootcamp Soldiers')[0].leaderboards
	];
}
