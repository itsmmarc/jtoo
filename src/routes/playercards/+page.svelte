<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, overlay } from '$lib/storage.svelte';
	import { settings } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import PRDisplay from '$lib/components/controls/PRDisplay.svelte';
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

	{#if player.name === '' || player == null}
		<div>no player</div>
	{:else}
		<section class="relative z-10 flex h-full flex-col flex-wrap gap-4">
			<div class="flex justify-end gap-3 {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}">
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

				<!-- avatar -->
				{#if settings.current.enableAvatars && player.avatarURL}
					{#key player.avatarURL}
						<img
							in:fade
							src={player.avatarURL}
							alt=""
							class=" size-80 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/key}
				{/if}
			</div>

			<div class="flex justify-end gap-3 {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}">
				<div class="row-span-full h-0"></div>

				<dl class="text-xl">
					<dt>best run</dt>
					<dd>{player.bestRun}</dd>
					<dt>number of world records</dt>
					<dd>{player.numWRs}</dd>
				</dl>

				<!-- ranks -->
				<div class="h-fit w-80 text-center">
					<h1 class="text-5xl font-bold">rank</h1>
					<hr class="mb-0.5 h-0.5 w-full border-none bg-obs-padding" />
					<dl class="grid grid-cols-3 gap-2 text-3xl">
						<dt>overall</dt>
						<dd class="order-4">{player.rank?.overall}</dd>
						<dt class="order-2">soldier</dt>
						<dd class="order-5">{player.rank?.soldier}</dd>
						<dt class="order-3">demo</dt>
						<dd class="order-6">{player.rank?.demo}</dd>
					</dl>
				</div>
			</div>
		</section>
	{/if}
{/snippet}
