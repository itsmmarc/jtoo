<script lang="ts">
	import { csToTime, timer } from '$lib/websocket.svelte';
	import { settings } from '$lib/storage.svelte';
	import { slide, fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	let merged = $derived(mergeCheckpoints());
	let size = $derived(merged.length);

	function mergeCheckpoints() {
		const merged: number[] = [];

		if (
			timer.current.leftcps.length == 0 ||
			timer.current.rightcps.length == 0 ||
			timer.current.checkpoints.length == 0
		) {
			return merged;
		}

		let size = Math.min(
			timer.current.leftcps.length,
			timer.current.rightcps.length,
			timer.current.checkpoints.length
		);

		for (let i = 0; i < size; i++) {
			if (timer.current.leftcps[i] > timer.current.rightcps[i]) {
				merged.push(timer.current.leftcps[i]);
			} else {
				merged.push(timer.current.rightcps[i]);
			}
		}

		console.log(timer.current.checkpoints);
		console.log(timer.current.leftcps);
		console.log(timer.current.rightcps);
		console.log(merged);
		return merged;
	}
</script>

<div class="mt-2 flex w-full justify-center {settings.current.monoFont}">
	<div
		class="flex h-83 flex-col flex-wrap items-center gap-x-60 {size > 14
			? 'gap-y-1 text-2xl'
			: 'gap-y-3 text-3xl'}"
	>
		{#each merged as time, i (i)}
			<div in:slide class="relative flex items-center justify-center">
				{#if timer.current.checkpoints[i].includes('Course')}
					<span
						class="border-overlay-orange/70 absolute bottom-1.5 h-full w-90 rounded-lg border-t-3"
						style={getFiltersStyle()}
					></span>
				{/if}
				<span class="flex">{csToTime(time * 100)}</span>
				{#if timer.current.leftcps[i] < timer.current.rightcps[i]}
					<span
						transition:fade|global
						class="absolute rounded-lg bg-[#25ff75]/50 px-2.5 {size > 14
							? 'right-32 py-0.5 text-xl'
							: 'right-40 py-1 text-2xl'}"
					>
						{(timer.current.leftcps[i] - timer.current.rightcps[i]).toFixed(1)}
					</span>
				{:else}
					<span
						transition:fade|global
						class="absolute rounded-lg bg-[#25ff75]/50 px-2.5 {size > 14
							? 'left-32 py-0.5 text-xl'
							: 'left-40 py-1 text-2xl'}"
					>
						{(timer.current.rightcps[i] - timer.current.leftcps[i]).toFixed(1)}
					</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
