<script lang="ts">
	import PopOver from './PopOver.svelte';
	import { items } from '$lib/storage.svelte';
	import { TFMap } from '$lib/types.svelte';
	import _ from 'underscore';

	type Error = { state: boolean; msg: string };

	type Props = { map: TFMap };
	let { map }: Props = $props();

	let error = $state({
		invalidMapName: { state: false, msg: 'error: invalid map name' } as Error
	});
	let popoverState: 'open' | 'closed' = $state('closed');

	function saveMap(map: TFMap) {
		let errorFound = false;

		if (!map.fileName) {
			error.invalidMapName.state = true;
			errorFound = true;
		}

		if (errorFound) {
			return;
		}

		for (let m of items.current.maps) {
			if (m.mapZoneId == map.mapZoneId) {
				m = { ...map };
				break;
			}
		}

		items.current.maps = [...items.current.maps];
		console.log('saved map:');
		console.log(map);

		popoverState = 'closed';
	}
</script>

<PopOver title="edit map" bind:state={popoverState} container={false}>
	<section class="grid grid-cols-12 gap-2">
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
			id="name"
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
				saveMap(map);
			}}>save map</button
		>

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>
	</section>
</PopOver>
