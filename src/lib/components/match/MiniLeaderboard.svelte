<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { Leaderboard, LeaderboardEntry } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { csToFormattedTime, csToSeconds, getTournament, getPlayer } from '$lib/util';
	import { overlay } from '$lib/storage.svelte';

	type Props = { class?: string };
	let { class: styleClass }: Props = $props();

	let tournament = $derived(getTournament(overlay.current.tournament));
	let leaderboardEntries = $derived(
		getLeaderboardEntries(tournament.leaderboards, tournament.leaderboards.length)
	);
	let leader = $derived(getLeaderEntry(leaderboardEntries));

	const maxPlayers = 16;
	const maxNameLength = 12;

	let visible = $state(false);
	let visibilityInterval: NodeJS.Timeout | undefined;
	const visibleTime = 10000;

	function getLeaderboardEntries(leaderboards: Leaderboard[], size: number) {
		console.log(tournament);
		if (size == 0) return undefined;

		console.log(leaderboards[leaderboards.length - 1].leaderboard);

		return leaderboards[leaderboards.length - 1].leaderboard;
	}

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
		if (i > 1 && entry.prCs && leader!.prCs) {
			if (entry.prCs == leader!.prCs) {
				return csToSeconds(entry.prCs - leader!.prCs);
			} else {
				return '+' + csToSeconds(entry.prCs - leader!.prCs);
			}
		}
		// return 'cp ' + entry.currentCheckpointsCs.size;

		return '--';
	}

	$effect(() => {
		if (leaderboardEntries) {
			if (visibilityInterval) {
				clearInterval(visibilityInterval);
			}
			visible = true;

			visibilityInterval = setInterval(() => {
				visible = false;
			}, visibleTime);
		}
	});
</script>

{#if leaderboardEntries && leaderboardEntries.length > 0}
	{#if visible}
		<section class="{styleClass} absolute top-0 left-0 z-20 p-2" transition:fade>
			<div class="grid grid-cols-[repeat(4,auto)] gap-x-2 gap-y-0 text-xl *:m-0 *:p-0">
				{#each leaderboardEntries as entry, i (i)}
					{#if i < maxPlayers && entry}
						{@render Row(entry, i)}
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
	{/if}
{/if}

{#snippet Row(entry: LeaderboardEntry, i: number)}
	{@const player = getPlayer(entry.steamId3)}
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
{/snippet}
