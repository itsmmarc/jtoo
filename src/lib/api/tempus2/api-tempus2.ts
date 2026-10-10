import { items } from '$lib/storage.svelte';
import { Player, TFMap } from '$lib/types.svelte';
import { Steam } from '../steam/api-steam';
import _ from 'underscore';
import { TempusPlaza } from '../tempusplaza/api-tempusplaza';

export namespace Tempus2 {
	// Tempus2 API Interfaces
	// https://tempus2.xyz/apidocs/
	// https://tempus2.xyz/api/v0
	export const Endpoint = 'https://tempus2.xyz/api/v0';

	// MARK: Functions
	export async function fetchPlayerByTempusID(id: number) {
		let player = new Player();

		const endpoint = `${Tempus2.Endpoint}/players/id/${id}/stats`;
		console.log(endpoint);
		const response = await fetch(endpoint);
		let data: Tempus2.Error | Tempus2.PlayerStats = await response.json();
		console.log(data);

		if ('code' in data && data.code == 404) {
			return null;
		}
		data = data as Tempus2.PlayerStats;

		player.tempusID = data.player_info.id;
		player.steamID = data.player_info.steamid;
		player.steamID3 = Steam.convertSteamId(player.steamID, 'SteamID3') as number;
		player.name = data.player_info.name;
		player.flag = data.player_info.country_code.toLocaleLowerCase();

		player.rank = {
			soldier: _.pick(data.class_rank_info[3], ['points', 'rank', 'title']),
			demoman: _.pick(data.class_rank_info[4], ['points', 'rank', 'title']),
			overall: { ..._.pick(data.rank_info, ['points', 'rank']), title: null }
		};

		player = await TempusPlaza.fetchPlayerRecords(player);

		return player;
	}

	export async function fetchMapByName(name: string) {
		let map = new TFMap();

		const endpoint = `${Tempus2.Endpoint}/maps/name/${name}/fullOverview2`;
		console.log(endpoint);
		const response = await fetch(endpoint);
		let data: Tempus2.Error | Tempus2.MapFullOverview2 = await response.json();
		console.log(data);

		if ('code' in data && data.code == 404) {
			return null;
		}
		data = data as Tempus2.MapFullOverview2;

		map.fileName = data.map_info.name;
		map.shortName = TFMap.fileNameToShortName(data.map_info.name);

		map.mapZoneId = data.zones.map[0].id;

		map.intendedClass.soldier = data.intended_class_info.soldier;
		map.intendedClass.demoman = data.intended_class_info.demoman;

		map.tier.soldier = data.tier_info.soldier;
		map.tier.demoman = data.tier_info.demoman;

		map.worldRecordInfo.soldier = data.soldier_runs[0];
		map.worldRecordInfo.demoman = data.demoman_runs[0];

		map.authors = data.authors;

		map.imageURL = TempusPlaza.getImageUrl(map.fileName);

		return map;
	}

	export async function fetchMapPrs(map: TFMap) {
		const endpoint = `${Tempus2.Endpoint}/zones/id/${map.mapZoneId}/records/list?limit=0`;
		console.log(endpoint);
		const response = await fetch(endpoint);
		let data: Tempus2.Error | Tempus2.MapRecordList = await response.json();
		console.log(data);

		if ('code' in data && data.code == 404) {
			return null;
		}

		data = data as Tempus2.MapRecordList;
		let results = data.results;

		for (const result of results.soldier) {
			map.runs.soldier.push({
				tempusID: result.user_id,
				rank: result.rank,
				duration: result.duration
			});
		}
		for (const result of results.demoman) {
			map.runs.demoman.push({
				tempusID: result.user_id,
				rank: result.rank,
				duration: result.duration
			});
		}
		map.runs.soldier = [...map.runs.soldier];
		map.runs.demoman = [...map.runs.demoman];
	}

	export async function searchPlayersAndMaps(query: string) {
		const endpoint = `${Tempus2.Endpoint}/search/playersAndMaps/${query}`;
		console.log(endpoint);
		const response = await fetch(endpoint);
		let data: Tempus2.Error | Tempus2.SearchResults = await response.json();
		console.log(data);

		data = data as Tempus2.SearchResults;

		return data;
	}

	export async function searchPlayers(query: string) {
		let data = await searchPlayersAndMaps(query);
		return data.players;
	}
	export async function searchMaps(query: string) {
		let data = await searchPlayersAndMaps(query);
		return data.maps;
	}

	// MARK: Util
	export interface Error {
		code: 404 | number;
		details: [];
		message: string;
	}
	export interface Author {
		id: number; // author id
		name: string;
		user_id: number;
		steamid: string;
		user_name: string;
		map_count: number;
	}

	interface Run {
		id: number; // run id
		duration: number;
		date: number;
		name: string;
		user_id: number;
		steamid: string;
	}

	export interface Run2 {
		id: number;
		duration: number;
		date: number;
		name: string;
		player_info: PlayerInfo;
		steamid: string;
	}

	interface ZoneCounts {
		checkpoint: number;
		bonus_end: number;
		bonus: number;
		course: number;
		course_end: number;
		trick: number;
		map_end: number;
		map: number;
		misc: number;
	}

	type ZoneTypes =
		| 'map'
		| 'map_end'
		| 'course'
		| 'course_end'
		| 'checkpoint'
		| 'bonus'
		| 'bonus_end'
		| 'trick'
		| 'misc';

	interface Zone {
		id: number;
		map_id: number;
		type: ZoneTypes;
		zoneindex: number;
		custom_name: null;
	}

	interface MapZone extends Zone {
		type: 'map';
	}
	interface MapEndZone extends Zone {
		type: 'map_end';
	}
	interface CourseZone extends Zone {
		type: 'course';
	}
	interface CourseEndZone extends Zone {
		type: 'course_end';
	}
	interface CheckpointZone extends Zone {
		type: 'checkpoint';
	}
	interface BonusZone extends Zone {
		type: 'bonus';
	}
	interface BonusEndZone extends Zone {
		type: 'bonus_end';
	}
	interface TrickZone extends Zone {
		type: 'trick';
	}
	interface MiscZone extends Zone {
		type: 'misc';
	}

	interface DemoInfo {
		id: number;
		start_tick: number;
		end_tick: number;
		url: string;
		server_info: {
			id: number;
			name: string;
		};
	}
	interface ZoneResult {
		id: number; // completion id
		zone_id: number;
		duration: number;
		class: 3 | 4;
		date: number;
		demo_info: DemoInfo;
		user_id: number; // tempus id
		name: string;
		steamid: string; // steamid64
		rank: number;
		placement: number;
		player_info: PlayerInfo;
	}

	interface SoldierZoneResult extends ZoneResult {
		class: 3;
	}
	interface DemoZoneResult extends ZoneResult {
		class: 4;
	}

	// MARK: GET
	// Map Overview 1
	// /maps/id/{mapId}/fullOverview
	// /maps/name/{mapName}/fullOverview
	export interface MapFullOverview {
		map_info: { id: number; name: string; date_added: number };
		tier_info: {
			soldier: number;
			demoman: number;
		};
		videos: {
			soldier: string | null;
			demoman: string | null;
		};
		authors: Author[];
		soldier_runs: Run[];
		demoman_runs: Run[];
		zone_counts: ZoneCounts;
	}

	// Map Overview 2
	// /maps/id/{mapId}/fullOverview2
	// /maps/name/{mapName}/fullOverview2
	export interface MapFullOverview2 {
		map_info: { id: number; name: string; date_added: number };
		tier_info: {
			soldier: number;
			demoman: number;
		};
		rating_info: {
			soldier: number;
			demoman: number;
		};
		intended_class_info: {
			soldier: boolean;
			demoman: boolean;
		};
		videos: {
			soldier: string | null;
			demoman: string | null;
		};
		authors: Author[];
		soldier_runs: Run2[];
		demoman_runs: Run2[];
		zone_counts: ZoneCounts;
		zones: {
			checkpoint: CheckpointZone[];
			bonus_end: BonusEndZone[];
			bonus: BonusZone[];
			course: CourseZone[];
			trick: TrickZone[];
			course_end: CourseEndZone[];
			map_end: MapEndZone[];
			map: MapZone[];
			misc: MiscZone[];
		};
	}

	// Zone Records List
	// /zones/id/{zoneId}/records/list?limit={limit}
	export interface MapRecordList {
		zone_info: {
			id: number;
			map_id: number;
			zoneindex: 1;
			custom_name: null | string;
			type: 'map';
		};
		tier_info: {
			'3': number;
			'4': number;
		};
		rating_info: {
			'3': number;
			'4': number;
		};
		completion_info: {
			soldier: number;
			demoman: number;
		};
		results: {
			soldier: SoldierZoneResult[];
			demoman: DemoZoneResult[];
		};
	}

	// Player Rank
	// /players/id/{playerId}/rank
	export interface PlayerRank {
		player_info: {
			id: number;
			steamid: string;
			name: string;
			first_seen: number;
			last_seen: number;
			country: string;
		};
		rank_info: {
			points: number;
			rank: number;
			total_ranked: number;
		};
		class_rank_info: {
			'3': {
				points: number;
				rank: number;
				total_ranked: number;
				title: string;
			};
			'4': {
				points: number;
				rank: number;
				total_ranked: number;
				title: string;
			};
		};
	}

	// Player Info
	// /players/id/{playerId}/info
	export interface PlayerInfo {
		name: string;
		id: number;
		steamid: string;
	}

	// Player Stats
	// /players/id/{playerId}/stats
	export interface PlayerStats {
		player_info: {
			id: number;
			steamid: string;
			name: string;
			first_seen: number;
			last_seen: number;
			country: string;
			country_code: string;
		};
		rank_info: {
			points: number;
			rank: number;
			total_ranked: number;
		};
		class_rank_info: {
			'3': {
				points: number;
				rank: number;
				total_ranked: number;
				title: string;
			};
			'4': {
				points: number;
				rank: number;
				total_ranked: number;
				title: string;
			};
		};
		country_rank_info: {
			rank: number;
			total_ranked: number;
		};
		country_class_rank_info: {
			'3': {
				rank: number;
				total_ranked: number;
			};
			'4': {
				rank: number;
				total_ranked: number;
			};
		};
		pr_stats: {
			course: {
				count: number;
				points: number;
			};
			map: {
				count: number;
				points: number;
			};
			bonus: {
				count: number;
				points: number;
			};
			trick: {
				count: number;
				points: number;
			};
		};
		wr_stats: {
			course: {
				count: number;
				points: number;
			};
			map: {
				count: number;
				points: number;
			};
			bonus: {
				count: number;
				points: number;
			};
			trick: {
				count: number;
				points: number;
			};
		};
		top_stats: {
			// top times (tt)
			map: {
				count: number;
				points: number;
			};
		};
		zone_count: {
			special: {
				count: number;
			};
			checkpoint: {
				count: number;
			};
			bonus_end: {
				count: number;
			};
			linear: {
				count: number;
			};
			bonus: {
				count: number;
			};
			course: {
				count: number;
			};
			course_end: {
				count: number;
			};
			trick: {
				count: number;
			};
			map_end: {
				count: number;
			};
			map: {
				count: number;
			};
			misc: {
				count: number;
			};
		};
	}

	// Search Players and Maps
	// /search/playersAndMaps/{nameQuery}
	export interface SearchResults {
		players: PlayerInfo[];
		maps: MapInfo[];
	}

	export interface MapInfo {
		id: number;
		name: string;
	}
}
