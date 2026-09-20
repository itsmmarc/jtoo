<script lang="ts">
	import { settings, items, overlay } from '$lib/storage.svelte';
	import { TFMap, type MapRun } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { getFiltersStyle } from '$lib/filters.svelte';

	function getPlayerFromPickActor(steamID3: string): string | null {
		const playerA = overlay.current.leftPlayer.steamID3;
		const playerB = overlay.current.rightPlayer.steamID3;

		let pickActor: RegExpMatchArray | null | number = steamID3.match('\\d{2,12}');
		if (!pickActor) return null;
		pickActor = parseInt(pickActor[0]);

		return pickActor == playerA ? 'A' : pickActor == playerB ? 'B' : null;
	}

	function displayMapPick(map: TFMap, pickedMaps: { mapID: string; steamID3: string }[]) {
		if (pickedMaps.length == 0) {
			return '';
		}

		let mapIndex: number | null = null;
		for (let i = 0; i < pickedMaps.length; i++) {
			if (pickedMaps[i].mapID == TFMap.fileNameToTfId(map.fileName)) {
				mapIndex = i;
				break;
			}
		}

		if (mapIndex == null || mapIndex < 0) {
			return 'bg-[#250e0e]/40 z-1';
		}

		if (mapIndex != null) {
			let actor = getPlayerFromPickActor(pickedMaps[mapIndex].steamID3);
			return actor == 'A'
				? 'border-l-ctp-green-400 bg-ctp-green-900/10'
				: actor == 'B'
					? 'border-r-ctp-green-400 bg-ctp-green-900/10'
					: '';
		}
	}

	function getPlayerPrs(map: TFMap) {
		console.log(`running player prs for ${map.fileName}-------------`);
		console.log(map.runs.soldier);
		let tfclass: 'soldier' | 'demoman' =
			overlay.current.tournament.info.class == 'demoman' ? 'demoman' : 'soldier';
		let result: { left: MapRun | undefined; right: MapRun | undefined } = {
			left: undefined,
			right: undefined
		};

		for (const run of map.runs[tfclass]) {
			if (run.tempusID == leftPlayer.tempusID) {
				result.left = run;
				console.log(`found left pr for ${map.fileName}`);
			} else if (run.tempusID == rightPlayer.tempusID) {
				result.right = run;
				console.log(`found right pr for ${map.fileName}`);
			}
		}

		return result;
	}

	let leftPlayer = $derived(overlay.current.leftPlayer);
	let rightPlayer = $derived(overlay.current.rightPlayer);
</script>

<section>
	{#each items.current.maps as map, i (i)}
		{#if map.fileName}
			{@render Map(map)}
		{/if}
	{/each}
</section>

{#snippet Map(map: TFMap)}
	{console.log(`snippet run`)}
	{@const prs = getPlayerPrs(map)}
	{#if prs.left && prs.right}
		{@const leftWinner = prs.left.rank < prs.right.rank}
		{console.log(map.fileName)}

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
				{settings.current.useShortMapNames ? map.shortName : map.fileName}
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
				{csToTime(prs.left.duration * 100)}
			</div>
			<!-- right time -->
			<div
				class="absolute right-0 bottom-0 p-2 text-right {!leftWinner ? 'font-black' : 'opacity-75'}"
				style:filter={getFiltersStyle()}
			>
				{csToTime(prs.right.duration * 100)}
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
	{/if}
{/snippet}
