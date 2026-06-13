<script lang="ts">
	import { csToTime, timer } from '$lib/websocket.svelte';
	import { settings } from '$lib/storage.svelte';
	// import { SvelteMap } from 'svelte/reactivity';
	import { slide, fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	let merged = $derived(mergeCheckpoints());
	let size = $derived(merged.size);

	function mergeCheckpoints() {
		const merged = {};

		if (!timer.current.leftcps || !timer.current.rightcps) {
			return merged;
		}

		for (const [checkpoint, time] of Object.entries(timer.current.leftcps)) {
			Object.assign(merged, { [checkpoint]: time });
		}

		for (const [checkpoint, time] of Object.entries(timer.current.rightcps)) {
			if (checkpoint in merged) {
				if (merged[checkpoint] > time) {
					Object.assign(merged, [checkpoint, time]);
				}
			} else {
				Object.assign(merged, [checkpoint, time]);
			}
		}
		return merged;
	}
</script>

<div class="mt-2 flex w-full justify-center {settings.current.monoFont}">
	<div
		class="flex h-83 flex-col flex-wrap items-center gap-x-60 {size > 14
			? 'gap-y-1 text-2xl'
			: 'gap-y-3 text-3xl'}"
	>
		{#if merged}
			{#each Object.entries(merged) as [checkpoint, time], i (i)}
				<div in:slide class="relative flex items-center justify-center">
					{#if checkpoint.includes('Course')}
						<span
							class="border-overlay-orange/70 absolute bottom-1.5 h-full w-90 rounded-lg border-t-3"
							style={getFiltersStyle()}
						></span>
					{/if}
					<span class="flex">{csToTime(time * 100)}</span>
					{#if checkpoint in timer.current.leftcps && checkpoint in timer.current.rightcps}
						{#if timer.current.leftcps[checkpoint] < timer.current.rightcps[checkpoint]}
							<span
								transition:fade|global
								class="bg-tempus-green/60 absolute rounded-lg px-2.5 {size > 14
									? 'right-32 py-0.5 text-xl'
									: 'right-40 py-1 text-2xl'}"
							>
								{(timer.current.leftcps[checkpoint] - timer.current.rightcps[checkpoint]).toFixed(
									1
								)}
							</span>
						{:else}
							<span
								transition:fade|global
								class="bg-tempus-green/60 absolute rounded-lg px-2.5 {size > 14
									? 'left-32 py-0.5 text-xl'
									: 'left-40 py-1 text-2xl'}"
							>
								{(timer.current.rightcps[checkpoint] - timer.current.leftcps[checkpoint]).toFixed(
									1
								)}
							</span>
						{/if}
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
