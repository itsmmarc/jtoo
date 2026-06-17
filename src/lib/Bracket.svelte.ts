import { type Player, items, nullPlayer } from './storage.svelte';

export type Match = {
	A: Player;
	B: Player;
	winner: 'A' | 'B' | '';
	winDest: Array<string | number> | null;
	loseDest: Array<string | number> | null;
};
export type Bracket = {
	Upper: { QuarterFinal: Match[]; SemiFinal: Match[]; Final: Match[]; GrandFinal: Match[] };
	Lower: { Round1: Match[]; QuarterFinal: Match[]; SemiFinal: Match[]; Final: Match[] };
};

export function setMatchWinner(m: Match, w: 'A' | 'B' | '') {
	if (m.A.name && m.B.name) {
		// set winner
		m.winner = w;

		// progress players
		if (m.winDest) {
			items.current.bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = w
				? m[w]
				: nullPlayer;
		}
		if (m.loseDest) {
			items.current.bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] = w
				? m[w == 'A' ? 'B' : 'A']
				: nullPlayer;
		}
	}

	if (!w) {
		setMatchWinner(items.current.bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]], '');
		setMatchWinner(items.current.bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]], '');
	}
}
