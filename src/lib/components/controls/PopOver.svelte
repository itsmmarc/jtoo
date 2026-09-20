<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		children: Snippet;
		state: 'open' | 'closed';
		container?: boolean;
		clearfn?: Function;
		onopen?: Function;
	};

	let {
		title,
		children,
		state = $bindable('closed'),
		container = true,
		clearfn,
		onopen
	}: Props = $props();
</script>

<section class={container ? 'relative' : ''}>
	<button
		class="button"
		onclick={() => {
			state = 'open';
			if (onopen) onopen();
		}}>{title}</button
	>
</section>
{#if state == 'open'}
	<section class="absolute top-0 right-0 left-0 z-50 h-fit w-full border-2 bg-obs-content p-2">
		<button
			class="button-remove absolute top-0 right-2"
			onclick={() => {
				state = 'closed';
				if (clearfn) clearfn();
			}}>✖</button
		>
		<h1 class="text-center text-2xl">{title}</h1>
		<hr class="hr" />
		{@render children()}
	</section>
{/if}
{#if state == 'open'}
	<button
		class="fixed top-0 left-0 z-1 h-full w-full"
		onclick={() => {
			state = 'closed';
			if (clearfn) clearfn();
		}}
		aria-label="popover backdrop"
		><div class="h-full w-full bg-black/20 backdrop-blur-md"></div></button
	>
{/if}
