<script lang="ts">
	import { items, overlay } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
</script>

<section>
	{#each Object.entries(items.current.maps) as [key, map], i (i)}
		{#if key !== 'null'}
			{@const left = overlay.current.leftPlayer.pr![key] ?? { rank: 0, time: '' }}
			{@const right = overlay.current.rightPlayer.pr![key] ?? { rank: 0, time: '' }}
			<!-- {@const winner = left!.rank > right!.rank} -->
			<div class="relative mb-2 grid w-65 grid-cols-2 text-2xl">
				<h1 class="col-span-2 col-start-1 row-start-1 p-2 text-center">{key}</h1>
				<div class="col-start-1 row-start-2 p-2">
					rank: {left!.rank}
				</div>
				<div class="col-start-2 row-start-2 p-2 text-right">
					rank: {right!.rank}
				</div>
				<div class="col-start-1 row-start-3 p-2">{left!.time}</div>
				<div class="col-start-2 row-start-3 p-2 text-right">
					{right!.time}
				</div>
				{#if map.imageURL}
					<img
						in:fade
						src={map.imageURL}
						alt=""
						class="-z-10 col-span-2 col-start-1 row-span-3 row-start-1 h-full w-full rounded-xl object-cover blur-[2px] brightness-80"
						draggable="false"
					/>
				{/if}
			</div>
		{/if}
	{/each}
</section>
