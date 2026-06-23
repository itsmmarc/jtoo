<script lang="ts">
	import { csToTime, timer } from '$lib/websocket.svelte';
	import { items, overlay, settings } from '$lib/storage.svelte';
	import { slide, fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	let bestCps = $derived(getBestCheckpoints());
	let bestSideCps = $derived(getBestSideCheckpoints());
	let bestSide: 'left' | 'right' | '' = $derived(getBestSide());
	let size = $derived(timer.current.checkpoints.length);

	function getBestSide() {
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

	function getBestSideCheckpoints() {
		let bestSideCps: number[] = [];

		if (timer.current.leftPr && timer.current.rightPr) {
			return bestSideCps;
		}

		bestSideCps = timer.current[`${bestSide}PrCps`];

		return bestSideCps;
	}

	function getBestCheckpoints() {
		let bestCps: number[] = [];

		for (let i = 0; i < size; i++) {
			if (!timer.current.leftcps[i] && !timer.current.rightcps[i]) {
				break;
			} else if (timer.current.leftcps[i] && !timer.current.rightcps[i]) {
				bestCps[i] = timer.current.leftcps[i];
			} else if (!timer.current.leftcps[i] && timer.current.rightcps[i]) {
				bestCps[i] = timer.current.rightcps[i];
			} else {
				bestCps[i] =
					timer.current.leftcps[i] < timer.current.rightcps[i]
						? timer.current.leftcps[i]
						: timer.current.rightcps[i];
			}
		}

		return bestCps;
	}
</script>

{#key bestSide}
	{@const cps = bestSide ? bestSideCps : bestCps}
	<div class="absolute right-0 left-0 m-auto mt-2 w-[25%] {settings.current.monoFont}">
		<!-- header -->
		{#if bestSide}
			<div class="grid grid-cols-3 items-center justify-center gap-x-4 text-center text-3xl">
				<div class="justify-self-end">
					{#if bestSide == 'left'}
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
					{csToTime(timer.current[`${bestSide}Pr`]! * 100)}
				</div>
				<div>
					{#if bestSide == 'right'}
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

		<!-- cps -->
		<div
			class="grid h-83 grid-cols-3 justify-center gap-x-4
                {size > 14 ? 'gap-y-1 text-2xl' : 'gap-y-3 text-3xl'}"
		>
			<!-- left comparison -->
			<div class="justify-self-end text-right">
				{#each timer.current.leftcps as time, i (i)}
					{#if cps && cps[i]}
						{@const diff = time - cps[i]}
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
				{#each cps as cp, i (i)}
					<div>
						{csToTime(cp * 100)}
					</div>
				{/each}
			</div>

			<!-- right comparison -->
			<div class="justify-self-start text-left">
				{#each timer.current.rightcps as time, i (i)}
					{#if cps && cps[i]}
						{@const diff = time - cps[i]}
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
{/key}
