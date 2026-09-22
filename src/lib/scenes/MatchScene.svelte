<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { settings, overlay, items } from '$lib/storage.svelte';
	import { Player, TFMap } from '$lib/types';
	import { fade, slide } from 'svelte/transition';
	import WebSocketCheckpoints from '$lib/components/match/WebSocketCheckpoints.svelte';
	import WebSocketTimer from '$lib/components/match/WebSocketTimer.svelte';
	import Flag from '$lib/components/util/Flag.svelte';
	import { getContext } from 'svelte';
	import type { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getMap, getPlayer } from '$lib/util';
	import { Steam } from '$lib/api/steam/api-steam';

	let ksnWs: KSNWebSocket = getContext('ksnWs');
</script>

<!-- MARK: top bar -->
<div class="relative z-20 flex h-32 w-full justify-between p-4">
	{#if settings.current.ksnWebSocketToken !== '' && overlay.current.players[0] && overlay.current.players[1]}
		<WebSocketTimer numPlayers={2} />
	{/if}
	{#if settings.current.enableGradient}
		<!-- gradients -->
		{#if settings.current.enableTeamColors}
			<div
				class="absolute top-0 left-0 size-full bg-linear-to-r from-ctp-blue/35 via-black/35 to-ctp-red/35"
			></div>
		{:else}
			<div
				class="absolute top-0 left-0 size-full bg-linear-to-r from-ctp-lavender/35 via-black/35 to-ctp-lavender/35"
				style:filter={getFiltersStyle()}
			></div>
		{/if}
	{:else}
		<!-- transparent black bg -->
		<div class="absolute top-0 left-0 size-full bg-black/35"></div>
	{/if}

	{@render OverlayPlayer(overlay.current.players[0], 0)}
	{@render OverlayPlayer(overlay.current.players[1], 1)}
</div>
<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<!-- MARK: POVs -->
<div
	transition:slide
	class="flex w-full border-b-4 border-ctp-lavender/50"
	style:filter={getFiltersStyle()}
>
	<div
		class="aspect-video w-full
  {settings.current.enablePOVGuide
			? 'border-r-2 border-dashed border-ctp-lavender/50 bg-ctp-lavender/25'
			: ''}"
	></div>
	<div
		class="aspect-video w-full
  {settings.current.enablePOVGuide
			? 'border-l-2 border-dashed border-ctp-lavender/50 bg-ctp-lavender/25'
			: ''}"
	></div>
</div>

<!-- MARK: bottom bar -->
<div class="flex h-16 w-full justify-between" style:filter={getFiltersStyle()}>
	<!-- stage -->
	<div
		class="relative -left-6 flex h-full -skew-x-30 items-center justify-end rounded-br-xl border-r-4 border-b-4 border-ctp-lavender/50 bg-ctp-lavender/25
                {overlay.current.stage === '' ? 'opacity-0' : ''}"
	>
		{#key overlay.current.stage}
			<span in:fade class="relative left-2 skew-x-30 px-8 text-2xl text-ctp-text/75"
				>{overlay.current.stage}</span
			>
		{/key}
	</div>

	{#if settings.current.ksnWebSocketToken !== '' && overlay.current.players[0] && overlay.current.players[1]}
		<WebSocketCheckpoints numPlayers={2} />
	{/if}
	<!-- map -->
	<div
		class="relative -right-6 flex h-full skew-x-30 items-center justify-end rounded-bl-xl border-b-4 border-l-4 border-ctp-lavender/50 bg-ctp-lavender/25
                {overlay.current.map === '' ? 'opacity-0' : ''}"
	>
		{#key overlay.current.stage}
			<span in:fade class="relative right-2 -skew-x-30 px-8 text-3xl text-ctp-text/75"
				>{settings.current.useShortMapNames
					? getMap(overlay.current.map).shortName
					: overlay.current.map}</span
			>
		{/key}
	</div>
</div>
<!-- MARK: map picks -->
<div class="absolute bottom-4 left-4 z-1 flex w-200 flex-wrap gap-4">
	{#if ksnWs.pickedMaps.length > 1}
		{#each ksnWs.pickedMaps as pickedMap, i (i)}
			{@const player = getPlayer(Steam.convertSteamId(pickedMap.steamID3, 'SteamID3') as number)}
			{@const mapId = TFMap.fileNameToTfId(overlay.current.map)}
			{@const isCurrent = pickedMap.mapID == mapId}
			{@const map = () => {
				for (const map of items.current.maps) {
					if (mapId == pickedMap.mapID) {
						return map;
					}
				}
			}}
			{#if map()}
				{@const MAP = map()!}
				<div
					class="@container relative h-32 w-55 border-ctp-lavender-900 text-3xl
                                                {settings.current.monoFont} rounded-2xl
                                                {isCurrent ? 'border-2' : ''}"
				>
					<!-- map name -->
					<h1
						class="absolute top-0 right-0 w-full p-2 text-center {settings.current.font}"
						style:filter={getFiltersStyle()}
					>
						{settings.current.useShortMapNames ? MAP.shortName : MAP.fileName}
					</h1>
					{#if player}
						{#if settings.current.enableAvatars && player.avatarURL}
							{#key player.avatarURL}
								<img
									in:fade
									src={player.avatarURL}
									alt=""
									class="absolute bottom-1 left-1 size-13 rounded-xl object-cover object-center"
									draggable="false"
								/>
							{/key}
						{/if}
					{/if}
					<img
						in:fade
						src={MAP.imageURL}
						alt=""
						class="absolute -z-10 h-full w-full rounded-xl object-cover {isCurrent
							? 'brightness-70'
							: 'brightness-50'}"
						draggable="false"
					/>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<!-- MARK: OverlayPlayer -->
{#snippet OverlayPlayer(steamID3: number | undefined, playerNum: number)}
	{@const player = getPlayer(steamID3)}
	{@const flag = player.flag}
	{@const avatarURL = player.avatarURL}
	{@const tag = player.tag}
	{@const name = player.name}
	{@const playerTimer = steamID3 ? ksnWs.timer.getPlayerTimer(steamID3) : undefined}
	<!-- {@const tempusPR = overlay.current[sideKey].tempusPrs
		? overlay.current[sideKey].tempusPrs[overlay.current.map.shortName]
		: ''} -->
	<div class="relative z-10 flex h-full gap-4 {playerNum === 1 ? 'flex-row-reverse' : ''}">
		<!-- flag -->
		{#if settings.current.enableFlags && flag}
			{#key flag}
				<Flag code={flag} class="flex h-fit w-fit rounded-xl text-[6rem]" />
			{/key}
		{/if}
		{#if settings.current.enableAvatars && avatarURL}
			{#key avatarURL}
				<img
					in:fade
					src={avatarURL}
					alt=""
					class="size-24 rounded-xl object-cover object-center"
					draggable="false"
				/>
			{/key}
		{/if}
		<div
			class="flex flex-col {playerNum === 1 ? 'items-end' : 'items-start'}"
			style:filter={getFiltersStyle()}
		>
			<div class="mb-3 flex gap-2">
				<!-- tag -->
				{#if settings.current.enableTags && tag}
					{#key tag}
						<span in:fade class="text-4xl text-ctp-text/75">{tag}</span>
					{/key}
				{/if}
				<!-- name -->
				{#key name}
					<span in:fade class="text-4xl font-bold">{name}</span>
				{/key}
			</div>
			<!-- score -->
			<div
				class="flex gap-2 text-ctp-text/75
                                {playerNum === 1 ? 'flex-row-reverse' : ''}"
			>
				<!-- {#each { length: overlay.current[sideKey].score }}
					<span
						class="size-8 border-4 border-ctp-text bg-ctp-lavender transition-all duration-1000 starting:border-ctp-text/50 starting:bg-ctp-lavender/0"
					></span>
				{/each} -->
				<!-- {#each { length: (overlay.current.bestOf + 1) / 2 - overlay.current[sideKey].score }}
					<span class="size-8 border-4 border-ctp-text/50"></span>
				{/each} -->
				<!-- PRs -->
				<div
					class="-mt-4 mr-2 ml-2 flex h-16 max-w-55 flex-wrap items-center
                                        {playerNum === 1 ? 'flex-row-reverse' : ''} {settings
						.current.monoFont} "
				>
					{#if settings.current.enablePRs}
						<div class="flex gap-2">
							<span class="text-2xl">pr</span>
							<span class="text-3xl">
								{#if playerTimer}
									{playerTimer.prFormatted}
								{/if}
							</span>
						</div>
					{:else if settings.current.enablePRs && playerTimer && playerTimer.prCs}
						<div class="flex gap-2">
							<span class="text-2xl">pr</span>
							<span class="text-3xl">{playerTimer.prFormatted}</span>
						</div>
					{/if}
					<!-- {#if settings.current.enablePRs && tempusPR && tempusPR.time}
						<div class="flex gap-2">
							<span class="text-xl">tpn pr</span>
							<span class="text-xl">{tempusPR.time}</span>
						</div>
					{/if} -->
				</div>
			</div>
		</div>
	</div>
{/snippet}
