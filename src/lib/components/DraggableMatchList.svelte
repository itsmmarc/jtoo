<script lang="ts">
	import type { Bracket4, Bracket8 } from '$lib/Bracket.svelte';
	import type { Player, SteamID3, TournamentFormat } from '$lib/types';
	import { getPlayer } from '$lib/util';

	let itemAIndex = $state(-1);
	let itemBIndex = $state(-1);

	type Props = {
		bracket: Bracket4 | Bracket8;
		tournamentFormat: TournamentFormat;
		onchange?: Function;
		debug?: boolean;
		class?: string;
	};
	let {
		bracket = $bindable(),
		tournamentFormat,
		onchange,
		debug,
		class: styleClass
	}: Props = $props();

	let players: SteamID3[] = $derived(getStartingMatches(bracket, tournamentFormat));

	function getStartingMatches(bracket: Bracket4 | Bracket8, format: TournamentFormat): SteamID3[] {
		let list: SteamID3[] = [];

		let maxPlayers = format == 'DoubleElim4Player' ? 4 : format == 'DoubleElim8Player' ? 8 : 0;
		for (let i = 0; i < maxPlayers / 2; i++) {
			list.push(bracket.Upper.QuarterFinals[i].A!);
			list.push(bracket.Upper.QuarterFinals[i].B!);
		}
		return list;
	}

	function syncBracket(
		players: SteamID3[],
		bracket: Bracket4 | Bracket8,
		format: TournamentFormat
	) {
		let maxPlayers = format == 'DoubleElim4Player' ? 4 : 8;
		for (let i = 0; i < maxPlayers; i++) {
			let actor: 'A' | 'B' = i % 2 == 0 ? 'A' : 'B';
			let matchIndex: number = Math.floor(i / 2);
			bracket.Upper.QuarterFinals[matchIndex][actor] = players[i];
			console.log(`Match ${matchIndex} Actor ${actor} changed to ${players[i]}`);
			console.log(bracket.Upper.QuarterFinals[matchIndex][actor]);
			console.log(bracket);
		}
		// bracket = { ...bracket };
	}

	let playerObjs = $derived(getPlayerObjs(players));

	function getPlayerObjs(players: SteamID3[]) {
		let list = [];
		for (const p of players) {
			list.push(getPlayer(p));
		}
		return list;
	}

	function swapPlayers(aIndex: number, bIndex: number) {
		if (debug) console.log(players);

		let temp = players[aIndex];

		// remove dragged item
		players.splice(aIndex, 1);

		// place dragged item in location of dragover
		players.splice(bIndex, 0, temp);

		syncBracket(players, bracket, tournamentFormat);

		if (onchange) onchange();

		players = [...players];

		if (debug) {
			console.log(players);
			console.log('-------------------------');
		}
	}
</script>

<div class="bg-obs-background {styleClass}">
	<ul class="flex flex-col">
		{#each players as player, i (i)}
			{@const playerObj = playerObjs[i]}
			<li
				class="grid grid-cols-12 bg-obs-padding {i % 2 ? 'mb-2' : ''}"
				draggable={true}
				ondragstart={() => {
					itemAIndex = i;
				}}
				ondragenter={() => {
					itemBIndex = i;
				}}
				ondragend={() => (itemAIndex = -1)}
				ondragover={(e) => e.preventDefault()}
				ondrop={() => {
					swapPlayers(itemAIndex, itemBIndex);
				}}
			>
				<div class="col-span-2">
					<img
						src={playerObj.avatarURL}
						alt=""
						class="size-12 rounded-xl object-cover object-center"
						draggable="false"
					/>
				</div>
				<div class="col-span-8">{playerObj.name}</div>
				<div class="col-span-2 flex flex-col">
					<button
						class="button {i == 0 ? 'pointer-events-none opacity-20' : ''}"
						onclick={() => {
							swapPlayers(i, i - 1);
						}}>⏶</button
					>
					<button
						class="button {i == players.length - 1 ? 'pointer-events-none opacity-20' : ''}"
						onclick={() => {
							swapPlayers(i, i + 1);
						}}>⏷</button
					>
				</div>
			</li>
		{/each}
	</ul>
</div>
