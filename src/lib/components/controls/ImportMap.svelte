<script lang="ts">
	import PopOver from './PopOver.svelte';
	import { items } from '$lib/storage.svelte';
	import { TFMap } from '$lib/types.svelte';
	import { Tempus2 } from '$lib/api/tempus2/api-tempus2';
	import _ from 'underscore';
	import { TempusPlaza } from '$lib/api/tempusplaza/api-tempusplaza';

	type Error = { state: boolean; msg: string };

	let queryTerm = $state('');
	let searchResults: Tempus2.MapInfo[] = $state([]);
	let fetched = $state(false);
	let map = $state(new TFMap());
	let error = $state({
		invalidMapName: { state: false, msg: 'error: invalid map name' } as Error
	});
	let popoverState: 'open' | 'closed' = $state('closed');

	async function fetchMapByName(mapName: string) {
		error.invalidMapName.state = false;
		fetched = false;
		let result = await Tempus2.fetchMapByName(mapName);
		if (!result) {
			error.invalidMapName.state = true;
			return;
		}
		fetched = true;

		map = result as TFMap;

		await Tempus2.fetchMapPrs(map);
	}

	async function searchMaps(queryTerm: string) {
		fetched = false;
		searchResults = await Tempus2.searchMaps(queryTerm);
	}

	function importMap(map: TFMap) {
		let errorFound = false;

		if (!map.fileName) {
			error.invalidMapName.state = true;
			errorFound = true;
		}

		if (errorFound) {
			return;
		}

		let mapAlreadyExists = false;
		for (let existingMap of items.current.maps) {
			if (existingMap.fileName == map.fileName) {
				existingMap = map;
				mapAlreadyExists = true;
				items.current.maps = [...items.current.maps];
				break;
			}
		}

		if (!mapAlreadyExists) items.current.maps = [...items.current.maps, map];

		console.log('added map:');
		console.log(map);

		popoverState = 'closed';

		if (oncreate) oncreate(map);

		clear();
	}

	async function onSearch(queryTerm: string) {
		fetched = false;
		if (queryTerm) {
			if (queryTerm.includes('_')) {
				await fetchMapByName(queryTerm);
			}
			if (!fetched) {
				searchMaps(queryTerm);
			}
		}
	}

	function clear() {
		map = new TFMap();
		queryTerm = '';
		searchResults = [];
		fetched = false;
	}

	type Props = { container?: boolean; oncreate?: (map: TFMap) => void };
	let { container = true, oncreate }: Props = $props();
</script>

<PopOver title="import map" bind:state={popoverState} clearfn={clear} {container}>
	<section class="grid grid-cols-12 gap-2">
		<form class="col-span-full flex gap-2" onsubmit={() => onSearch(queryTerm)}>
			<label for="map-name" class="col-span-4">search</label>
			<input
				class="remove-arrow input col-span-4"
				type="text"
				id="map-name"
				placeholder="name"
				onkeyup={(e) => {
					queryTerm = (e.target as HTMLInputElement).value;
				}}
			/>
			<button class="button col-span-4 max-w-30 justify-self-center" type="submit">fetch</button>
		</form>

		<hr class="hr" />

		{#if searchResults.length >= 1}
			<div class="col-span-full grid grid-cols-12 gap-2">
				<div class="col-span-3">image</div>
				<div class="col-span-6">name</div>

				<hr class="hr" />

				{#each searchResults as searchResult, i (i)}
					<div class="col-span-3">
						<img
							src={TempusPlaza.getImageUrl(searchResult.name, 'medium')}
							alt=""
							class="size-12 w-full rounded-xl object-cover object-center"
							draggable="false"
						/>
					</div>
					<div class="col-span-6">{searchResult.name}</div>
					<button
						class="button col-span-3"
						onclick={() => {
							fetchMapByName(searchResult.name);
							searchResults = [];
						}}>select</button
					>
				{/each}

				<hr class="hr" />
			</div>
		{/if}

		{#if fetched}
			<label for="file-name" class="col-span-6">file name</label>
			<input
				class="input col-span-4"
				type="text"
				id="file-name"
				placeholder="jump_"
				value={map.fileName}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					map.fileName = value;
				}}
			/>
			<label for="short-name" class="col-span-6">short name</label>
			<input
				class="input col-span-4"
				type="text"
				id="short-name"
				placeholder="name"
				value={map.shortName}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					map.shortName = value;
				}}
			/>

			{#if map.imageURL}
				<img
					src={map.imageURL}
					alt=""
					class="col-span-2 row-span-2 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
					draggable="false"
				/>
			{/if}

			<label for="imageURL" class="col-span-6">image URL</label>
			<input
				class="input col-span-4"
				type="text"
				id="imageURL"
				placeholder="avatar URL"
				value={map.imageURL}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					map.imageURL = value;
				}}
			/>

			<hr class="hr" />

			<button
				class="button col-span-6"
				// value=""
				onclick={() => {
					importMap(map);
				}}>add map</button
			>
		{/if}

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>
	</section>
</PopOver>
