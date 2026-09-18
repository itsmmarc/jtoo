import { type Bracket4, type Bracket8 } from './Bracket.svelte';
import type { Tempus2 } from './api/tempus2/api-tempus2';
import { counters } from './storage.svelte';

// MARK: Types
export const TFClasses = ['demoman', 'soldier', 'overall'] as const;
export type TFClass = (typeof TFClasses)[number];

export type Rank = { points: number; rank: number; title: string | null };

export const Divisions = ['wood', 'steel', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
export type Division = (typeof Divisions)[number];

export class Player {
	name: string = '';
	division: Division | null = null;
	score: number = 0;
	tempusID: number = 0;
	steamID3: number = 0;
	steamID: string = '';
	avatarURL: string = '';
	tag: string = '';
	flag: string = '';
	pr: string = ''; // only used for manual PRs
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rank: Record<TFClass, Rank> = {
		demoman: { points: 0, rank: 0, title: '' },
		soldier: { points: 0, rank: 0, title: '' },
		overall: { points: 0, rank: 0, title: '' }
	};
	TTs: Record<TFClass, number> = { soldier: 0, demoman: 0, overall: 0 };
	WRs: Record<TFClass, number> = { soldier: 0, demoman: 0, overall: 0 };
	bestRun: string = '';
	note: string = '';
	favouriteMap: string = '';
}

export type MapRun = {
	tempusID: number;
	rank: number;
	duration: number;
};

export class TFMap {
	fileName: string = '';
	shortName: string = '';
	mapZoneId: number = 0;
	intendedClass: Record<Exclude<TFClass, 'overall'>, boolean> = { soldier: false, demoman: false };
	tier: Record<Exclude<TFClass, 'overall'>, number> = { soldier: 0, demoman: 0 };
	authors: Tempus2.Author[] = [];
	worldRecordInfo: Record<Exclude<TFClass, 'overall'>, Tempus2.Run2 | undefined> = {
		soldier: undefined,
		demoman: undefined
	};
	runs: Omit<Record<TFClass, MapRun[]>, 'overall'> = { soldier: [], demoman: [] };

	imageURL?: string = '';

	static fileNameToShortName(fileName: string): string {
		if (fileName == 'jump_') return fileName;

		let tmp = fileName.match(/(?<=_)[^_]+/); // match name after first '_' and before any subsequent '_', eg: 'beef' from 'jump_beef' or 'jump_beef_final'
		return tmp ? tmp[0].trim() : '';
	}

	static fileNameToTfId(fileName: string): string {
		return fileName.replace('_', '-');
	}
}

export const nullPlayer: Player = Object.freeze(new Player());

export const BracketOptions = ['whole', 'upper', 'lower'] as const;
export type BracketOption = (typeof BracketOptions)[number];

export interface PlayerPoints {
	playerId: number; // tempus id
	stage1: { pr: number; points: number };
	stage2: { laps: number; pr: number; points: number };
	stage3: { pr: number; points: number };
}

export const TournamentFormats = [
	'DoubleElim4Player',
	'DoubleElim8Player',
	'AllOutRoyale',
        'Leaderboard' // TODO name this something that makes snese
] as const;
export type TournamentFormat = (typeof TournamentFormats)[number];

interface Prize {
	placement: string;
	prize: string;
}

export class Tournament {
	id: number;
	format: TournamentFormat | '';
	info: {
		name: string;
		imageUrl: string;
		prizePool: Prize[];
		class: TFClass;
	};
	players: Player[];
	maps: TFMap[];
	bracket?: Bracket4 | Bracket8; // used for elim formats
	playerPoints?: PlayerPoints[]; // used for all out royale format

	constructor() {
		this.id = counters.current.tournamentId++;
		this.format = '';
		this.info = { name: '', imageUrl: '', prizePool: [], class: 'soldier' };
		this.players = [];
		this.maps = [];
	}
}

// add tournament PopOver
// choose format => construct(format, class)

// add info
// - name
// - prizes
// - pick players
// - search exsting players, add to list
// - add player PopOver, same as main controls screen
// - sort players by rank for selected class
// - pick maps
// - search exsting maps, add to list
// - add map PopOver, same as main controls screen
// - if elim format
// initialize bracket
// automatically seed based on sorted players
// allow dragging players to other slots
// select dragged item, match & player (A or B)
// select dropped on item, match & player (A or B)
// swap() players

// MARK: Settings
export const Fonts = [
	'font-fredoka',
	'font-inter',
	'font-bebas',
	'font-montserrat',
	'font-roboto',
	'font-space-grotesk'
] as const;
export type Font = (typeof Fonts)[number];

export const MonoFonts = [
	'font-dm-mono',
	'font-anonymous-pro',
	'font-ubuntu-mono',
	'font-azeret-mono',
	'font-chivo-mono',
	'font-spline-sans-mono'
] as const;
export type MonoFont = (typeof MonoFonts)[number];

export const OverlayScenes = [
	'',
	'MatchScene',
	'MapScene',
	'TournamentInfoScene',
	'BracketScene',
	'PlayerCardScene',
	'PlayerListScene',
	'ThanksScene'
] as const;
export type OverlayScene = (typeof OverlayScenes)[number];

export type Counters = { tournamentId: number };

export type Settings = {
	font: Font;
	monoFont: MonoFont;
	hue: number;
	saturation: number;
	enableMovingBG: boolean;
	enablePRs: boolean;
	enableAvatars: boolean;
	enableTags: boolean;
	enableFlags: boolean;
	enableGradient: boolean;
	enableTeamColors: boolean;
	enableSinglePOV: boolean;
	enablePOVGuide: boolean;
	useShortMapNames: boolean;
	tfWebSocketToken: string;
	overlayScene: OverlayScene;
	obsWsIp: string;
	obsWsPw: string;
	steamApiKey: string;
};

export type Overlay = {
	bestOf: number;
	leftPlayer: Player;
	rightPlayer: Player;
	map: TFMap;
	stage: string;
	tournament: Tournament;
};

export type Items = {
	players: Player[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	maps: TFMap[];
	stages: Array<string>;
	tournaments: Tournament[];
};
