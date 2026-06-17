<script lang="ts">
	import { type Player } from '$lib/storage.svelte';
	import { soldierPlayoffs2026 } from '$lib/preset-data.svelte';
	let players = soldierPlayoffs2026.players;

	function getPlayer(name: string): Player {
		return { ...players.filter((p) => p.name == name)[0] };
	}

	type Match = {
		A: Player;
		B: Player;
		winner: 'A' | 'B' | '';
		winDest: Array<string | number> | null;
		loseDest: Array<string | number> | null;
	};
	type Bracket = {
		Winners: { QuarterFinal: Match[]; SemiFinal: Match[]; Final: Match[]; GrandFinal: Match[] };
		Losers: { Round1: Match[]; QuarterFinal: Match[]; SemiFinal: Match[]; Final: Match[] };
	};

	let bracket: Bracket = $state({
		Winners: {
			QuarterFinal: [
				{
					A: getPlayer('vice'),
					B: getPlayer('Spidda'),
					winner: '',
					winDest: ['Winners', 'SemiFinal', 0, 'A'],
					loseDest: ['Losers', 'Round1', 0, 'A']
				},
				{
					A: getPlayer('bunny.'),
					B: getPlayer('Sammy'),
					winner: '',
					winDest: ['Winners', 'SemiFinal', 0, 'B'],
					loseDest: ['Losers', 'Round1', 0, 'B']
				},
				{
					A: getPlayer('Garf'),
					B: getPlayer('Hass'),
					winner: '',
					winDest: ['Winners', 'SemiFinal', 1, 'A'],
					loseDest: ['Losers', 'Round1', 1, 'A']
				},
				{
					A: getPlayer('Nikita'),
					B: getPlayer('rev!4'),
					winner: '',
					winDest: ['Winners', 'SemiFinal', 1, 'B'],
					loseDest: ['Losers', 'Round1', 1, 'B']
				}
			],
			SemiFinal: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Winners', 'Final', 0, 'A'],
					loseDest: ['Losers', 'QuarterFinal', 0, 'B']
				},
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Winners', 'Final', 0, 'B'],
					loseDest: ['Losers', 'QuarterFinal', 1, 'B']
				}
			],
			Final: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Winners', 'GrandFinal', 0, 'A'],
					loseDest: ['Losers', 'Final', 0, 'B']
				}
			],
			GrandFinal: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: null,
					loseDest: null
				}
			]
		},
		Losers: {
			Round1: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Losers', 'QuarterFinal', 0, 'A'],
					loseDest: null
				},
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Losers', 'QuarterFinal', 1, 'A'],
					loseDest: null
				}
			],
			QuarterFinal: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Losers', 'SemiFinal', 0, 'A'],
					loseDest: null
				},
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Losers', 'SemiFinal', 0, 'B'],
					loseDest: null
				}
			],
			SemiFinal: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Losers', 'Final', 0, 'A'],
					loseDest: null
				}
			],
			Final: [
				{
					A: getPlayer(''),
					B: getPlayer(''),
					winner: '',
					winDest: ['Winners', 'GrandFinal', 0, 'B'],
					loseDest: null
				}
			]
		}
	});

	function setMatchWinner(m: Match, w: 'A' | 'B') {
		// set winner
		m.winner = w;

		// progress players
		if (m.winDest) {
			bracket[m.winDest[0]][m.winDest[1]][m.winDest[2]][m.winDest[3]] = m[w];
		}
		if (m.loseDest) {
			bracket[m.loseDest[0]][m.loseDest[1]][m.loseDest[2]][m.loseDest[3]] = m[w == 'A' ? 'B' : 'A'];
		}
	}
</script>

<section>
	<h1 class="text-4xl">Bracket</h1>
	<h2 class="text-3xl">Winners Bracket</h2>
	<div class="flex flex-col gap-20">
		<div class="flex gap-40">
			<div>
				<h2 class="text-3xl">Quarter Final</h2>
				<div class="stage-container">
					{#each bracket.Winners.QuarterFinal as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl">Semi Final</h2>
				<div class="stage-container">
					{#each bracket.Winners.SemiFinal as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl">Final</h2>
				<div class="stage-container">
					{#each bracket.Winners.Final as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl">Grand Final</h2>
				<div class="stage-container">
					{#each bracket.Winners.GrandFinal as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
		</div>
		<div class="flex gap-40">
			<div>
				<h2 class="text-3xl">Round 1</h2>
				<div class="stage-container">
					{#each bracket.Losers.Round1 as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl">Quarter Final</h2>
				<div class="stage-container">
					{#each bracket.Losers.QuarterFinal as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl">Semi Final</h2>
				<div class="stage-container">
					{#each bracket.Losers.SemiFinal as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl">Final</h2>
				<div class="stage-container">
					{#each bracket.Losers.Final as match, i (i)}
						{@render Match(match)}
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

{#snippet Match(match: Match)}
	<div class="flex min-h-30 min-w-60 flex-col justify-between gap-2 bg-red-400 p-2 text-4xl">
		<button
			class="z-1 {match.winner ? (match.winner == 'A' ? 'bg-green-500' : 'bg-red-500') : ''}"
			onclick={() => {
				setMatchWinner(match, 'A');
			}}
		>
			{match.A.name}
		</button>

		<button
			class="z-1 {match.winner ? (match.winner == 'B' ? 'bg-green-500' : 'bg-red-500') : ''}"
			onclick={() => {
				setMatchWinner(match, 'B');
			}}
		>
			{match.B.name}
		</button>
	</div>
{/snippet}

<style>
	@import 'tailwindcss';
	.stage-container {
		@apply flex h-full flex-col justify-around gap-10 bg-gray-400;
	}
</style>
