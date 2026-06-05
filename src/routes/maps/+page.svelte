<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { settings, items } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import { messages } from '$lib/websocket';
	import { type PickBansSessionStateEvent } from '$lib/websocket-types';
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
	<section class="flex flex-wrap justify-around gap-5 p-10">
		{#each Object.entries(items.current.maps) as [key, map], i (i)}
			{#if key !== 'null'}
				{@const m: PickBansSessionStateEvent = messages.current[messages.current.length - 1]}

				<div class="@container relative mb-2 h-80 w-160 text-4xl">
					{#if m && 'session' in m && m.session}
						{#each m.session.history as step, i (i)}
							{#if step.mapId == map.ID}
								<div
									class="absolute top-0 right-0 -z-1 h-full w-full rounded-xl bg-linear-to-tr
                                                                {step.action == 'pick'
										? 'from-[#00ff0878]'
										: 'from-[#ff000078]'}
                                                                to-transparent"
								></div>
								<img
									src={step.actor == 'A'
										? m.session.playerA.avatarUrl
										: m.session.playerB.avatarUrl}
									alt=""
									class="absolute bottom-4 left-4 size-24 rounded-xl object-cover object-center"
									draggable="false"
								/>
							{/if}
						{/each}
					{/if}
					<h1
						class="absolute top-0 right-0 w-full p-2 text-center"
						style:filter={getFiltersStyle()}
					>
						{key}
					</h1>
					<div
						class="absolute top-0 right-0 -z-1 h-full w-full rounded-xl bg-linear-to-t from-transparent via-transparent to-[#000000aa]"
					></div>
					{#if map.imageURL}
						<img
							in:fade
							src={map.imageURL}
							alt=""
							class="absolute -z-10 h-full w-full rounded-xl object-cover blur-[2px]"
							draggable="false"
						/>
					{/if}
				</div>
			{/if}
		{/each}
	</section>
</section>
