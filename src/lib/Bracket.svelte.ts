import { Player, type SteamID3 } from './types';

export type Match = {
	A: SteamID3 | undefined;
	B: SteamID3 | undefined;
	winner: 'A' | 'B' | '';
	winDest: Array<string | number> | null;
	loseDest: Array<string | number> | null;
};

abstract class Bracket {
	abstract type: 8 | 4;
	Upper: any;
	Lower: any;
}
export class Bracket8 extends Bracket {
	type: 8 = 8;
	Upper: { QuarterFinals: Match[]; SemiFinals: Match[]; Final: Match[]; GrandFinal: Match[] };
	Lower: { Round1: Match[]; QuarterFinals: Match[]; SemiFinal: Match[]; Final: Match[] };

	constructor() {
		super();
		this.Upper = {
			QuarterFinals: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'SemiFinals', 0, 'A'],
					loseDest: ['Lower', 'Round1', 0, 'A']
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'SemiFinals', 0, 'B'],
					loseDest: ['Lower', 'Round1', 0, 'B']
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'SemiFinals', 1, 'A'],
					loseDest: ['Lower', 'Round1', 1, 'A']
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'SemiFinals', 1, 'B'],
					loseDest: ['Lower', 'Round1', 1, 'B']
				}
			],
			SemiFinals: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'Final', 0, 'A'],
					loseDest: ['Lower', 'QuarterFinals', 0, 'B']
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'Final', 0, 'B'],
					loseDest: ['Lower', 'QuarterFinals', 1, 'B']
				}
			],
			Final: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'A'],
					loseDest: ['Lower', 'Final', 0, 'B']
				}
			],
			GrandFinal: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: null,
					loseDest: null
				}
			]
		};
		this.Lower = {
			Round1: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Lower', 'QuarterFinals', 0, 'A'],
					loseDest: null
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Lower', 'QuarterFinals', 1, 'A'],
					loseDest: null
				}
			],
			QuarterFinals: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Lower', 'SemiFinal', 0, 'A'],
					loseDest: null
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Lower', 'SemiFinal', 0, 'B'],
					loseDest: null
				}
			],
			SemiFinal: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Lower', 'Final', 0, 'A'],
					loseDest: null
				}
			],
			Final: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'B'],
					loseDest: null
				}
			]
		};
	}
}

export class Bracket4 extends Bracket {
	type: 4 = 4;
	Upper: { QuarterFinals: Match[]; SemiFinal: Match[]; GrandFinal: Match[] };
	Lower: { SemiFinal: Match[]; Final: Match[] };

	constructor() {
		super();
		this.Upper = {
			QuarterFinals: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'SemiFinal', 0, 'A'],
					loseDest: ['Lower', 'SemiFinal', 0, 'A']
				},
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'SemiFinal', 0, 'B'],
					loseDest: ['Lower', 'SemiFinal', 0, 'B']
				}
			],
			SemiFinal: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'A'],
					loseDest: ['Lower', 'Final', 0, 'B']
				}
			],
			GrandFinal: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: null,
					loseDest: null
				}
			]
		};
		this.Lower = {
			SemiFinal: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Lower', 'Final', 0, 'A'],
					loseDest: null
				}
			],
			Final: [
				{
					A: undefined,
					B: undefined,
					winner: '',
					winDest: ['Upper', 'GrandFinal', 0, 'B'],
					loseDest: null
				}
			]
		};
	}
}

// MARK: REFACTOR
export function setMatchWinner(bracket: Bracket, m: Match, w: 'A' | 'B' | '') {
	// console.log('setting match winner');
	// console.log(m);
	// console.log(w);
	// remove winner from subsequent matches
	if (!w) {
		m.winner = w;
		if (m.winDest) {
			setMatchWinner(bracket, bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]], '');
		}
		if (m.loseDest) {
			setMatchWinner(bracket, bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]], '');
		}
	}

	// progress players
	if (m.A && m.B) {
		m.winner = w;
		if (m.winDest) {
			bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = w ? m[w] : undefined;
		}
		if (m.loseDest) {
			bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] = w
				? m[w == 'A' ? 'B' : 'A']
				: undefined;
		}
	}

	// console.log(m);
	// console.log('---------------------------');
}

export function clearMatchWinner(bracket: Bracket, m: Match) {
	// remove winner from subsequent matches
	m.winner = '';
	if (m.winDest) {
		clearMatchWinner(bracket, bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]]);
	}
	if (m.loseDest) {
		clearMatchWinner(bracket, bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]]);
	}

	// progress
	if (m.A && m.B) {
		if (m.winDest) {
			bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = undefined;
		}
		if (m.loseDest) {
			bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] = undefined;
		}
	}
}
