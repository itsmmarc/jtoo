<script lang="ts">
	import { csToTime, leftCheckpointTimes, rightCheckpointTimes } from '$lib/websocket.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { slide, fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	let merged = $derived(mergeCheckpoints());
	let size = $derived(merged.size);

	function mergeCheckpoints(): SvelteMap<string, number> {
		const merged: SvelteMap<string, number> = new SvelteMap([]);

		for (const [checkpoint, time] of leftCheckpointTimes.entries()) {
			merged.set(checkpoint, time);
		}

		for (const [checkpoint, time] of rightCheckpointTimes.entries()) {
			if (merged.has(checkpoint)) {
				if (merged.get(checkpoint)! > time) {
					merged.set(checkpoint, time);
				}
			} else {
				merged.set(checkpoint, time);
			}
		}
		return merged;
	}
</script>

<div class="mt-2 flex w-full justify-center">
	<div
		class="font-chivomono flex h-83 flex-col flex-wrap items-center gap-x-60 {size > 14
			? 'gap-y-1 text-2xl'
			: 'gap-y-3 text-3xl'}"
	>
		{#each merged.entries() as [checkpoint, time], i (i)}
			<div in:slide class="relative flex items-center justify-center">
				{#if checkpoint.includes('Course')}
					<span
						class="border-overlay-orange/70 absolute bottom-1.5 h-full w-90 rounded-lg border-t-3"
						style={getFiltersStyle()}
					></span>
				{/if}
				<span class="flex">{csToTime(time * 100)}</span>
				{#if leftCheckpointTimes.has(checkpoint) && rightCheckpointTimes.has(checkpoint)}
					{#if leftCheckpointTimes.get(checkpoint)! < rightCheckpointTimes.get(checkpoint)!}
						<span
							transition:fade|global
							class="bg-tempus-green/60 absolute rounded-lg px-2.5 {size > 14
								? 'right-32 py-0.5 text-xl'
								: 'right-40 py-1 text-2xl'}"
						>
							{(
								leftCheckpointTimes.get(checkpoint)! - rightCheckpointTimes.get(checkpoint)!
							).toFixed(1)}
						</span>
					{:else}
						<span
							transition:fade|global
							class="bg-tempus-green/60 absolute rounded-lg px-2.5 {size > 14
								? 'left-32 py-0.5 text-xl'
								: 'left-40 py-1 text-2xl'}"
						>
							{(
								rightCheckpointTimes.get(checkpoint)! - leftCheckpointTimes.get(checkpoint)!
							).toFixed(1)}
						</span>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>
