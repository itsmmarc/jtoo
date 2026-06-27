<script lang="ts">
	import { csToTime, timer } from '$lib/websocket.svelte';
	import { overlay, settings } from '$lib/storage.svelte';
	import { slide, fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	let leftCps = $derived(timer.current.leftcps);
	let rightCps = $derived(timer.current.rightcps);
	let bestCps = $derived(getBestCheckpoints());
	let bestSideCps = $derived(getBestSideCheckpoints());
	let bestSide: 'left' | 'right' | '' = $derived(getBestSide());
	let size = $derived(timer.current.checkpoints.length);

	function getBestSide() {
		let bestSide: 'left' | 'right' | '';

		if (!timer.current.leftPr && !timer.current.rightPr) {
			bestSide = '';
		} else if (timer.current.leftPr && !timer.current.rightPr) {
			bestSide = 'left';
		} else if (!timer.current.leftPr && timer.current.rightPr) {
			bestSide = 'right';
		} else {
			bestSide = timer.current.leftPr! < timer.current.rightPr! ? 'left' : 'right';
		}

		return bestSide;
	}

	function getBestSideCheckpoints() {
		let bestSideCps: number[] = [];

		if (bestSide) {
			bestSideCps = timer.current[`${bestSide}PrCps`];
		}

		return bestSideCps;
	}

	function getBestCheckpoints() {
		let bestCps: number[] = [];

		for (let i = 0; i < size; i++) {
			if (!leftCps[i] && !rightCps[i]) {
				break;
			} else if (leftCps[i] && !rightCps[i]) {
				bestCps[i] = leftCps[i];
			} else if (!leftCps[i] && rightCps[i]) {
				bestCps[i] = rightCps[i];
			} else {
				bestCps[i] = leftCps[i] < rightCps[i] ? leftCps[i] : rightCps[i];
			}
		}

		return bestCps;
	}
</script>

{#key bestSide}
	{@const cps = bestSide ? bestSideCps : bestCps}
	<div class="absolute right-0 left-0 m-auto mt-2 w-[25%] {settings.current.monoFont}">
		<!-- header -->
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
			<div class="mt-2 h-11">
				<span>
					{bestSide ? csToTime(timer.current[`${bestSide}Pr`]! * 100) : '---'}
				</span>
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

		<!-- cps -->
		<div
			class="grid h-83 grid-cols-3 justify-center gap-x-4 {size > 14
				? 'gap-y-1 text-2xl'
				: 'gap-y-3 text-3xl'}"
		>
			{@render Comparison(cps, 'left')}

			<!-- best pr cps -->
			<div class="justify-self-center text-center">
				{#each cps as cp, i (i)}
					<div>
						{csToTime(cp * 100)}
					</div>
				{/each}
			</div>

			<!-- right comparison -->
			{@render Comparison(cps, 'right')}
		</div>
	</div>
{/key}

{#snippet Comparison(cps: number[], side: 'left' | 'right')}
	<div class={side == 'left' ? 'justify-self-end text-right' : 'justify-self-start text-left'}>
		{#each timer.current[`${side}cps`] as time, i (i)}
			{#if cps && cps[i]}
				{@const diff = time - cps[i]}
				{@const speed: 'faster' | 'same' | 'slower' = diff < 0 ? 'faster' : diff == 0 ? 'same' : diff > 0 ? 'slower' : 'same'}
				{@const clr = {
					faster: side == 'left' ? 'bg-ctp-blue-800/55' : 'bg-ctp-red-800/55',
					slower: side == 'left' ? 'bg-ctp-blue-950/40' : 'bg-ctp-red-950/40',
					same: 'bg-ctp-teal-950/55'
				}}

				<div>
					<span
						transition:fade|global
						class="rounded-lg px-2.5
                                                {speed == 'slower'
							? clr.slower
							: speed == 'faster'
								? clr.faster
								: speed == 'same'
									? clr.same
									: ''}
                                                        {size > 14 ? 'text-xl' : 'text-2xl'}"
					>
						{speed == 'same'
							? '-'
							: speed == 'slower'
								? `+${diff.toFixed(2)}`
								: speed == 'faster'
									? diff.toFixed(2)
									: ''}
					</span>
				</div>
			{/if}
		{/each}
	</div>
{/snippet}
