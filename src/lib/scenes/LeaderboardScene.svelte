<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { LeaderboardEntry, Player, type SteamID3 } from '$lib/types.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import Flag from '$lib/components/util/Flag.svelte';
	import { csToFormattedTime, csToSeconds, getTournament, getPlayer } from '$lib/util';

	let tournament = $derived(getTournament(overlay.current.tournament));
	let leaderboard = $derived(tournament.leaderboards[tournament.leaderboards.length - 1]);
	let leader = $derived(leaderboard.leaderboard[0]);

	const maxPlayers = 16;
	const maxNameLength = 12;

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
		{#each leaderboard.leaderboard as entry, i (i)}
			{#if entry}
				{@render Row(entry, i)}
				<hr class="hr" />
			{/if}
		{/each}
	</ul>
</section>

{#snippet Header(title: string)}
	<li class="pr-20 italic opacity-60" style:filter={getFiltersStyle()}>{title}</li>
{/snippet}

{#snippet Row(entry: LeaderboardEntry, i: number)}
	{@const player = getPlayer(entry.steamId3)}
	<!-- position -->
	<li>{i + 1}</li>
	<!-- avatar -->
	<li>
		<img
			in:fade
			src={player.avatarURL}
			alt=""
			class="size-24 rounded-xl object-cover object-center"
			draggable="false"
		/>
	</li>
	<!-- flag -->
	<li>
		<Flag code={player.flag} class="rounded-xl text-[6rem]" />
	</li>
	<!-- name -->
	<li>
		{player.name}
	</li>
	<!-- gap -->
	<li>
		{#if i > 0 && entry.prCs && leader.prCs}
			{entry.prCs == leader.prCs ? '' : '+'}
			{csToSeconds(entry.prCs - leader.prCs)}
		{:else}
			--
		{/if}
	</li>
	<!-- pr -->
	<li>
		{#if entry.prCs}
			{csToFormattedTime(entry.prCs)}
		{/if}
	</li>
{/snippet}
