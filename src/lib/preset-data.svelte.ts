import { type Bracket4, type Bracket8 } from './Bracket.svelte';
import beh from '$lib/assets/beh.png';
import {
	type Player,
	nullPlayer,
	type MapsInfo,
	items,
	overlay,
	defaultBracket8,
	defaultBracket4
} from './storage.svelte';
import { getPlayer } from './util';

type Playoffs2026SoldierMapList = {
	pokus?: unknown;
	marigold?: unknown;
	phobos?: unknown;
	oddie?: unknown;
	ahh?: unknown;
	soar?: unknown;
	above?: unknown;
};
type Playoffs2026DemoMapList = {
	tissue?: unknown;
	carbon?: unknown;
	data?: unknown;
	greenguy2?: unknown;
	legocroc?: unknown;
	nbn?: unknown;
};

export const soldierPlayoffs2026: {
	players: Player[];
	maps: MapsInfo<Playoffs2026SoldierMapList>;
} = {
	players: [
		nullPlayer,
		{
			name: 'vice',
			isCompetitor: true,
			tempusID: '10736',
			steamID3: 406102720,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/a506cbb7cb2b69a9ce04193efe8668ec7d6f8725_full.jpg',
			tag: 'fuck vice',
			flag: 'sg',
			rank: { overall: 1, soldier: 3, demo: 1 },
			tempusPrs: {
				pokus: { rank: 1, time: '03:10.935' },
				marigold: { rank: 3, time: '01:18.630' },
				phobos: { rank: 1, time: '01:07.965' },
				oddie: { rank: 4, time: '01:51.795' },
				ahh: { rank: 1, time: '00:59.895' },
				soar: { rank: 3, time: '04:02.715' },
				above: { rank: 2, time: '01:09.705' }
			},
			WRs: 158,
			TTs: 893,
			bestRun: 'phobos',
			note: '-cg',
			favouriteMap: 'baqu',
			score: 0
		},
		{
			name: 'Nikita',
			isCompetitor: true,
			tempusID: '602086',
			steamID3: 1554510582,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/7e66f539d7f62409db0a6b9a39f5d7334d549a7a_full.jpg',
			tag: '',
			flag: 'se',
			rank: { overall: 2, soldier: 1, demo: 2591 },
			tempusPrs: {
				pokus: { rank: 2, time: '03:13.035' },
				marigold: { rank: 6, time: '01:20.550' },
				phobos: { rank: 7, time: '01:16.215' },
				oddie: { rank: 2, time: '01:48.510' },
				ahh: { rank: 3, time: '01:02.070' },
				soar: { rank: 4, time: '04:04.980' },
				above: { rank: 3, time: '01:10.575' }
			},
			WRs: 110,
			TTs: 186,
			bestRun: 'bangarang',
			note: '-rng',
			favouriteMap: 'pow',
			score: 0
		},
		{
			name: 'Garf',
			isCompetitor: true,
			tempusID: '579826',
			steamID3: 1283135081,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/45005e86d752dcb1439be9c937ee1ce6e2b4d0ab_full.jpg',
			tag: '',
			flag: 'pl',
			rank: { overall: 8, soldier: 6, demo: 388 },
			tempusPrs: {
				pokus: { rank: 9, time: '03:27.390' },
				marigold: { rank: 7, time: '01:22.125' },
				phobos: { rank: 2, time: '01:10.245' },
				oddie: { rank: 3, time: '01:49.770' },
				ahh: { rank: 2, time: '01:01.230' },
				soar: { rank: 5, time: '04:09.945' },
				above: { rank: 6, time: '01:12.945' }
			},
			WRs: 31,
			TTs: 215,
			bestRun: 'yona',
			note: 'hello',
			favouriteMap: 'uranium',
			score: 0
		},
		{
			name: 'bunny.',
			isCompetitor: true,
			tempusID: '357942',
			steamID3: 241719671,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/5f84395a8424e7d4828f6b18c9cb90a12fa24ed4_full.jpg',
			tag: '',
			flag: 'fi',
			rank: { overall: 4, soldier: 4, demo: 42 },
			tempusPrs: {
				pokus: { rank: 3, time: '03:16.125' },
				marigold: { rank: 1, time: '01:15.420' },
				phobos: { rank: 4, time: '01:14.070' },
				oddie: { rank: 1, time: '01:47.640' },
				ahh: { rank: 5, time: '01:02.265' },
				soar: { rank: 8, time: '04:21.210' },
				above: { rank: 7, time: '01:13.140' }
			},
			WRs: 99,
			TTs: 265,
			bestRun: 'destination_v2',
			note: `<img src="${beh}" class="object-fit h-auto max-w-full rounded-xl" alt="helmibunny" />`,
			favouriteMap: 'atrial',
			score: 0
		},
		{
			name: 'Sammy',
			isCompetitor: true,
			tempusID: '503501',
			steamID3: 1041041942,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/a5104f8172127271e4762fc0aa1112fc2b0a0f9f_full.jpg',
			tag: '',
			flag: 'ca',
			rank: { overall: 3, soldier: 2, demo: 46 },
			tempusPrs: {
				pokus: { rank: 23, time: '03:40.095' },
				marigold: { rank: 18, time: '01:27.885' },
				phobos: { rank: 9, time: '01:17.670' },
				oddie: { rank: 6, time: '01:53.805' },
				ahh: { rank: 4, time: '01:02.130' },
				soar: { rank: 26, time: '05:02.250' },
				above: { rank: 4, time: '01:11.160' }
			},
			WRs: 61,
			TTs: 403,
			bestRun: 'jump_junk_solly',
			note: '-rng',
			favouriteMap: 'miner',
			score: 0
		},
		{
			name: 'Hass',
			isCompetitor: true,
			tempusID: '31339',
			steamID3: 192454142,
			avatarURL:
				'https://shared.akamai.steamstatic.com/community_assets/images/items/1913420/1a5409eff27cdf6c32706526a68316820ca66835.gif',
			tag: '',
			flag: 'pk',
			rank: { overall: 19, soldier: 8, demo: 733 },
			tempusPrs: {
				pokus: { rank: 16, time: '03:34.230' },
				marigold: { rank: 8, time: '01:22.215' },
				phobos: { rank: 6, time: '01:15.180' },
				oddie: { rank: 10, time: '01:55.830' },
				ahh: { rank: 9, time: '01:04.530' },
				soar: { rank: 13, time: '04:30.975' },
				above: { rank: 10, time: '01:14.040' }
			},
			WRs: 2,
			TTs: 161,
			bestRun: 'pharaoh',
			note: 'never ask speedy a question',
			favouriteMap: 'lion',
			score: 0
		},
		{
			name: 'Spidda',
			isCompetitor: true,
			tempusID: '24856',
			steamID3: 97170957,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/31f788519863b79f24b1604e090596ba6961a3ab_full.jpg',
			tag: '',
			flag: 'us',
			rank: { overall: 26, soldier: 12, demo: 804 },
			tempusPrs: {
				pokus: { rank: 8, time: '03:24.570' },
				marigold: { rank: 5, time: '01:19.980' },
				phobos: { rank: 5, time: '01:14.535' },
				oddie: { rank: 11, time: '01:56.790' },
				ahh: { rank: 8, time: '01:03.660' },
				soar: { rank: 262, time: '09:46.110' },
				above: { rank: 27, time: '01:20.190' }
			},
			WRs: 5,
			TTs: 116,
			bestRun: 'nebu',
			note: 'fuck vice',
			favouriteMap: 'nebu',
			score: 0
		},
		{
			name: 'rev!4',
			isCompetitor: true,
			tempusID: '74551',
			steamID3: 140795940,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/11b15865f0ca1bfedec6df4938b1af00a3584d83_full.jpg',
			tag: '',
			flag: 'fr',
			rank: { overall: 51, soldier: 28, demo: 444 },
			tempusPrs: {
				pokus: { rank: 6, time: '03:21.360' },
				marigold: { rank: 2, time: '01:18.450' },
				phobos: { rank: 3, time: '01:12.855' },
				oddie: { rank: 8, time: '01:54.930' },
				ahh: { rank: 12, time: '01:05.370' },
				soar: { rank: 31, time: '05:07.245' },
				above: { rank: 5, time: '01:11.895' }
			},
			WRs: 11,
			TTs: 51,
			bestRun: 'rocky',
			note: '4',
			favouriteMap: 'vape',
			score: 0
		},
		{
			name: 'BLANK',
			isCompetitor: false,
			tempusID: '11459',
			steamID3: 86605721,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/bbc54b7632c3e3304667a666c8d09d33ab7e4449_full.jpg',
			tag: '',
			flag: 'dk',
			rank: { overall: 22, soldier: 10, demo: 1583 },
			tempusPrs: {
				pokus: { rank: 12, time: '03:29.985' },
				marigold: { rank: 9, time: '01:23.610' },
				phobos: { rank: 13, time: '01:21.615' },
				oddie: { rank: 9, time: '01:55.320' },
				ahh: { rank: 7, time: '01:03.570' },
				soar: { rank: 250, time: '09:24.510' },
				above: { rank: 140, time: '01:36.270' }
			},
			WRs: 9,
			TTs: 233,
			bestRun: 'camp',
			note: 'till we meet again..',
			favouriteMap: 'bromelia',
			score: 0
		},
		{
			name: 'Shanks',
			isCompetitor: false,
			tempusID: '457363',
			steamID3: 89322649,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/dfe99eee2427a67ab25226968d122fdc44e2e684_full.jpg',
			tag: '',
			flag: 'nl',
			rank: { overall: 270, soldier: 177, demo: 1516 },
			tempusPrs: {
				pokus: { rank: 1, time: '03:10.935' },
				marigold: { rank: 3, time: '01:18.629' },
				phobos: { rank: 1, time: '01:07.965' },
				oddie: { rank: 4, time: '01:51.855' },
				ahh: { rank: 1, time: '00:59.895' },
				soar: { rank: 3, time: '04:04.995' },
				above: { rank: 5, time: '01:13.305' }
			},
			WRs: 2,
			TTs: 15,
			bestRun: 'owakare',
			note: '',
			favouriteMap: 'owakare',
			score: 0
		},
		{
			name: 'mmarc',
			isCompetitor: false,
			tempusID: '94512',
			steamID3: 99019190,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/c855892d665ef9f667d80be7ba0c2971af34bac2_full.jpg',
			tag: '',
			flag: 'au',
			rank: { overall: 573, soldier: 626, demo: 411 },
			tempusPrs: {
				pokus: { rank: 1, time: '03:15.935' },
				marigold: { rank: 3, time: '01:38.629' },
				phobos: { rank: 1, time: '01:04.965' },
				oddie: { rank: 4, time: '01:50.855' },
				ahh: { rank: 1, time: '01:11.895' },
				soar: { rank: 3, time: '04:20.995' },
				above: { rank: 5, time: '01:11.305' }
			},
			WRs: 0,
			TTs: 1,
			bestRun: 'corona',
			note: 'i love goose',
			favouriteMap: 'corona',
			score: 0
		},
		{
			name: 'Kingstripes',
			isCompetitor: false,
			tempusID: '364734',
			steamID3: 50734103,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/452d5c9383da34ce0f9a06ec762f08a6b999a43c_full.jpg',
			tag: '',
			flag: 'au',
			rank: { overall: 130, soldier: 208, demo: 74 },
			tempusPrs: {
				pokus: { rank: 1, time: '03:12.935' },
				marigold: { rank: 3, time: '01:11.629' },
				phobos: { rank: 1, time: '01:06.965' },
				oddie: { rank: 4, time: '01:55.855' },
				ahh: { rank: 1, time: '00:51.895' },
				soar: { rank: 3, time: '04:02.995' },
				above: { rank: 5, time: '01:19.305' }
			},
			WRs: 99,
			TTs: 462,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		}
	],
	maps: {
		null: { filename: '', shortName: '' },
		pokus: {
			fileName: 'jump_pokus_rc4',
			shortName: 'pokus',
			ID: 'jump-pokus',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_pokus_rc4.webp'
			// zones:
		},
		marigold: {
			fileName: 'jump_marigold',
			shortName: 'marigold',
			ID: 'jump-marigold',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_marigold.webp'
			// zones:
		},
		phobos: {
			fileName: 'jump_phobos_zip',
			shortName: 'phobos',
			ID: 'jump-phobos',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_phobos_zip.webp'
			// zones:
		},
		oddie: {
			fileName: 'jump_oddie_a4',
			shortName: 'oddie',
			ID: 'jump-oddie',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_oddie_a4.webp'
			// zones:
		},
		ahh: {
			fileName: 'jump_ahh_c',
			shortName: 'ahh',
			ID: 'jump-ahh',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_ahh_c.webp'
			// zones:
		},
		soar: {
			fileName: 'jump_soar_a4',
			shortName: 'soar',
			ID: 'jump-soar',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_soar_a4.webp'
			// zones:
		},
		above: {
			fileName: 'jump_above_rc1',
			shortName: 'above',
			ID: 'jump-above',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_above_rc1.webp'
			// zones:
		}
	}
};

export const demoPlayoffs2026: {
	players: Player[];
	maps: MapsInfo<Playoffs2026DemoMapList>;
} = {
	players: [
		nullPlayer,
		{
			...soldierPlayoffs2026.players.filter((p) => p.name == 'vice')[0],
			tempusPrs: {
				tissue: { rank: 1, time: '01:09.240' },
				carbon: { rank: 1, time: '01:05.610' },
				data: { rank: 2, time: '01:06.675' },
				greenguy2: { rank: 1, time: '00:44.760' },
				legocroc: { rank: 1, time: '00:35.085' },
				nbn: { rank: 1, time: '04:06.900' }
			}
		},
		{
			name: 'newjuls',
			isCompetitor: true,
			tempusID: '281915',
			steamID3: 435752610,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/97c996f978b84083afc12e7713f9626cda82ff83_full.jpg',
			tag: '',
			flag: 'nz',
			rank: { overall: 6, soldier: 16, demo: 2 },
			tempusPrs: {
				tissue: { rank: 1, time: '03:10.935' },
				carbon: { rank: 3, time: '01:18.629' },
				data: { rank: 1, time: '01:07.965' },
				greenguy2: { rank: 4, time: '01:51.855' },
				legocroc: { rank: 1, time: '00:59.895' },
				nbn: { rank: 3, time: '04:04.995' }
			},
			WRs: 99,
			TTs: 462,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'cander',
			isCompetitor: true,
			tempusID: '243670',
			steamID3: 358457151,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/132bdddaf081fe2548a3503ed7058980cb189715_full.jpg',
			tag: 'real vice',
			flag: 'id',
			rank: { overall: 7, soldier: 58, demo: 3 },
			tempusPrs: {
				tissue: { rank: 4, time: '01:12.825' },
				carbon: { rank: 3, time: '01:08.250' },
				data: { rank: 4, time: '01:14.535' },
				greenguy2: { rank: 3, time: '00:48.885' },
				legocroc: { rank: 2, time: '00:36.885' },
				nbn: { rank: 201, time: '25:52.065' }
			},
			WRs: 498,
			TTs: 1156,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'nNameee',
			isCompetitor: true,
			tempusID: '35454',
			steamID3: 135796457,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/265eb8e845c99da4e5cae4563163cb974c3d482e_full.jpg',
			tag: '',
			flag: 'th',
			rank: { overall: 15, soldier: 268, demo: 9 },
			tempusPrs: {
				tissue: { rank: 1, time: '03:10.935' },
				carbon: { rank: 3, time: '01:18.629' },
				data: { rank: 1, time: '01:07.965' },
				greenguy2: { rank: 4, time: '01:51.855' },
				legocroc: { rank: 1, time: '00:59.895' },
				nbn: { rank: 3, time: '04:04.995' }
			},
			WRs: 14,
			TTs: 446,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			...soldierPlayoffs2026.players.filter((p) => p.name == 'Shanks')[0]
		},
		{
			...soldierPlayoffs2026.players.filter((p) => p.name == 'mmarc')[0]
		},
		{
			...soldierPlayoffs2026.players.filter((p) => p.name == 'Kingstripes')[0]
		}
	],
	maps: {
		null: { filename: '', shortName: '' },
		tissue: {
			fileName: 'jump_tissue',
			shortName: 'tissue',
			ID: 'jump-tissue',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_tissue.webp'
			// zones:
		},
		carbon: {
			fileName: 'jump_carbon_b1',
			shortName: 'carbon',
			ID: 'jump-carbon',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_carbon_b1.webp'
			// zones:
		},
		data: {
			fileName: 'jump_data_final',
			shortName: 'data',
			ID: 'jump-data',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_data_final.webp'
			// zones:
		},
		greenguy2: {
			fileName: 'jump_greenguy2_b2',
			shortName: 'greenguy2',
			ID: 'jump-greenguy2',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_greenguy2_b2.webp'
			// zones:
		},
		legocroc: {
			fileName: 'jump_legocroc_rc1',
			shortName: 'legocroc',
			ID: 'jump-legocroc',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_legocroc_rc1.webp'
			// zones:
		},
		nbn: {
			fileName: 'jump_nbn_b4b_redo_a1',
			shortName: 'nbn',
			ID: 'jump-nbn',
			imageURL: 'https://tempusplaza.com/map-backgrounds/jump_nbn_b4b_redo_a1.webp'
			// zones:
		}
	}
};

const soldierPlayoffs2026Bracket: Bracket8 = {
	...defaultBracket8,
	Upper: {
		QuarterFinals: [
			{
				A: getPlayer('vice', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Spidda', undefined, soldierPlayoffs2026.players),
				winner: 'A',
				winDest: ['Upper', 'SemiFinals', 0, 'A'],
				loseDest: ['Lower', 'Round1', 0, 'A']
			},
			{
				A: getPlayer('bunny.', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Sammy', undefined, soldierPlayoffs2026.players),
				winner: 'A',
				winDest: ['Upper', 'SemiFinals', 0, 'B'],
				loseDest: ['Lower', 'Round1', 0, 'B']
			},
			{
				A: getPlayer('Garf', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Hass', undefined, soldierPlayoffs2026.players),
				winner: 'B',
				winDest: ['Upper', 'SemiFinals', 1, 'A'],
				loseDest: ['Lower', 'Round1', 1, 'A']
			},
			{
				A: getPlayer('Nikita', undefined, soldierPlayoffs2026.players),
				B: getPlayer('rev!4', undefined, soldierPlayoffs2026.players),
				winner: 'A',
				winDest: ['Upper', 'SemiFinals', 1, 'B'],
				loseDest: ['Lower', 'Round1', 1, 'B']
			}
		],
		SemiFinals: [
			{
				A: getPlayer('vice', undefined, soldierPlayoffs2026.players),
				B: getPlayer('bunny.', undefined, soldierPlayoffs2026.players),
				winner: 'B',
				winDest: ['Upper', 'Final', 0, 'A'],
				loseDest: ['Lower', 'QuarterFinals', 0, 'B']
			},
			{
				A: getPlayer('Hass', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Nikita', undefined, soldierPlayoffs2026.players),
				winner: 'B',
				winDest: ['Upper', 'Final', 0, 'B'],
				loseDest: ['Lower', 'QuarterFinals', 1, 'B']
			}
		],
		Final: [
			{
				A: getPlayer('bunny.', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Nikita', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'GrandFinal', 0, 'A'],
				loseDest: ['Lower', 'Final', 0, 'B']
			}
		],
		GrandFinal: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: null,
				loseDest: null
			}
		]
	},
	Lower: {
		Round1: [
			{
				A: getPlayer('Spidda', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Sammy', undefined, soldierPlayoffs2026.players),
				winner: 'B',
				winDest: ['Lower', 'QuarterFinals', 0, 'A'],
				loseDest: null
			},
			{
				A: getPlayer('Garf', undefined, soldierPlayoffs2026.players),
				B: getPlayer('rev!4', undefined, soldierPlayoffs2026.players),
				winner: 'A',
				winDest: ['Lower', 'QuarterFinals', 1, 'A'],
				loseDest: null
			}
		],
		QuarterFinals: [
			{
				A: getPlayer('Sammy', undefined, soldierPlayoffs2026.players),
				B: getPlayer('vice', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Lower', 'SemiFinal', 0, 'A'],
				loseDest: null
			},
			{
				A: getPlayer('Garf', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Hass', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Lower', 'SemiFinal', 0, 'B'],
				loseDest: null
			}
		],
		SemiFinal: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Lower', 'Final', 0, 'A'],
				loseDest: null
			}
		],
		Final: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'GrandFinal', 0, 'B'],
				loseDest: null
			}
		]
	}
};

const demoPlayoffs2026Bracket: Bracket4 = {
	...defaultBracket4,
	Upper: {
		QuarterFinals: [
			{
				A: getPlayer('vice', undefined, demoPlayoffs2026.players),
				B: getPlayer('cander', undefined, demoPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'SemiFinal', 0, 'A'],
				loseDest: ['Lower', 'SemiFinal', 0, 'A']
			},
			{
				A: getPlayer('newjuls', undefined, demoPlayoffs2026.players),
				B: getPlayer('nNameee', undefined, demoPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'SemiFinal', 0, 'B'],
				loseDest: ['Lower', 'SemiFinal', 0, 'B']
			}
		],
		SemiFinal: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'GrandFinal', 0, 'A'],
				loseDest: ['Lower', 'Final', 0, 'B']
			}
		],
		GrandFinal: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: null,
				loseDest: null
			}
		]
	}
};

export function loadSoldierPlayoffs2026() {
	items.current.players = soldierPlayoffs2026.players;
	items.current.maps = soldierPlayoffs2026.maps;
	items.current.bracket = soldierPlayoffs2026Bracket;
	overlay.current.class = 'soldier';
}

export function loadDemoPlayoffs2026() {
	items.current.players = demoPlayoffs2026.players;
	items.current.maps = demoPlayoffs2026.maps;
	items.current.bracket = demoPlayoffs2026Bracket;
	overlay.current.class = 'demo';
}
