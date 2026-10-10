<script lang="ts">
	import { overlay, items } from '$lib/storage.svelte';
	import { Player, type SteamID3 } from '$lib/types.svelte';
	import { getTournament, getPlayer, getPlayerIndex } from '$lib/util';
	import { getContext } from 'svelte';
	import RadioInputs from './RadioInputs.svelte';
	import type { JFRelayWebSocket } from '$lib/websockets/jf-relay/js-relay.svelte';

	let jfRelayWs: JFRelayWebSocket = getContext('jfRelayWs');

	type Props = {
		player: SteamID3 | undefined;
		playerNum: 0 | 1 | 2 | 3;
	};

	const slotLabel = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' } as const;

	type Slot = keyof typeof slotLabel; // 1 | 2

	function getLabel(slot: Slot) {
		return slotLabel[slot];
	}

	let { player, playerNum }: Props = $props();
	let tournament = $derived(getTournament(overlay.current.tournament));
	const playerObj: Player = $derived(getPlayer(player));
	const maxScore: number = $derived((overlay.current.bestOf + 1) / 2);

	function incrementScore(player: SteamID3) {
		let newScore = playerObj.score;
		newScore++;
		if (newScore > maxScore) return;
		items.current.players[getPlayerIndex(player)].score = newScore;
	}
	function decrementScore(player: SteamID3) {
		let newScore = playerObj.score;
		newScore--;
		if (newScore < 0) return;
		items.current.players[getPlayerIndex(player)].score = newScore;
	}
</script>

<div class="flex w-full max-w-full flex-col items-start">
	{#if tournament}
		<span class="self-center text-center">player {getLabel(playerNum)}</span>

		<!-- score -->
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<div class="flex justify-center self-center">
			<!-- <button
				class="button rounded-r-none"
				onclick={() => {
					if (player) decrementScore(player);
				}}><span class="icon-[mdi--minus] align-middle"></span></button
			>
			<span class="button button-selected rounded-none">{playerObj.score}</span> -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<!-- <button
				class="button rounded-l-none border-ctp-lavender-950/50 bg-ctp-lavender/50 px-2 hover:bg-ctp-lavender/85"
				onclick={() => {
					if (player) incrementScore(player);
				}}><span class="icon-[mdi--plus] align-middle"></span></button
			> -->
		</div>

		<div class="flex flex-col">
			<!-- name -->
			<span>player</span>
			{#if items.current.players.length === 0}
				<span class="text-ctp-text/50">no players..</span>
			{:else}
				<RadioInputs
					optlabels={tournament.players.map((sId3) => getPlayer(sId3).name)}
					opts={tournament.players}
					bind:value={overlay.current.players[playerNum]}
					onchange={() => {
						jfRelayWs.broadcastSelectedPlayers(overlay.current.players);
					}}
				/>
			{/if}
		</div>
	{/if}
</div>
