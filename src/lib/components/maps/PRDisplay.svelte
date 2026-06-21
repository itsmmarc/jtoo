<script lang="ts">
	import { settings, items, overlay, type Map } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { pickedMaps } from '$lib/websocket.svelte';

	function displayMapPick(map: Map, pickedMaps: { mapID: string; steamID3: string }[]) {
		if (pickedMaps.length == 0) {
			return '';
		}

		const playerA = overlay.current.leftPlayer.steamID3;
		const playerB = overlay.current.rightPlayer.steamID3;
		console.log(playerA);
		console.log(playerB);

		let mapIndex: number | null = null;
		for (let i = 0; i < pickedMaps.length; i++) {
			if (pickedMaps[i].mapID == map.ID) {
				mapIndex = i;
				break;
			}
		}
		// console.log(map.shortName);
		// console.log(mapIndex);

		if (!mapIndex) {
			return 'bg-[#250e0e]/40 z-1';
		}

		if (mapIndex) {
			let pickActor: RegExpMatchArray | null | number =
				pickedMaps[mapIndex].steamID3.match('\\d{2,12}');
			if (!pickActor) return '';
			pickActor = parseInt(pickActor[0]);

			return pickActor == playerA
				? 'border-l-ctp-green-400 bg-ctp-green-900/10'
				: pickActor == playerB
					? 'border-r-ctp-green-400 bg-ctp-green-900/10'
					: '';
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
		class="@container relative mb-2 h-32 w-95 text-3xl
                {settings.current.monoFont} rounded-2xl"
	>
		<!-- map picks -->
		<div
			class="absolute top-0 left-[-2px] mt-[-2px] h-[calc(100%+4px)] w-[calc(100%+4px)] rounded-2xl border-4 border-transparent {displayMapPick(
				map,
				pickedMaps.current
			)}"
		></div>
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
