<script lang="ts">
	import { items, overlay, type Items, type Player } from '$lib/storage.svelte';
	import Button from './Button.svelte';

	type Props = {
		sideKey: 'leftPlayer' | 'rightPlayer';
		key: keyof Player;
		item: keyof Items;
	};

	let { item, sideKey, key }: Props = $props();
</script>

<div class="button-container">
	{#each items.current[item] as value, i (i)}
		{@const selected = (overlay.current[sideKey][key] ?? items.current[item].at(0)) === value}
		<Button
			{selected}
			onclick={() => {
				// @ts-expect-error can index
				overlay.current[sideKey][key] = value;
			}}
			oncontextmenu={() => {
				if (value == '') {
					return;
				}
				// reset if deleting selected
				if (overlay.current[sideKey][key] === value) {
					// @ts-expect-error can index
					overlay.current[sideKey][key] = items.current[item].at(0) ?? '';
				}
				items.current[item].splice(items.current[item].indexOf(value), 1);
			}}
		>
			{#if value == ''}
				✖
			{:else if item === 'flags'}
				<span class="fi fi-{value}"></span>
				<span>{value}</span>
			{:else if item === 'avatarURLs'}
				<img
					src={value}
					alt=""
					class="size-12 object-cover object-center {selected ? '' : 'opacity-35'}"
					draggable="false"
				/>
			{:else}
				{value}
			{/if}
		</Button>
	{/each}
</div>
