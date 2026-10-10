// get all tournament leaderboards

import { SvelteMap } from 'svelte/reactivity';
import type { Round, SteamID3 } from './types.svelte';

// get average placement of each player across all leaderboards

type PlayerPlacements = SvelteMap<SteamID3, number[]>;

export type LeaderboardAvgEntry = { steamId3: SteamID3; avgPlacement: number };
type playerAveragePlacements = {
	id: number;
	leaderboard: LeaderboardAvgEntry[];
};

export function calculatePlacements(leaderboards: Round[]): playerAveragePlacements {
	const numberOfRounds = leaderboards.length;
	const maxPlacement = 60;
	let playerPlacements: PlayerPlacements = new SvelteMap();

	for (const leaderboard of leaderboards) {
		for (const leaderboardEntry of leaderboard.leaderboard) {
			const id = leaderboardEntry.steamId3;
			const pos = leaderboardEntry.position;

			if (!playerPlacements.has(id)) {
				playerPlacements.set(id, [pos]);
				continue;
			}
			playerPlacements.set(id, [...playerPlacements.get(id)!, pos]);
		}
	}

	let playerAveragePlacements = [];
	for (const [id, placements] of playerPlacements.entries()) {
		let sum = (numberOfRounds - placements.length) * maxPlacement;
		placements.forEach((p) => (sum += p));

		let avg = sum / numberOfRounds;
		playerAveragePlacements.push({ steamId3: id, avgPlacement: avg });
	}
	playerAveragePlacements.sort((a, b) => a.avgPlacement - b.avgPlacement);

	return { id: 9001, leaderboard: playerAveragePlacements };
}
