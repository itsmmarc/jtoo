import { type Bracket } from './Bracket.svelte';
import {
	type Player,
	nullPlayer,
	type MapsInfo,
	items,
	overlay,
	defaultBracket
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

export const soldierPlayoffs2026 = {
	players: [
		{ name: '', score: 0, tempusPrs: {} },
		{
			name: 'vice',
			tempusID: '10736',
			steamID3: 406102720,
			avatarURL:
				'https://avatars.akamai.steamstatic.com/75f84c1f8d7956ad4521718c53c6a7b381e3acee_full.jpg',
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
			WRs: 318,
			TTs: 2168,
			bestRun: 'jump_phobos',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Nikita',
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
				ahh: { rank: 427, time: '01:57.015' },
				soar: { rank: 4, time: '04:04.980' },
				above: { rank: 3, time: '01:10.575' }
			},
			WRs: 426,
			TTs: 534,
			bestRun: '?',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Garf',
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
			WRs: 92,
			TTs: 951,
			bestRun: 'jump_yona',
			note: 'hello',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'bunny.',
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
				ahh: { rank: 4, time: '01:02.265' },
				soar: { rank: 8, time: '04:21.210' },
				above: { rank: 7, time: '01:13.140' }
			},
			WRs: 147,
			TTs: 610,
			bestRun: 'jump_destination_v2',
			note: '<img src="https://media.discordapp.net/attachments/1513525278264262799/1515369370816090152/beh.png?ex=6a2ec134&is=6a2d6fb4&hm=ff05552b818d3e0a2263dbbbdee10c1c942f709dbdbbd8979925921d86d06105&=&format=webp&quality=lossless" class="rounded-xl object-cover" />', // find better quality if possible
			favouriteMap: 'jump_atrial',
			score: 0
		},
		{
			name: 'Sammy',
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
				ahh: { rank: 3, time: '01:02.130' },
				soar: { rank: 26, time: '05:02.250' },
				above: { rank: 4, time: '01:11.160' }
			},
			WRs: 132,
			TTs: 922,
			bestRun: 'jump_junk_solly',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Hass',
			tempusID: '31339',
			steamID3: 192454142,
			avatarURL:
				'https://shared.akamai.steamstatic.com/community_assets/images/items/1913420/1a5409eff27cdf6c32706526a68316820ca66835.gif',
			tag: '',
			flag: 'gb',
			rank: { overall: 19, soldier: 8, demo: 733 },
			tempusPrs: {
				pokus: { rank: 16, time: '03:34.230' },
				marigold: { rank: 8, time: '01:22.215' },
				phobos: { rank: 6, time: '01:15.180' },
				oddie: { rank: 10, time: '01:55.830' },
				ahh: { rank: 8, time: '01:04.530' },
				soar: { rank: 13, time: '04:30.975' },
				above: { rank: 10, time: '01:14.040' }
			},
			WRs: 2,
			TTs: 226,
			bestRun: 'jump_pharaoh',
			note: 'never ask speedy a question',
			favouriteMap: 'jump_lion',
			score: 0
		},
		{
			name: 'Spidda',
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
				ahh: { rank: 7, time: '01:03.660' },
				soar: { rank: 262, time: '09:46.110' },
				above: { rank: 27, time: '01:20.190' }
			},
			WRs: 6,
			TTs: 174,
			bestRun: 'jump_descent',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'rev!4',
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
				ahh: { rank: 11, time: '01:05.370' },
				soar: { rank: 31, time: '05:07.245' },
				above: { rank: 5, time: '01:11.895' }
			},
			WRs: 13,
			TTs: 74,
			bestRun: '',
			note: '',
			favouriteMap: '',
			score: 0
		},
		{
			name: 'Shanks',
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
	] as Player[],
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
	} as MapsInfo<Playoffs2026SoldierMapList>
};

const soldierPlayoffs2026Bracket: Bracket = {
	...defaultBracket,
	Upper: {
		QuarterFinals: [
			{
				A: getPlayer('vice', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Spidda', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'SemiFinals', 0, 'A'],
				loseDest: ['Lower', 'Round1', 0, 'A']
			},
			{
				A: getPlayer('bunny.', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Sammy', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'SemiFinals', 0, 'B'],
				loseDest: ['Lower', 'Round1', 0, 'B']
			},
			{
				A: getPlayer('Garf', undefined, soldierPlayoffs2026.players),
				B: getPlayer('Hass', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'SemiFinals', 1, 'A'],
				loseDest: ['Lower', 'Round1', 1, 'A']
			},
			{
				A: getPlayer('Nikita', undefined, soldierPlayoffs2026.players),
				B: getPlayer('rev!4', undefined, soldierPlayoffs2026.players),
				winner: '',
				winDest: ['Upper', 'SemiFinals', 1, 'B'],
				loseDest: ['Lower', 'Round1', 1, 'B']
			}
		],
		SemiFinals: [
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'Final', 0, 'A'],
				loseDest: ['Lower', 'QuarterFinals', 0, 'B']
			},
			{
				A: nullPlayer,
				B: nullPlayer,
				winner: '',
				winDest: ['Upper', 'Final', 0, 'B'],
				loseDest: ['Lower', 'QuarterFinals', 1, 'B']
			}
		],
		Final: [
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

export const demoPlayoffs2026 = {
	players: [
		{ name: '', score: 0, tempusPrs: {} },
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
			name: 'namee',
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
	] as Player[],
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
	} as MapsInfo<Playoffs2026DemoMapList>
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
	overlay.current.class = 'demo';
}
