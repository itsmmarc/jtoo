<script lang="ts">
	import { items, type Items } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		placeholder: string;
		item: keyof Items;
	};

	let { placeholder, item }: Props = $props();
</script>

<div transition:slide>
	<input
		class="input"
		{placeholder}
		onkeypress={(e) => {
			if (e.key === 'Enter') {
				const value = (e.target as HTMLInputElement).value;

				if (item === 'flags' && value.length !== 2) return; // early return for flags
				(e.target as HTMLInputElement).value = '';
				if (items.current[item].includes(value)) return; // early return for dupes
				items.current[item].push(value);
			}
		}}
	/>
	<button
		class="button-remove"
		onclick={() => {
			items.current[item] = [''];
		}}>remove all</button
	>
	{#if item === 'flags'}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a href="https://flagicons.lipis.dev/" target="_blank"
			><span class="icon-[mdi--question-mark]"></span></a
		>
	{/if}
</div>
