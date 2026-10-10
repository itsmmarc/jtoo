<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { overlay } from '$lib/storage.svelte';
	import { settings } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import PRDisplay from '$lib/components/maps/PRDisplay.svelte';
	import Flag from '$lib/components/util/Flag.svelte';
	import { Player, Tournament } from '$lib/types.svelte';
	import { getTournament } from '$lib/util';

	let tournament = $derived(getTournament(overlay.current.tournament));
</script>

<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<section class="relative z-20 m-auto flex w-full justify-center gap-10 p-4">
	{#if settings.current.enableGradient}
		<!-- gradients -->
		{#if settings.current.enableTeamColors}
			<div
				class="absolute top-0 left-0 size-full bg-linear-to-r from-ctp-blue/35 via-black/35 to-ctp-red/35"
			></div>
		{:else}
			<div
				class="absolute top-0 left-0 size-full bg-linear-to-r from-ctp-lavender/35 via-black/35 to-ctp-lavender/35"
				style:filter={getFiltersStyle()}
			></div>
		{/if}
	{:else}
		<!-- transparent black bg -->
		<div class="absolute top-0 left-0 size-full bg-black/35"></div>
	{/if}
	{@render PlayerCard('leftPlayer')}
	<PRDisplay />
	{@render PlayerCard('rightPlayer')}
</section>

{#snippet PlayerCard(sideKey: 'leftPlayer' | 'rightPlayer')}
	{@const player: Player = overlay.current[sideKey]}

	{#if player.name !== '' && player != null}
		<section class="relative z-10 flex h-full w-2/5 flex-col flex-wrap gap-4">
			<div class="flex justify-end gap-3 {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}">
				<div class={sideKey === 'rightPlayer' ? '' : 'text-right'}>
					<!-- name -->
					<div
						class="flex h-fit flex-col {sideKey === 'rightPlayer' ? 'items-end' : 'items-start'}"
						style:filter={getFiltersStyle()}
					>
						<div class="mb-3 flex gap-2">
							<!-- tag -->
							{#if settings.current.enableTags && player.tag}
								{#key player.tag}
									<span in:fade class="text-4xl text-ctp-text/75">{player.tag}</span>
								{/key}
							{/if}
							<!-- name -->
							{#key player.name}
								<span in:fade class="text-8xl font-bold">{player.name}</span>
							{/key}
						</div>
					</div>

					<!-- flag -->
					{#if settings.current.enableFlags && player.flag}
						<Flag code={player.flag} class="flex h-fit w-fit rounded-xl text-[8rem]" />
					{/if}
				</div>

				<!-- avatar -->
				{#if settings.current.enableAvatars && player.avatarURL}
					{#key player.avatarURL}
						<img
							in:fade
							src={player.avatarURL}
							alt=""
							class="size-80 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/key}
				{/if}
			</div>

			<div class="flex justify-end gap-3 {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}">
				<!-- info -->
				<div
					class="h-fit grow text-4xl {sideKey === 'rightPlayer' ? 'text-right' : 'text-left'}"
					style:filter={getFiltersStyle()}
				>
					<ul class="flex h-150 w-full flex-col gap-6">
						<li class="">{player.WRs[tournament.info.class]} world records</li>
						<li class="">{player.TTs[tournament.info.class]} top times</li>
						<li class="italic opacity-60">best run</li>
						<li class="-mt-6">{player.bestRun}</li>
						<li class="italic opacity-60">favourite map</li>
						<li class="-mt-6">{player.favouriteMap}</li>
						<!-- <li>{player.topTimes} top times</li> -->
						<li
							class="flex h-20 grow justify-end
                                                                {sideKey === 'rightPlayer'
								? 'flex-row'
								: 'flex-row-reverse'}"
						>
							<!-- okay for now since the app is client-side only, probably want to rework when (if) tempus api is implemented -->
							<!-- eslint-disable-->
							{@html player.note}
						</li>
					</ul>
				</div>

				<!-- ranks -->
				<div class="h-fit w-80 text-center" style:filter={getFiltersStyle()}>
					<h1 class="text-3xl">{tournament.info.class} rank</h1>
					<div class="text-8xl font-bold">
						#{player.rank![tournament.info.class].rank}
					</div>
				</div>
			</div>
		</section>
	{/if}
{/snippet}
