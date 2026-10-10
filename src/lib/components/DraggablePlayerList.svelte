<script lang="ts">
	import type { Player, SteamID3 } from '$lib/types.svelte';
	import { getPlayer } from '$lib/util';

	let itemAIndex = $state(-1);
	let itemBIndex = $state(-1);

	type Props = {
		players: SteamID3[];
		onremove: Function;
		onchange?: Function;
		debug?: boolean;
		class?: string;
	};
	let { players = $bindable(), onchange, onremove, debug, class: styleClass }: Props = $props();

	let playerObjs = $derived(getPlayerObjs(players));

	function getPlayerObjs(players: SteamID3[]) {
		let list = [];
		for (const p of players) {
			list.push(getPlayer(p));
		}
		return list;
	}

	function removePlayer(player: SteamID3) {
		players = players.filter((p) => p != player);
	}

	function swapPlayers(aIndex: number, bIndex: number) {
		if (debug) console.log(players);

		let temp = players[aIndex];

		// remove dragged item
		players.splice(aIndex, 1);

		// place dragged item in location of dragover
		players.splice(bIndex, 0, temp);

		if (onchange) onchange();

		players = [...players];

		if (debug) {
			console.log(players);
			console.log('-------------------------');
		}
	}
</script>

<div class="bg-obs-background {styleClass}">
	<ul class="flex flex-col gap-2">
		{#each players as player, i (i)}
			{@const playerObj = playerObjs[i]}
			<li
				class="grid grid-cols-12 bg-obs-padding"
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
				<div class="col-span-6">{playerObj.name}</div>
				<div class="col-span-2">
					<button
						class="button-remove"
						onclick={() => {
							removePlayer(player);
							onremove();
						}}>remove</button
					>
				</div>
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
