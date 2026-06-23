<script lang="ts">
	import { csToTime, timer } from '$lib/websocket.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { slide, fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	let bestCps = $derived(getBestCheckpoints());
	let betterSide: 'left' | 'right' | '' = $derived(getBetterSide());
	let size = $derived(timer.current.checkpoints.length);

	function getBetterSide() {
		let betterSide: 'left' | 'right' | '';

		if (!timer.current.leftPr && !timer.current.rightPr) {
			betterSide = '';
		} else if (timer.current.leftPr && !timer.current.rightPr) {
			betterSide = 'left';
		} else if (!timer.current.leftPr && timer.current.rightPr) {
			betterSide = 'right';
		} else {
			betterSide = timer.current.leftPr! < timer.current.rightPr! ? 'left' : 'right';
		}

		return betterSide;
	}

	function getBestCheckpoints() {
		let bestCps: number[] = [];

		if (timer.current.leftPr && timer.current.rightPr) {
			return bestCps;
		}

		bestCps = timer.current[`${betterSide}PrCps`];

		return bestCps;
	}
</script>

<div class="absolute right-0 left-0 m-auto mt-2 w-[25%] {settings.current.monoFont}">
	{#key betterSide}
		{#if betterSide}
			<div class="grid grid-cols-3 items-center justify-center gap-x-4 text-center text-3xl">
				<div class="justify-self-end">
					{#if betterSide == 'left'}
						<img
							in:fade
							src={overlay.current.leftPlayer.avatarURL}
							alt=""
							class="size-13 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/if}
				</div>
				<div>
					{csToTime(timer.current[`${betterSide}Pr`]! * 100)}
				</div>
				<div>
					{#if betterSide == 'right'}
						<img
							in:fade
							src={overlay.current.rightPlayer.avatarURL}
							alt=""
							class="size-13 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/if}
				</div>
				<hr class="col-span-full m-2 h-0.5 border-none bg-obs-padding" />
			</div>
		{/if}
	{/key}

	<div
		class="grid h-83 grid-cols-3 justify-center gap-x-4
                {size > 14 ? 'gap-y-1 text-2xl' : 'gap-y-3 text-3xl'}"
	>
		<!-- left comparison -->
		<div class="justify-self-end text-right">
			{#each timer.current.leftcps as time, i (i)}
				{#if bestCps && bestCps[i]}
					{@const diff = time - bestCps[i]}
					{@const speed: 'faster' | 'same' | 'slower' = diff < 0 ? 'faster' : diff == 0 ? 'same' : diff > 0 ? 'slower' : 'same'}
					<div>
						<span
							transition:fade|global
							class="rounded-lg px-2.5
                                                        {speed == 'slower'
								? 'bg-ctp-blue-950/40'
								: 'bg-ctp-blue-800/55'}
                                                        {size > 14 ? 'text-xl' : 'text-2xl'}"
						>
							{speed != 'faster' ? '+' : ''}{diff.toFixed(2)}
						</span>
					</div>
				{/if}
			{/each}
		</div>

		<!-- best pr cps -->
		<div class="justify-self-center text-center">
			{#each bestCps as cp, i (i)}
				<div>
					{csToTime(cp * 100)}
				</div>
			{/each}
		</div>

		<!-- right comparison -->
		<div class="justify-self-start text-left">
			{#each timer.current.rightcps as time, i (i)}
				{#if bestCps && bestCps[i]}
					{@const diff = time - bestCps[i]}
					{@const speed: 'faster' | 'same' | 'slower' = diff < 0 ? 'faster' : diff == 0 ? 'same' : diff > 0 ? 'slower' : 'same'}
					<div>
						<span
							transition:fade|global
							class="rounded-lg px-2.5
                                                        {speed == 'slower'
								? 'bg-ctp-red-950/40'
								: 'bg-ctp-red-800/55'}
                                                        {size > 14 ? 'text-xl' : 'text-2xl'}"
						>
							{speed != 'faster' ? '+' : ''}{diff.toFixed(2)}
						</span>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
