<script lang="ts">
	import { items, overlay } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
</script>

<section>
	{#each Object.entries(items.current.maps) as [key, map], i (i)}
		{#if key !== 'null'}
			{@const left = overlay.current.leftPlayer.pr![key] ?? { rank: 0, time: '' }}
			{@const right = overlay.current.rightPlayer.pr![key] ?? { rank: 0, time: '' }}
			{@const leftWinner = left!.rank > right!.rank}
			<div class="@container relative mb-2 h-37 w-95 text-4xl">
				<h1 class="absolute top-0 right-0 w-full p-2 text-center">{key}</h1>
				<div class="absolute bottom-0 left-0 p-2 {leftWinner ? 'font-black' : 'opacity-75'}">
					{left!.time}
				</div>
				<div
					class="absolute right-0 bottom-0 p-2 text-right {!leftWinner
						? 'font-black'
						: 'opacity-75'}"
				>
					{right!.time}
				</div>
				{#if map.imageURL}
					<img
						in:fade
						src={map.imageURL}
						alt=""
						class="absolute -z-10 h-full w-full rounded-xl object-cover blur-[2px] brightness-70"
						draggable="false"
					/>
				{/if}
			</div>
		{/if}
	{/each}
</section>
