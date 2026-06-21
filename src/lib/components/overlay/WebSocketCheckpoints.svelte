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

		// console.log(timer.current.checkpoints);
		console.log(timer.current.leftcps);
		console.log(timer.current.rightcps);
		// console.log(merged);
		return merged;
	}
</script>

<div class="absolute right-0 left-0 m-auto mt-2 w-[35%] {settings.current.monoFont}">
	<div
		class="absolute grid h-83 w-full grid-cols-3 justify-evenly
                {size > 14 ? 'gap-y-1 text-2xl' : 'gap-y-3 text-3xl'}"
	>
		<!-- left cps -->
		<div class="w-45 justify-self-end text-right">
			<!-- <div>leftcps</div> -->
			{#each timer.current.leftcps as cp, i (i)}
				<div>
					{csToTime(cp * 100)}
				</div>
			{/each}
		</div>

		<!-- comparison -->
		<div class="w-40 justify-self-center text-center">
			<!-- <div>comparison</div> -->
			{#each merged as time, i (i)}
				<div>
					{#if timer.current.leftcps[i] < timer.current.rightcps[i]}
						<span
							transition:fade|global
							class="rounded-lg bg-ctp-blue-900/50 px-2.5
                                                        {size > 14 ? 'text-xl' : 'text-2xl'}"
						>
							{(timer.current.leftcps[i] - timer.current.rightcps[i]).toFixed(2)}
						</span>
					{:else}
						<span
							transition:fade|global
							class=" rounded-lg bg-ctp-red-900/50 px-2.5
                                                        {size > 14 ? 'text-xl' : 'text-2xl'}"
						>
							{(timer.current.rightcps[i] - timer.current.leftcps[i]).toFixed(2)}
						</span>
					{/if}
				</div>
			{/each}
		</div>

		<!-- right cps -->
		<div class="w-45 justify-self-start text-left">
			<!-- <div>rightcps</div> -->
			{#each timer.current.rightcps as cp, i (i)}
				<div>
					{csToTime(cp * 100)}
				</div>
			{/each}
		</div>
	</div>
</div>
