<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { Player, type SteamID3 } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import Flag from '$lib/components/util/Flag.svelte';
	import { csToSeconds, getPlayer, getTournament } from '$lib/util';
	import type { KSNWebSocket, PlayerTimer } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getContext } from 'svelte';
	import type { SvelteMap } from 'svelte/reactivity';

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

	const drawBG: boolean = !page.url.searchParams.has('nobg');
</script>

<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<section class="relative z-20 m-auto flex w-full justify-center gap-10 p-4">
	{#if drawBG}
		{#if settings.current.enableGradient}
			<!-- gradients -->
			{#if settings.current.enableTeamColors}
				<div
					class="absolute top-0 left-0 -z-10 size-full bg-linear-to-r from-ctp-blue/35 via-black/35 to-ctp-red/35"
				></div>
			{:else}
				<div
					class="absolute top-0 left-0 -z-10 size-full bg-linear-to-r from-ctp-lavender/35 via-black/35 to-ctp-lavender/35"
					style:filter={getFiltersStyle()}
				></div>
			{/if}
		{:else}
			<!-- transparent black bg -->
			<div class="absolute top-0 left-0 size-full bg-black/35"></div>
		{/if}
	{/if}
	<ul class="grid grid-cols-[repeat(6,auto)] gap-x-6 gap-y-4 text-4xl">
		<!--position-->
		<li></li>
		<!--avatar-->
		<li></li>
		<!--flag-->
		<li></li>
		{@render Header('Player')}
		{@render Header(`Gap`)}
		{@render Header('PR')}

		<hr class="hr" />
		{#each leaderboard as player, i (i)}
			{#if player}
				{@render Row(player, i)}
				<hr class="hr" />
			{/if}
		{/each}
	</ul>
</section>

{#snippet Header(title: string)}
	<li class="pr-20 italic opacity-60" style:filter={getFiltersStyle()}>{title}</li>
{/snippet}

{#snippet Row(player: LeaderboardRow, i: number)}
	<!-- position -->
	<li>{i + 1}</li>
	<!-- avatar -->
	<li>
		<img
			in:fade
			src={player.player.avatarURL}
			alt=""
			class="size-24 rounded-xl object-cover object-center"
			draggable="false"
		/>
	</li>
	<!-- flag -->
	<li>
		<Flag code={player.player.flag} class="rounded-xl text-[6rem]" />
	</li>
	<!-- name -->
	<li>
		{player.player.name}
	</li>
	<!-- gap -->
	<li>
		{#if i > 1 && player.timer.prCs && leaderboard[0].timer.prCs}
			{player.timer.prCs == leaderboard[0].timer.prCs ? '' : '+'}
			{csToSeconds(player.timer.prCs - leaderboard[0].timer.prCs)}
		{:else}
			--
		{/if}
	</li>
	<!-- pr -->
	<li>
		{#if player.timer.prFormatted}
			{player.timer.prFormatted}
		{/if}
	</li>
{/snippet}
