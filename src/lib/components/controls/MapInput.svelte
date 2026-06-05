<script lang="ts">
	import { type Map, items } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';

	function addMap() {
		items.current.maps[map.shortName] = map;
		error = { noFileName: false };
	}

	let isOpen = false;
	let error = { noFileName: false };
	let map: Map = { fileName: '', shortName: '', ID: '' };

	function clearMap() {
		map = { fileName: '', shortName: '', ID: '' };
	}
</script>

<div transition:slide>
	<button
		class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
		onclick={() => {
			clearMap();
			isOpen = true;
		}}>add map</button
	>
	<button
		class="button-remove"
		onclick={() => {
			items.current.maps = { null: { fileName: '', shortName: '' } as Map };
		}}>remove all</button
	>
</div>
{#if isOpen}
	<div
		class="absolute z-50 grid w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<label for="fileName" class="col-span-6">file name</label>
		<input
			class="input col-span-4"
			type="text"
			id="fileName"
			placeholder="*file name"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				map.fileName = value;
			}}
		/>

		<label for="shortName" class="col-span-6">short name</label>
		<input
			class="input col-span-4"
			type="text"
			id="shortName"
			placeholder="*short name"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				map.shortName = value;
			}}
		/>

		<label for="ID" class="col-span-6">ID</label>
		<input
			class="input col-span-4"
			type="text"
			id="ID"
			placeholder="*ID"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				map.ID = value;
			}}
		/>

		{#if map.imageURL}
			<img
				src={map.imageURL}
				alt=""
				class="col-span-2 row-span-3 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
				draggable="false"
			/>
		{/if}

		<label for="imageURL" class="col-span-6">avatar URL</label>
		<input
			class="input col-span-4"
			type="text"
			id="imageURL"
			placeholder="image URL"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				map.imageURL = value;
			}}
		/>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<button
			class="button col-span-6 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			// value=""
			onclick={() => {
				if (map.fileName === '') {
					error.noFileName = true;
					return;
				}
				addMap();
				isOpen = false;
			}}>add map</button
		>

		{#if error.noFileName}
			<div class="col-span-6">error: no file name entered</div>
		{/if}

		<button
			class="button-remove absolute top-0 right-2"
			onclick={() => {
				isOpen = false;
			}}>✖</button
		>
	</div>
{/if}
