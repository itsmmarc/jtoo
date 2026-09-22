<script lang="ts">
	import kofi_symbol from '$lib/assets/kofi_symbol.svg';

	import Accordion from '$lib/components/controls/Accordion.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import ItemInput from '$lib/components/controls/ItemInput.svelte';
	import RangeInput from '$lib/components/controls/RangeInput.svelte';
	import RadioInputs from '$lib/components/controls/RadioInputs.svelte';
	import Importplayer from '$lib/components/controls/ImportPlayer.svelte';
	import ImportMap from '$lib/components/controls/ImportMap.svelte';
	import ManagePlayers from '$lib/components/controls/ManagePlayers.svelte';
	import ManageMaps from '$lib/components/controls/ManageMaps.svelte';
	import AddTournament from '$lib/components/controls/AddTournament.svelte';

	import PlayerControl from '$lib/components/controls/PlayerControl.svelte';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { settings, overlay, items, defaultStages, defaultSettings } from '$lib/storage.svelte';
	import { Fonts, MonoFonts, OverlayScenes } from '$lib/types';
	import * as _ from 'underscore';

	import { obsConnect, setScene } from '$lib/websockets/obs/ws-obs';
	import ManageTournaments from '$lib/components/controls/ManageTournaments.svelte';

	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getMap } from '$lib/util';

	let ksnWs = $state(new KSNWebSocket());
	if (settings.current.ksnWebSocketToken) {
		ksnWs.connect(settings.current.ksnWebSocketToken);
	}

	$effect(() => {
		if (settings.current.overlayScene) {
			setScene(settings.current.overlayScene);
		}
	});

	if (settings.current.ksnWebSocketToken) {
		ksnWs.connect(settings.current.ksnWebSocketToken);
	}
</script>

<span class="self-center">jtoo controls</span>

<!-- links -->
<div class="absolute right-4 flex flex-row-reverse gap-1">
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/mkgzr" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/itsmmarc" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<a class="opacity-50 hover:opacity-100" href="https://github.com/itsmmarc/jtoo" target="_blank">
		<span class="icon-[mdi--github] size-8 text-white"></span>
	</a>
</div>

<!-- presets -->
<div class="relative m-2 flex w-full max-w-lg justify-center gap-4 self-center">
	<button class="button-remove" onclick={() => ksnWs.clearTimers()}
		>clear timers and checkpoints</button
	>
	<button class="button-remove" onclick={() => ksnWs.clearPicksAndBans()}
		>clear map picks and bans</button
	>
</div>

<!-- items -->
<Accordion title="items">
	<div class="grid w-full grid-cols-2">
		<Importplayer />
		<ManagePlayers />
		<ImportMap />
		<ManageMaps />
		<AddTournament />
		<ManageTournaments />
	</div>

	<ItemInput placeholder="add stage" item="stages" />
</Accordion>

<Accordion title="scenes">
	<span>scene</span>
	<RadioInputs opts={[...OverlayScenes]} bind:value={settings.current.overlayScene} />
	<span>tournament</span>
	<RadioInputs
		opts={[...items.current.tournaments]}
		labelkey={['info', 'name']}
		bind:value={overlay.current.tournament}
	/>
</Accordion>

<Accordion title="connections">
	<section class="ml-5 w-[calc(100%-1.25rem)]">
		<Accordion title="obs websocket" defaultstate="closed">
			<div class="flex flex-wrap gap-2">
				<label for="input-websocket-obs">ip: </label>
				<input
					type="text"
					class="input"
					id="input-websocket-obs"
					placeholder="ws://localhost:4455"
					value={settings.current.obsWsIp}
					onchange={(e) => {
						let target = e.target as HTMLInputElement;
						settings.current.obsWsIp = target.value;
					}}
				/>
				<label for="input-websocket-obs">password: </label>
				<input
					type="password"
					class="input w-40"
					id="input-websocket-obs"
					value={settings.current.obsWsPw}
					onchange={(e) => {
						let target = e.target as HTMLInputElement;
						settings.current.obsWsPw = target.value;
					}}
				/>
				<button
					class="button button-unselected hover:button-selected"
					onclick={() => obsConnect(settings.current.obsWsIp, settings.current.obsWsPw)}
					>connect</button
				>
			</div>
		</Accordion>
		<Accordion title="ksn server websocket" defaultstate="closed">
			<div class="flex gap-2">
				<label for="input-websocket">token: </label>
				<input
					type="password"
					class="input w-60"
					id="input-websocket"
					value={settings.current.ksnWebSocketToken}
					onchange={(e) => {
						let target = e.target as HTMLInputElement;
						settings.current.ksnWebSocketToken = target.value;
					}}
				/>
				<button
					class="button button-unselected hover:button-selected"
					onclick={() => ksnWs.connect(settings.current.ksnWebSocketToken)}>connect</button
				>
				<!-- <div class="flex gap-2">
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
                                </div> -->
			</div>
		</Accordion>
	</section>
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
	<RadioInputs opts={[...Fonts]} bind:value={settings.current.font} />
	<span>mono font</span>
	<RadioInputs opts={[...MonoFonts]} bind:value={settings.current.monoFont} />

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

	<hr class="hr" />

	<Checkbox desc="use moving background" setting="enableMovingBG" />
	<Checkbox desc="use short map names" setting="useShortMapNames" />
	<Checkbox desc="show POV guide" setting="enablePOVGuide" />
	<Checkbox desc="use gradient" setting="enableGradient" />
	{#if settings.current.enableGradient}
		<Checkbox desc="use red & blue team colors" setting="enableTeamColors" />
	{/if}
	<Checkbox desc="use player PRs" setting="enablePRs" />
	<Checkbox desc="use avatars" setting="enableAvatars" />
	<Checkbox desc="use tags" setting="enableTags" />
</Accordion>

<!-- overlay -->
<div class="relative mb-2 flex w-full max-w-lg justify-center gap-1 self-center">
	<span class="absolute left-0">best of</span>
	<RadioInputs opts={[1, 3, 5, 7, 9]} bind:value={overlay.current.bestOf} log={true} />
</div>

<!-- players -->
<div class="flex w-full max-w-lg justify-evenly self-center">
	<PlayerControl player={overlay.current.players[0]} playerNum={0} />
	<hr class="hr" />
	<PlayerControl player={overlay.current.players[1]} playerNum={1} />
	<hr class="hr" />
	<PlayerControl player={overlay.current.players[2]} playerNum={2} />
	<hr class="hr" />
	<PlayerControl player={overlay.current.players[3]} playerNum={3} />
</div>

<div class="max-w-lg self-center">
	<!-- maps -->

	<span>map</span>
	<RadioInputs
		opts={overlay.current.tournament.maps}
		optlabels={settings.current.useShortMapNames
			? overlay.current.tournament.maps.map((m) => getMap(m).shortName)
			: undefined}
		bind:value={overlay.current.map}
	/>

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
	<RadioInputs opts={[...items.current.stages]} bind:value={overlay.current.stage} />
</div>
