<script lang="ts">
	import { items } from '$lib/storage.svelte';
	import { TFMap } from '$lib/types.svelte';
	import PopOver from './PopOver.svelte';
	import EditMap from './EditMap.svelte';

	let popoverState: 'open' | 'closed' = $state('closed');

	function deleteMap(map: TFMap) {
		items.current.maps = items.current.maps.filter((m) => m.mapZoneId !== map.mapZoneId);
	}
</script>

<PopOver title="manage maps" bind:state={popoverState}>
	<div class="grid w-full grid-cols-[max-content_1fr_max-content_max-content] items-center gap-x-4">
		{#each items.current.maps as map, i (i)}
			{#if map.fileName}
				<div>
					{#if map.imageURL}
						<img
							src={map.imageURL}
							alt=""
							class="col-span-2 row-span-2 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/if}
				</div>
				<div>{map.fileName}</div>
				<div><EditMap {map} /></div>
				<div><button class="button-remove" onclick={() => deleteMap(map)}>delete</button></div>
			{/if}
		{/each}
	</div>
</PopOver>
