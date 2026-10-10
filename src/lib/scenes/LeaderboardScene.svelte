<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { LeaderboardEntry, Player, type SteamID3 } from '$lib/types.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import Flag from '$lib/components/util/Flag.svelte';
	import { csToFormattedTime, csToSeconds, getTournament, getPlayer } from '$lib/util';
	import { calculatePlacements, type LeaderboardAvgEntry } from '$lib/tournament-scoring.svelte';

	let tournament = $derived(getTournament(overlay.current.tournament));

	let selectedLeaderboard = $state(0);
	let leaderboard = $derived(getLeaderboard(selectedLeaderboard));
	let _leader = $derived(leaderboard.leaderboard[0]);

	const maxPlayers = 8;
	const maxNameLength = 12;

	const drawBG: boolean = !page.url.searchParams.has('nobg');

	function getLeaderboard(index: number) {
		if (index == -1) return calculatePlacements(tournament.leaderboards);

		if (index >= 0 && index < tournament.leaderboards.length) {
			return tournament.leaderboards[selectedLeaderboard];
		}

		return tournament.leaderboards[tournament.leaderboards.length - 1];
	}
</script>

<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<section class="relative z-20 m-auto flex w-full flex-col justify-center gap-10 p-4">
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
	<ul class="flex justify-center gap-10 text-2xl">
		{#each { length: tournament.leaderboards.length }, i (i)}
			<button onclick={() => (selectedLeaderboard = i)}>
				<li
					class="{selectedLeaderboard == i
						? 'bg-ctp-lavender-950/40'
						: ''} rounded-xl p-2 pr-4 pl-4"
				>
					<div>
						round {i + 1}
					</div>
					<div class="italic opacity-80">
						{tournament.leaderboards[i].map}
					</div>
				</li>
			</button>
		{/each}
		<button onclick={() => (selectedLeaderboard = -1)}>
			<li
				class="{selectedLeaderboard == -1 ? 'bg-ctp-lavender-950/40' : ''} rounded-xl p-2 pr-4 pl-4"
			>
				total
			</li>
		</button>
	</ul>
	{#if selectedLeaderboard >= 0}
		<ul
			class="grid grid-cols-[repeat(6,max-content)] items-center justify-center gap-x-6 gap-y-4 text-4xl"
		>
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
				{#if entry && i < maxPlayers}
					{@render Row(entry as LeaderboardEntry, i)}
					<hr class="hr" />
				{/if}
			{/each}
		</ul>
	{:else if selectedLeaderboard == -1}
		<ul
			class="grid {settings.current.enableFlags
				? 'grid-cols-[repeat(6,max-content)]'
				: 'grid-cols-[repeat(5,max-content)]'}
                                items-center justify-center gap-x-6 gap-y-4 text-4xl"
		>
			<!--position-->
			<li></li>
			<!--avatar-->
			<li></li>
			{#if settings.current.enableFlags}
				<!--flag-->
				<li></li>
			{/if}
			{@render Header('Player')}
			{@render Header(`Average Placement`)}

			<hr class="hr" />
			{#each leaderboard.leaderboard as entry, i (i)}
				{#if entry && i < maxPlayers}
					{@render TotalRow(entry as LeaderboardAvgEntry, i)}
					<hr class="hr" />
				{/if}
			{/each}
		</ul>
	{/if}
</section>

{#snippet Header(title: string)}
	<li class="pr-20 italic opacity-60" style:filter={getFiltersStyle()}>{title}</li>
{/snippet}

{#snippet Row(entry: LeaderboardEntry, i: number)}
	{@const player = getPlayer(entry.steamId3)}
	{@const leader = _leader as LeaderboardEntry}
	<!-- position -->
	<li>{i + 1}</li>
	<!-- avatar -->
	<li>
		<img
			in:fade
			src={player.avatarURL}
			alt=""
			class="size-16 rounded-xl object-cover object-center"
			draggable="false"
		/>
	</li>
	{#if settings.current.enableFlags}
		<!-- flag -->
		<li>
			<Flag code={player.flag} class="rounded-xl text-[6rem]" />
		</li>
	{/if}
	<!-- name -->
	<li>
		{player.name}
	</li>
	<!-- gap -->
	<li>
		{#if i > 0 && entry.prCs && leader.prCs}
			{entry.prCs == leader.prCs ? '' : '+'}
			{csToSeconds(entry.prCs - leader.prCs).toFixed(2)}
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

{#snippet TotalRow(entry: LeaderboardAvgEntry, i: number)}
	{@const player = getPlayer(entry.steamId3)}
	<!-- position -->
	<li>{i + 1}</li>
	<!-- avatar -->
	<li>
		<img
			in:fade
			src={player.avatarURL}
			alt=""
			class="size-16 rounded-xl object-cover object-center"
			draggable="false"
		/>
	</li>
	{#if settings.current.enableFlags}
		<!-- flag -->
		<li>
			<Flag code={player.flag} class="rounded-xl text-[6rem]" />
		</li>
	{/if}
	<!-- name -->
	<li>
		{player.name}
	</li>
	<!-- gap -->
	<li>
		{entry.avgPlacement}
	</li>
{/snippet}
