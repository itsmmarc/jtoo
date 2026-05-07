<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		title: string;
		children: Snippet;
	};

	let { title, children }: Props = $props();

	let show: boolean = $state(true);
</script>

<div class="relative w-full max-w-lg self-center">
	<button
		class="w-full text-left"
		onclick={() => {
			show = !show;
		}}
	>
		<span class="align-middle {show ? 'icon-[mdi--chevron-down]' : 'icon-[mdi--chevron-right]'}"
		></span>
		<span>{title}</span></button
	>
	{#if show}
		<div class="mb-2 flex flex-col gap-1" transition:slide>
			{@render children()}
		</div>
	{/if}
	<hr class="mb-0.5 h-0.5 w-full border-none bg-obs-padding" />
</div>
