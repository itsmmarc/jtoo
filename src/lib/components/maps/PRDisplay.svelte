<script lang="ts">
	import { settings, items, overlay, type Map } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { pickedMaps } from '$lib/websocket.svelte';

	function displayMapPick(map: Map, pickedMaps: { mapID: string; steamID3: string }[]) {
		const playerA = overlay.current.leftPlayer.steamID3;
		const playerB = overlay.current.rightPlayer.steamID3;
		for (const pick of pickedMaps) {
			if (pick.mapID == map.ID) {
				let pickActor: RegExpMatchArray | null | number = pick.steamID3.match('\\d{2,9}');
				if (!pickActor) continue;
				pickActor = parseInt(pickActor[0]);
				console.log(pick.mapID);
				console.log(playerA);
				console.log(playerB);
				console.log(pickActor);
				let x =
					pickActor == playerA
						? 'border-l-ctp-green-400'
						: pickActor == playerB
							? 'border-r-ctp-green-400'
							: '';
				console.log(x);
				return x;
			}
		}
	}
</script>

<section>
	{#each Object.entries(items.current.maps) as [key, map], i (i)}
		{#if key !== 'null'}
			{@render Map(key, map)}
		{/if}
	{/each}
</section>

{#snippet Map(key: string, map: Map)}
	{@const left = overlay.current.leftPlayer.tempusPrs![key] ?? { rank: 0, time: '' }}
	{@const right = overlay.current.rightPlayer.tempusPrs![key] ?? { rank: 0, time: '' }}
	{@const leftWinner = left!.rank < right!.rank}

	<div
		class="@container relative mb-1 h-32 w-95 text-3xl
                {settings.current.monoFont} rounded-2xl border-4 border-transparent {displayMapPick(
			map,
			pickedMaps.current
		)}"
	>
		<!-- map name -->
		<h1
			class="absolute top-0 right-0 w-full p-2 text-center {settings.current.font}"
			style:filter={getFiltersStyle()}
		>
			{settings.current.useShortMapNames ? key : map.fileName}
		</h1>

		<!-- gradient light -->
		<div
			class="absolute top-0 right-0 h-full w-full rounded-xl {leftWinner
				? 'bg-linear-to-tl'
				: 'bg-linear-to-tr'} from-transparent via-transparent to-[#dfdfdf7e]"
		></div>

		<!-- left time -->
		<div
			class="absolute bottom-0 left-0 p-2 {leftWinner ? 'font-black' : 'opacity-75'}"
			style:filter={getFiltersStyle()}
		>
			{left!.time}
		</div>
		<!-- right time -->
		<div
			class="absolute right-0 bottom-0 p-2 text-right {!leftWinner ? 'font-black' : 'opacity-75'}"
			style:filter={getFiltersStyle()}
		>
			{right!.time}
		</div>

		<!-- map image -->
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
{/snippet}
