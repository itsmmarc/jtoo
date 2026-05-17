<script lang="ts">
	import kofi_symbol from '$lib/assets/kofi_symbol.svg';
	import Accordion from '$lib/components/controls/Accordion.svelte';
	import Button from '$lib/components/controls/Button.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import ItemInput from '$lib/components/controls/ItemInput.svelte';
	import Player from '$lib/components/controls/Player.svelte';
	import PlayerInput from '$lib/components/controls/PlayerInput.svelte';
	import MapInput from '$lib/components/controls/MapInput.svelte';
	import RangeInput from '$lib/components/controls/RangeInput.svelte';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import {
		settings,
		overlay,
		items,
		type Settings,
		defaultStages,
		defaultSettings,
		fullReset,
		loadSoldierPlayoffs2026
	} from '$lib/storage.svelte';
	import * as _ from 'underscore';

	const fonts: Settings['font'][] = ['cause', 'comic-relief', 'courier-prime', 'fredoka', 'inter'];

	/* font safelist
font-cause
font-comic-relief
font-courier-prime
font-fredoka
font-inter
*/
	fullReset();
</script>

<span class="self-center">sooft controls</span>

<!-- links -->
<div class="absolute right-4 flex flex-row-reverse gap-1">
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/mkgzr" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<a class="opacity-50 hover:opacity-100" href="https://github.com/spiritov/sooft" target="_blank">
		<span class="icon-[mdi--github] size-8 text-white"></span>
	</a>
</div>

<button class="absolute top-4 left-4 hover:text-red-500" onclick={() => fullReset()}
	>FULL RESET</button
>
<button
	class="absolute top-12 left-4 w-1 hover:text-red-500"
	onclick={() => loadSoldierPlayoffs2026()}>LOAD SOLDIER PLAYOFFS 2026</button
>

<!-- items -->
<Accordion title="items">
	<PlayerInput />
	<MapInput />
	<ItemInput placeholder="add stage" item="stages" />
</Accordion>

<!-- settings -->
<Accordion title="settings">
	<button
		class="button-remove absolute top-0 right-0"
		onclick={() => {
			settings.current = defaultSettings;
		}}>reset to default</button
	>
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
	<span
		>theme <span class="text-ctp-text/50">(arrow keys can be used for small adjustments)</span
		></span
	>
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

	<hr class="mb-0.5 h-0.5 w-full border-none bg-obs-padding" />

	<Checkbox desc="use moving background" setting="enableMovingBG" />
	<Checkbox desc="use single POV" setting="enableSinglePOV" />
	{#if !settings.current.enableSinglePOV}
		<Checkbox desc="show POV guide" setting="enablePOVGuide" />
		<Checkbox desc="use gradient" setting="enableGradient" />
		{#if settings.current.enableGradient}
			<Checkbox desc="use red & blue team colors" setting="enableTeamColors" />
		{/if}
	{/if}
	<Checkbox desc="use player PRs" setting="enablePRs" />
	<Checkbox desc="use avatars" setting="enableAvatars" />
	<Checkbox desc="use tags" setting="enableTags" />
</Accordion>

<!-- overlay -->
<div class="relative mb-2 flex w-full max-w-lg justify-center gap-1 self-center">
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
<div class="button-container">
	{#each Object.entries(items.current.maps) as [key, map], i (i)}
		{@const selected = overlay.current.map.shortName === map.shortName}
		<Button
			{selected}
			onclick={() => {
				overlay.current.map = map;
			}}
			oncontextmenu={() => {
				if (map.fileName == '') {
					return;
				}
				// reset if deleting selected
				if (overlay.current.map.fileName === map.fileName) {
					overlay.current.map = items.current.maps['null'];
				}
				items.current.maps = _.omit(items.current.maps, key);
			}}>{map.shortName === '' ? '✖' : map.shortName}</Button
		>
	{/each}
</div>
<!-- {#if items.current.maps.length === 1}
	<span class="text-ctp-text/50">no maps..</span>
{/if} -->

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
<div class="button-container">
	{#each items.current.stages as stage, i (i)}
		{@const selected = (overlay.current.stage ?? items.current.stages.at(0)) === stage}
		<Button
			{selected}
			onclick={() => {
				overlay.current.stage = stage;
			}}
			oncontextmenu={() => {
				if (stage == '') {
					return;
				}
				// reset if deleting selected
				if (overlay.current.stage === stage) {
					overlay.current.stage = items.current.stages.at(0) ?? '';
				}
				items.current.stages.splice(items.current.stages.indexOf(stage), 1);
			}}>{stage == '' ? '✖' : stage}</Button
		>
	{/each}
</div>
<!-- {#if items.current.stages.length === 1}
	<span class="text-ctp-text/50">no stages..</span>
{/if} -->
