<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { Player, type SteamID3 } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { csToSeconds, getPlayer, getTournament } from '$lib/util';
	import type { KSNWebSocket, PlayerTimer } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getContext } from 'svelte';
	import type { SvelteMap } from 'svelte/reactivity';

	type Props = { class?: string };
	let { class: styleClass }: Props = $props();

	let tournament = $derived(getTournament(overlay.current.tournament));
	let ksnWs: KSNWebSocket = getContext('ksnWs');
	let leaderboard = $derived(getLeaderboard(ksnWs.timer.players));

	type LeaderboardRow = { id: SteamID3; timer: PlayerTimer; player: Player };

	function getLeaderboard(playerTimers: SvelteMap<SteamID3, PlayerTimer>) {
		let leaderboardArrays = playerTimers.entries().toArray();
		let leaderboard: LeaderboardRow[] = [];
		for (let i = 0; i < leaderboardArrays.length; i++) {
			leaderboard.push({
				id: leaderboardArrays[i][0],
				timer: leaderboardArrays[i][1],
				player: getPlayer(leaderboardArrays[i][0])
			});
		}
		return leaderboard;
	}

	const maxPlayers = 16;
	const maxNameLength = 12;
</script>

<section class="{styleClass} absolute top-0 left-0 z-20 p-2">
	<div class="grid grid-cols-[repeat(4,auto)] gap-x-2 gap-y-0 text-xl *:m-0 *:p-0">
		{#each leaderboard as player, i (i)}
			{#if i < maxPlayers && player}
				{@render Row(player, i)}
				<hr class="hr m-1!" />
			{/if}
		{/each}
	</div>
	<!-- background -->
	<div
		class="absolute top-0 left-0 -z-1 h-full w-full bg-[#0f1016] opacity-95"
		style:filter={getFiltersStyle()}
	></div>
</section>

{#snippet Row(player: LeaderboardRow, i: number)}
	{@const name =
		player.player.name.length > maxNameLength
			? player.player.name.substring(0, maxNameLength) + '...'
			: player.player.name.substring(0, maxNameLength)}
	<!-- position -->
	<div>{i + 1}</div>
	<!-- avatar -->
	<div>
		<img
			in:fade
			src={player.player.avatarURL}
			alt=""
			class="size-7 rounded-md object-cover object-center"
			draggable="false"
		/>
	</div>
	<!-- name -->
	<div>
		{name}
	</div>
	<!-- gap -->
	<div class="w-full min-w-20 text-end">
		{#if i == 1 && player.timer.prFormatted}
			{player.timer.prFormatted}
		{:else if i > 1 && player.timer.prCs && leaderboard[0].timer.prCs}
			{player.timer.prCs == leaderboard[0].timer.prCs ? '' : '+'}
			{csToSeconds(player.timer.prCs - leaderboard[0].timer.prCs)}
		{:else}
			--
		{/if}
	</div>
{/snippet}
