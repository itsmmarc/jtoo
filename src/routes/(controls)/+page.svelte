<script lang="ts">
	import Accordion from '$lib/components/controls/Accordion.svelte';
	import Button from '$lib/components/controls/Button.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import ItemInput from '$lib/components/controls/ItemInput.svelte';
	import Player from '$lib/components/controls/Player.svelte';
	import RangeInput from '$lib/components/controls/RangeInput.svelte';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { settings, overlay, items, type Settings, defaultStages } from '$lib/storage.svelte';

	const fonts: Settings['font'][] = ['sans-serif', 'courier-prime'];
</script>

<span class="self-center">sooft controls</span>

<!-- items -->
<Accordion title="items">
	<ItemInput placeholder="add name" item="names" />
	{#if settings.current.enableAvatars}
		<ItemInput placeholder="add avatar URL" item="avatarURLs" />
	{/if}
	{#if settings.current.enableTags}
		<ItemInput placeholder="add tag" item="tags" />
	{/if}
	{#if settings.current.enableFlags}
		<ItemInput placeholder="add flag" item="flags" />
	{/if}
	<ItemInput placeholder="add map" item="maps" />
	<ItemInput placeholder="add stage" item="stages" />
</Accordion>

<!-- settings -->
<Accordion title="settings">
	<span>font</span>
	<div class="flex gap-1">
		{#each fonts as font, i (i)}
			{@const selected = font === settings.current.font}
			<div class="font-{font}">
				<Button
					{selected}
					onclick={() => {
						settings.current.font = font as Settings['font'];
					}}>{font}</Button
				>
			</div>
		{/each}
	</div>

	<!-- color -->
	<div class="flex gap-2">
		<div
			class="size-12 border-4 border-ctp-text bg-ctp-lavender"
			style:filter={getFiltersStyle()}
		></div>
		<div class="flex flex-col justify-evenly">
			<RangeInput setting="hue" max={360} />
			<RangeInput setting="saturation" max={200} />
		</div>
	</div>

	<Checkbox desc="show POV guide" setting="enablePOVGuide" />
	<Checkbox desc="use single POV" setting="enableSinglePOV" />
	<Checkbox desc="use team colors" setting="enableTeamColors" />
	<Checkbox desc="use player PRs" setting="enablePRs" />
	<Checkbox desc="use avatars" setting="enableAvatars" />
	<Checkbox desc="use tags" setting="enableTags" />
</Accordion>

<!-- overlay -->
<div class="relative flex w-full max-w-lg justify-center gap-1 self-center">
	<span class="absolute left-0">best of</span>
	{#key overlay.current.bestOf}
		{#each { length: 5 }, bestOf}
			<!-- default bo3 -->
			{@const selected = ((overlay.current.bestOf ?? 1) - 1) / 2 === bestOf}
			<button
				class="button w-6
    {selected ? 'button-selected' : 'button-unselected'}"
				onclick={() => {
					overlay.current.bestOf = bestOf * 2 + 1;
				}}>{bestOf * 2 + 1}</button
			>
		{/each}
	{/key}
</div>

<!-- players -->
<div class="flex w-full justify-evenly">
	<Player side="left" />
	<hr class="mx-2 mb-2 h-32 w-1 self-end border-none bg-obs-padding" />
	<Player side="right" />
</div>

<!-- maps -->
<span>map</span>
{#if items.current.maps.length === 0}
	<span class="text-ctp-text/50">no maps..</span>
{:else}
	<div class="button-container">
		{#each items.current.maps as map, i (i)}
			{@const selected = (overlay.current.map ?? items.current.maps.at(0)) === map}
			<Button
				{selected}
				onclick={() => {
					overlay.current.map = map;
				}}
				oncontextmenu={() => {
					// reset if deleting selected
					if (overlay.current.map === map) {
						overlay.current.map = items.current.maps.at(0) ?? '';
					}
					items.current.maps.splice(items.current.maps.indexOf(map), 1);
				}}>{map}</Button
			>
		{/each}
	</div>
{/if}

<!-- stages -->
<div class="flex justify-between">
	<span>stage</span>
	<button
		class="button-remove"
		onclick={() => {
			items.current.stages = defaultStages;
		}}>reset to default</button
	>
</div>
{#if items.current.stages.length === 0}
	<span class="text-ctp-text/50">no stages..</span>
{:else}
	<div class="button-container">
		{#each items.current.stages as stage, i (i)}
			{@const selected = (overlay.current.stage ?? items.current.stages.at(0)) === stage}
			<Button
				{selected}
				onclick={() => {
					overlay.current.stage = stage;
				}}
				oncontextmenu={() => {
					// reset if deleting selected
					if (overlay.current.stage === stage) {
						overlay.current.stage = items.current.stages.at(0) ?? '';
					}
					items.current.stages.splice(items.current.stages.indexOf(stage), 1);
				}}>{stage}</Button
			>
		{/each}
	</div>
{/if}
