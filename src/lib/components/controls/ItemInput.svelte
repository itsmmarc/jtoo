<script lang="ts">
	import { items, type Items, type Player, nullPlayer } from '$lib/storage.svelte';
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
				if (item === 'players') {
					return;
				}
				// if (item === 'flags' && value.length !== 2) return; // early return for flags
				(e.target as HTMLInputElement).value = '';
				if (items.current[item].includes(value)) return; // early return for dupes
				items.current[item].push(value);
			}
		}}
	/>
	<button
		class="button-remove"
		onclick={() => {
			if (item === 'players') {
				items.current[item] = [nullPlayer as Player];
			} else {
				items.current[item] = [''];
			}
		}}>remove all</button
	>
</div>
