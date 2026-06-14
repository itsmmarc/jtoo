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
		type TFClass,
		TFClasses,
		Fonts,
		type Font,
		MonoFonts,
		type MonoFont
	} from '$lib/storage.svelte';
	import { loadSoldierPlayoffs2026, loadDemoPlayoffs2026 } from '$lib/preset-data.svelte';
	import { slide } from 'svelte/transition';
	import * as _ from 'underscore';
	import icon_soldier from '$lib/assets/icon_soldier.png';
	import icon_demo from '$lib/assets/icon_demo.png';
	import {
		clearPicksAndBans,
		clearTimer,
		initializeWebSocket,
		wsState
	} from '$lib/websocket.svelte';

	const fonts: Settings['font'][] = [...Fonts];
	const monoFonts: Settings['monoFont'][] = [...MonoFonts];

	if (settings.current.useWebSocket) {
		initializeWebSocket();
	}
</script>

<span class="self-center">sooft controls</span>

<!-- links -->
<div class="absolute right-4 flex flex-row-reverse gap-1">
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/mkgzr" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/itsmmarc" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<a class="opacity-50 hover:opacity-100" href="https://github.com/itsmmarc/sooft" target="_blank">
		<span class="icon-[mdi--github] size-8 text-white"></span>
	</a>
</div>

<!-- presets -->
<div class="relative m-2 flex w-full max-w-lg justify-center gap-4 self-center">
	<button class="button-remove" onclick={() => fullReset()}>full settings reset</button>
	<button class="hover:mix-blend-soft-light" onclick={() => loadSoldierPlayoffs2026()}>
		<img
			src={icon_soldier}
			class="size-12"
			aria-label="load soldier playoffs 2026"
			alt="load soldier playoffs 2026"
		/>
	</button>
	<button class="hover:mix-blend-soft-light" onclick={() => loadDemoPlayoffs2026()}>
		<img
			src={icon_demo}
			class="size-12"
			aria-label="load soldier playoffs 2026"
			alt="load soldier playoffs 2026"
		/>
	</button>
</div>
<div class="relative m-2 flex w-full max-w-lg justify-center gap-4 self-center">
	<button class="button-remove" onclick={() => clearTimer()}>clear timers and checkpoints</button>
	<button class="button-remove" onclick={() => clearPicksAndBans()}>clear map picks and bans</button
	>
</div>

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
			<div class={font}>
				<Button
					{selected}
					onclick={() => {
						settings.current.font = font as Font;
					}}>{font.replace('font-', '')}</Button
				>
			</div>
		{/each}
	</div>
	<span>mono font</span>
	<div class="flex gap-1">
		{#each monoFonts as font, i (i)}
			{@const selected = font === settings.current.monoFont}
			<div class={font}>
				<Button
					{selected}
					onclick={() => {
						settings.current.monoFont = font as MonoFont;
					}}>{font.replace('font-', '')}</Button
				>
			</div>
		{/each}
	</div>

	<!-- color -->
	<span>theme</span>
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

	<label transition:slide|global>
		<input
			class="peer size-4 accent-ctp-lavender"
			type="checkbox"
			bind:checked={settings.current.useWebSocket}
			onchange={() => initializeWebSocket()}
		/>
		<span class="peer-not-checked:text-ctp-text/50">use WebSocket</span>
	</label>
	{#if settings.current.useWebSocket}
		<div class="flex gap-2">
			<label for="input-websocket">token: </label>
			<input
				type="password"
				class="input w-60"
				id="input-websocket"
				value={settings.current.webSocketToken}
				onchange={(e) => {
					let target = e.target as HTMLInputElement;
					settings.current.webSocketToken = target.value;
				}}
			/>
			<button
				class="button button-unselected hover:button-selected"
				onclick={() => initializeWebSocket()}>connect</button
			>
		</div>
	{/if}
	<div class="flex gap-2">
		<p>status:</p>
		<span
			class={wsState.current.state === 0
				? 'text-yellow-200'
				: wsState.current.state === 1
					? 'text-green-300'
					: wsState.current.state === 2
						? 'text-red-200'
						: wsState.current.state === 3
							? 'text-black'
							: ''}
		>
			{wsState.current.state === 0
				? 'opening...'
				: wsState.current.state === 1
					? 'connected'
					: wsState.current.state === 2
						? 'closing...'
						: wsState.current.state === 3
							? 'closed'
							: ''}
		</span>
		<span class="italic opacity-50">{wsState.current.state}</span>
	</div>

	<Checkbox desc="use moving background" setting="enableMovingBG" />
	<Checkbox desc="use short map names" setting="useShortMapNames" />
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
		{@const bestOfOptions = [1, 3, 5, 7, 9]}
		{#each bestOfOptions as bestOf, i (i)}
			<!-- default bo3 -->
			{@const selected = overlay.current.bestOf === bestOf}
			<button
				class="button w-6
                                        {selected ? 'button-selected' : 'button-unselected'}"
				onclick={() => {
					overlay.current.bestOf = bestOf;
				}}>{bestOf}</button
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

<!-- classes -->
<span>class</span>
<div class="button-container">
	{#each Object.values(TFClasses) as tfClass, i (i)}
		{@const selected = overlay.current.class === tfClass}
		<Button
			{selected}
			onclick={() => {
				overlay.current.class = tfClass as TFClass;
			}}
			oncontextmenu={() => {
				return;
			}}>{tfClass}</Button
		>
	{/each}
</div>

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
