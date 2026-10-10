<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { Round, LeaderboardEntry } from '$lib/types.svelte';
	import { fade } from 'svelte/transition';
	import { csToFormattedTime, csToSeconds, getTournament, getPlayer } from '$lib/util';
	import { overlay } from '$lib/storage.svelte';
	import { KSNWebSocketLeaderboardReceiver } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { onMount } from 'svelte';

	type Props = { class?: string };
	let { class: styleClass }: Props = $props();

	let roundBc: KSNWebSocketLeaderboardReceiver | undefined = $state();
	onMount(() => {
		roundBc = new KSNWebSocketLeaderboardReceiver('ksnWs');
	});

	let leaderboardEntries = $derived(roundBc?.round?.leaderboard);
	let leader = $derived(getLeaderEntry(leaderboardEntries));

	const maxPlayers = 8;
	const maxNameLength = 12;

	let visible = $state(false);
	let visibilityInterval: NodeJS.Timeout | undefined;
	const visibleTime = 30000;

	function getLeaderEntry(leaderboard: LeaderboardEntry[] | undefined) {
		if (!leaderboard) return undefined;

		return leaderboard[0];
	}

	function getGapTime(entry: LeaderboardEntry, i: number) {
		// if leader
		if (i == 0 && entry.prCs) {
			return csToFormattedTime(entry.prCs);
		}
		// if not leader and both the leader and this player have a pr
		if (i > 0 && entry.prCs && leader!.prCs) {
			if (entry.prCs == leader!.prCs) {
				return csToSeconds(entry.prCs - leader!.prCs).toFixed(2);
			} else {
				return '+' + csToFormattedTime(entry.prCs - leader!.prCs);
			}
		}
		// return 'cp ' + entry.currentCheckpointsCs.size;

		return '--';
	}

	// $effect(() => {
	// 	if (leaderboardEntries) {
	// 		if (visibilityInterval) {
	// 			clearInterval(visibilityInterval);
	// 		}
	// 		visible = true;

	// 		visibilityInterval = setInterval(() => {
	// 			visible = false;
	// 		}, visibleTime);
	// 	}
	// });
</script>

<section class="{styleClass} absolute top-0 left-0 z-20 p-2" transition:fade>
	<div class="grid grid-cols-[repeat(4,auto)] gap-x-2 gap-y-0 text-xl *:m-0 *:p-0">
		{#each leaderboardEntries as entry, i (i)}
			{#if i < maxPlayers && entry}
				{@render Row(entry, i)}
			{/if}
		{/each}
	</div>
	<!-- background -->
	<div
		class="absolute top-0 left-0 -z-1 h-full w-full rounded-md bg-[#0f0f16] opacity-90"
		style:filter={getFiltersStyle()}
	></div>
</section>

{#snippet Row(entry: LeaderboardEntry, i: number)}
	{@const player = getPlayer(entry.steamId3)}
	{#if player && (entry.prCs || entry.currentCheckpointsCs.size > 0)}
		{@const name =
			player.name.length > maxNameLength
				? player.name.substring(0, maxNameLength) + '...'
				: player.name.substring(0, maxNameLength)}
		{@const gap = getGapTime(entry, i)}
		<!-- position -->
		<div>{i + 1}</div>
		<!-- avatar -->
		<div>
			{#if player && player.avatarURL}
				<img
					in:fade
					src={player.avatarURL}
					alt=""
					class="size-7 rounded-md object-cover object-center"
					draggable="false"
				/>
			{/if}
		</div>
		<!-- name -->
		<div>
			{#if player}
				{name}
			{:else}
				unknown
			{/if}
		</div>
		<!-- gap -->
		<div class="w-full min-w-20 text-end">
			{gap}
		</div>
		<hr class="hr m-1!" />
	{/if}
{/snippet}
