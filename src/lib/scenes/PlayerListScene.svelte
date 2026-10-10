<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { Player } from '$lib/types.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import Flag from '$lib/components/util/Flag.svelte';
	import { getTournament } from '$lib/util';

	let tournament = $derived(getTournament(overlay.current.tournament));

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
		<li></li>
		<li></li>
		{@render Header('name')}
		{@render Header(`${tournament.info.class} rank`)}
		{@render Header('world records')}
		{@render Header('top times')}

		<hr class="hr" />
		{#each items.current.players as player, i (i)}
			{#if player.name}
				{@render PlayerSnippet(player)}
				<hr class="hr" />
			{/if}
		{/each}
	</ul>
</section>

{#snippet Header(title: string)}
	<li class="pr-20 italic opacity-60" style:filter={getFiltersStyle()}>{title}</li>
{/snippet}

{#snippet PlayerSnippet(player: Player)}
	<li class="-mt-2 -mb-2">
		<img
			in:fade
			src={player.avatarURL}
			alt=""
			class="size-24 rounded-xl object-cover object-center"
			draggable="false"
		/>
	</li>
	<li class="-mt-2 -mb-2">
		<Flag code={player.flag} class="rounded-xl text-[6rem]" />
	</li>
	{@render BodyCell(player.name)}
	{@render BodyCell(player.rank![tournament.info.class].rank.toString())}
	{@render BodyCell(player.WRs[tournament.info.class].toString())}
	{@render BodyCell(player.TTs[tournament.info.class].toString())}
{/snippet}

{#snippet BodyCell(content: string, noFilter: boolean = false)}
	<li class="-mt-2 -mb-2" style:filter={noFilter ? '' : getFiltersStyle()}>
		{content}
	</li>
{/snippet}
