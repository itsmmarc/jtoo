<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay, type Player } from '$lib/storage.svelte';
	import { settings } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import PRDisplay from '$lib/components/maps/PRDisplay.svelte';
</script>

<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<!-- <PlayerInput sideKey="leftPlayer" />
<hr class="mx-2 mb-2 h-32 w-1 self-end border-none bg-obs-padding" />
<PlayerInput side="right" /> -->

<section class="relative z-20 m-auto flex w-full justify-center gap-10 p-4">
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
	<ul class="grid grid-cols-[repeat(6,auto)] gap-x-6 gap-y-4 text-4xl">
		<li></li>
		<li></li>
		<li class="header">name</li>
		<li class="header">{overlay.current.class} rank</li>
		<li class="header">world records</li>
		<li class="header">top times</li>

		<hr class="col-span-6 mb-0 h-0.5 w-full border-none bg-obs-padding" />
		{#each items.current.players as player, i (i)}
			{#if player.name && player.isCompetitor}
				{@render Player(player)}
				<hr class="col-span-6 mb-0 h-0.5 w-full border-none bg-obs-padding" />
			{/if}
		{/each}
	</ul>
</section>

{#snippet Player(player: Player)}
	<li class="bodycell">
		<img
			in:fade
			src={player.avatarURL}
			alt=""
			class="size-24 rounded-xl object-cover object-center"
			draggable="false"
		/>
	</li>
	<li class="bodycell">
		<span in:fade class="fi fi-{player.flag} flex h-fit w-fit rounded-xl text-[6rem]"></span>
	</li>
	<li class="bodycell">
		{player.name}
	</li>
	<li class="bodycell">
		{player.rank![overlay.current.class]}
	</li>
	<li class="bodycell">
		{player.WRs}
	</li>
	<li class="bodycell">
		{player.TTs}
	</li>
{/snippet}

<style>
	@import 'tailwindcss';
	.header {
		@apply pr-20 italic opacity-60;
	}
	.bodycell {
		@apply -mt-2 -mb-2;
	}
</style>
