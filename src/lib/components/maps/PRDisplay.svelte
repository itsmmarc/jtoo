<script lang="ts">
	import { settings, items, overlay } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';
</script>

<section>
	{#each Object.entries(items.current.maps) as [key, map], i (i)}
		{#if key !== 'null'}
			{@const left = overlay.current.leftPlayer.tempusPrs![key] ?? { rank: 0, time: '' }}
			{@const right = overlay.current.rightPlayer.tempusPrs![key] ?? { rank: 0, time: '' }}
			{@const leftWinner = left!.rank < right!.rank}
			<div class="@container relative mb-2 h-32 w-95 text-3xl {settings.current.monoFont}">
				<h1 class="absolute top-0 right-0 w-full p-2 text-center" style:filter={getFiltersStyle()}>
					{key}
				</h1>
				<div
					class="absolute top-0 right-0 h-full w-full rounded-xl {leftWinner
						? 'bg-linear-to-tl'
						: 'bg-linear-to-tr'} from-transparent via-transparent to-[#dfdfdf7e]"
				></div>
				<div
					class="absolute bottom-0 left-0 p-2 {leftWinner ? 'font-black' : 'opacity-75'}"
					style:filter={getFiltersStyle()}
				>
					{left!.time}
				</div>
				<div
					class="absolute right-0 bottom-0 p-2 text-right {!leftWinner
						? 'font-black'
						: 'opacity-75'}"
					style:filter={getFiltersStyle()}
				>
					{right!.time}
				</div>
				{#if map.imageURL}
					<img
						in:fade
						src={map.imageURL}
						alt=""
						class="absolute -z-10 h-full w-full rounded-xl object-cover blur-[2px] brightness-50"
						draggable="false"
					/>
				{/if}
			</div>
		{/if}
	{/each}
</section>
