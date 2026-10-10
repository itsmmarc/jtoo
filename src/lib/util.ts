import { indexOf } from 'underscore';
import { items, overlay } from './storage.svelte';
import {
	Player,
	TFMap,
	Tournament,
	type Centiseconds,
	type MapFileName,
	type Seconds,
	type SteamID3,
	type TempusID
} from './types';
import { Steam } from './api/steam/api-steam';

export function getPlayer(steamID3: SteamID3 | undefined): Player {
	if (!steamID3) return items.current.players[0];
	return { ...items.current.players.filter((p) => p.steamID3 == steamID3)[0] };
}
export function getPlayerByTempusID(tempusId: TempusID | undefined): Player {
	if (!tempusId) return items.current.players[0];
	return { ...items.current.players.filter((p) => p.tempusID == tempusId)[0] };
}
export function getPlayerIndex(steamID3: SteamID3 | undefined): number {
	if (!steamID3) return -1;
	return items.current.players.findIndex((p) => p.steamID3 == steamID3);
}
export function getPlayerIndexByTempusID(tempusID: TempusID | undefined): number {
	if (!tempusID) return -1;
	return items.current.players.findIndex((p) => p.tempusID == tempusID);
}

export async function addPlayersFromSteamID3(steamId3s: string[]) {
	// fetch player
	let playerSummaries = await Steam.fetchPlayerSummaries(steamId3s);
	if (!playerSummaries) return;

	for (const ps of playerSummaries) {
		let steamId3 = Steam.convertSteamId(ps.steamid, 'SteamID3') as number;

		if (getPlayer(steamId3).steamID3) continue;
		items.current.players.push(Steam.playerSummaryToPlayer(ps));
	}
}

export function getTournament(id: string | undefined): Tournament {
	if (!id) return items.current.tournaments[0];
	return { ...items.current.tournaments.filter((t) => t.id == id)[0] };
}

export function getMap(mapFileName: MapFileName): TFMap {
	return { ...items.current.maps.filter((m) => m.fileName == mapFileName)[0] };
}

export function secondsToCs(seconds: Seconds): Centiseconds {
	return seconds * 100;
}

export function csToSeconds(centiseconds: Centiseconds): Seconds {
	return centiseconds / 100;
}

export function csToFormattedTime(
	cs: Centiseconds,
	precision?: 'centiseconds' | 'seconds' | 'minutes'
) {
	const minutes = Math.floor(cs / 6000)
		.toString()
		.padStart(2, '0');
	const seconds = Math.floor(csToSeconds(cs) % 60)
		.toString()
		.padStart(2, '0');
	const centiseconds = Math.floor(cs % 100)
		.toString()
		.padStart(2, '0');

	let s: string;
	if (!precision) {
		s = `${minutes}:${seconds}.${centiseconds}`;
	} else {
		s = `${minutes}`;
		s += precision == 'seconds' || precision == 'centiseconds' ? `:${seconds}` : '';
		s += precision == 'centiseconds' ? `.${centiseconds}` : '';
	}
	return s;
}
