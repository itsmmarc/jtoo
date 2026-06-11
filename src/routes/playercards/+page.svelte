<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { overlay } from '$lib/storage.svelte';
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
	{@const player = overlay.current[sideKey]}

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
						{#key player.flag}
							<span in:fade class="fi fi-{player.flag} flex h-fit w-fit rounded-xl text-[8rem]"
							></span>
						{/key}
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
					<ul class="w-full">
						<li class="m-10">{player.WRs} world records</li>
						<li class="m-10">{player.TTs} top times</li>
						<!-- <li>{player.topTimes} top times</li> -->
						<li
							class="m-10 flex justify-end
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
					{#if overlay.current.class == 'overall'}
						<h1 class=" text-3xl">overall rank</h1>
						<div class="text-8xl font-bold">#{player.rank!.overall}</div>
						<h1 class="text-3xl">soldier rank</h1>
						<div class="text-8xl font-bold">#{player.rank!.soldier}</div>
						<h1 class="text-3xl">demo rank</h1>
						<div class="text-8xl font-bold">#{player.rank!.demo}</div>
					{:else}
						<h1 class="text-3xl">{overlay.current.class} rank</h1>
						<div class="text-8xl font-bold">#{player.rank![overlay.current.class]}</div>
					{/if}
				</div>
			</div>
		</section>
	{/if}
{/snippet}
