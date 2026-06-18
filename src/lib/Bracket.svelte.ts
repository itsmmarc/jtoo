import { type Player, items, nullPlayer } from './storage.svelte';

export type Match = {
	A: Player;
	B: Player;
	winner: 'A' | 'B' | '';
	winDest: Array<string | number> | null;
	loseDest: Array<string | number> | null;
};
export type Bracket = {
	Upper: { QuarterFinals: Match[]; SemiFinals: Match[]; Final: Match[]; GrandFinal: Match[] };
	Lower: { Round1: Match[]; QuarterFinals: Match[]; SemiFinal: Match[]; Final: Match[] };
};

export function setMatchWinner(m: Match, w: 'A' | 'B' | '') {
	// remove winner from subsequent matches
	if (!w) {
		m.winner = w;
		if (m.winDest) {
			setMatchWinner(items.current.bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]], '');
		}
		if (m.loseDest) {
			setMatchWinner(items.current.bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]], '');
		}
	}

	// progress players
	if (m.A.name && m.B.name) {
		m.winner = w;
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
}

export function clearMatchWinner(m: Match) {
	// remove winner from subsequent matches
	m.winner = '';
	if (m.winDest) {
		clearMatchWinner(items.current.bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]]);
	}
	if (m.loseDest) {
		clearMatchWinner(items.current.bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]]);
	}

	// progress
	if (m.A.name && m.B.name) {
		if (m.winDest) {
			items.current.bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = nullPlayer;
		}
		if (m.loseDest) {
			items.current.bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] =
				nullPlayer;
		}
	}
}
