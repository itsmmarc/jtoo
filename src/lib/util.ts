import { type Player, items } from './storage.svelte';

export function getPlayer(name?: string, steamID3?: number, players?: Player[]): Player {
	if (name) {
		return players
			? { ...players.filter((p) => p.name == name)[0] }
			: { ...items.current.players.filter((p) => p.name == name)[0] };
	}
	if (steamID3) {
		return players
			? { ...players.filter((p) => p.steamID3 == steamID3)[0] }
			: { ...items.current.players.filter((p) => p.steamID3 == steamID3)[0] };
	}
	return { ...items.current.players.filter((p) => p.name == '')[0] };
}
