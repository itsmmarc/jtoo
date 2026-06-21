<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { settings, overlay, items, type Player } from '$lib/storage.svelte';
	import { fade, slide } from 'svelte/transition';
	import WebSocketCheckpoints from '$lib/components/overlay/WebSocketCheckpoints.svelte';
	import WebSocketTimer from '$lib/components/overlay/WebSocketTimer.svelte';
	import { pickedMaps, timer } from '$lib/websocket.svelte';
	import { csToTime } from '$lib/websocket.svelte';

	function getPlayerFromPickActor(steamID3: string): Player | null {
		const playerA = overlay.current.leftPlayer.steamID3;
		const playerB = overlay.current.rightPlayer.steamID3;

		let pickActor: RegExpMatchArray | null | number = steamID3.match('\\d{2,9}');
		if (!pickActor) return null;
		pickActor = parseInt(pickActor[0]);

		return pickActor == playerA
			? overlay.current.leftPlayer
			: pickActor == playerB
				? overlay.current.rightPlayer
				: null;
	}
</script>

<!-- MARK: top bar -->
<div class="relative z-20 flex h-32 w-full justify-between p-4">
	{#if settings.current.useWebSocket && settings.current.webSocketToken !== '' && overlay.current.leftPlayer.steamID3 && overlay.current.rightPlayer.steamID3}
		<WebSocketTimer />
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

	{@render OverlayPlayer('leftPlayer')}
	{@render OverlayPlayer('rightPlayer')}
</div>
<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<!-- MARK: POVs -->
{#if !settings.current.enableSinglePOV}
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
{/if}

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

	{#if settings.current.useWebSocket && settings.current.webSocketToken !== '' && overlay.current.leftPlayer.steamID3 && overlay.current.rightPlayer.steamID3}
		<WebSocketCheckpoints />
	{/if}
	<!-- map -->
	<div
		class="relative -right-6 flex h-full skew-x-30 items-center justify-end rounded-bl-xl border-b-4 border-l-4 border-ctp-lavender/50 bg-ctp-lavender/25
                {overlay.current.map.shortName === '' ? 'opacity-0' : ''}"
	>
		{#key overlay.current.stage}
			<span in:fade class="relative right-2 -skew-x-30 px-8 text-3xl text-ctp-text/75"
				>{settings.current.useShortMapNames
					? overlay.current.map.shortName
					: overlay.current.map.fileName}</span
			>
		{/key}
	</div>
</div>
<!-- MARK: map picks -->
<div class="absolute bottom-4 left-4 flex gap-4">
	{#if pickedMaps.current.length > 1}
		{#each pickedMaps.current as pickedMap, i (i)}
			{@const player = getPlayerFromPickActor(pickedMap.steamID3)}
			{@const map = () => {
				for (const [key, map] of Object.entries(items.current.maps)) {
					if (map.ID == pickedMap.mapID) {
						return map;
					}
				}
			}}
			{#if map()}
				{@const MAP = map()!}
				<div
					class="@container relative h-32 w-55 text-3xl
                                                {settings.current.monoFont} rounded-2xl"
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
						class="absolute -z-10 h-full w-full rounded-xl object-cover brightness-50"
						draggable="false"
					/>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<!-- MARK: OverlayPlayer -->
{#snippet OverlayPlayer(sideKey: 'leftPlayer' | 'rightPlayer')}
	{@const flag = overlay.current[sideKey].flag}
	{@const avatarURL = overlay.current[sideKey].avatarURL}
	{@const tag = overlay.current[sideKey].tag}
	{@const name = overlay.current[sideKey].name}
	{@const tempusPR = overlay.current[sideKey].tempusPrs
		? overlay.current[sideKey].tempusPrs[overlay.current.map.shortName]
		: ''}
	<div
		class="relative z-10 flex h-full gap-4 {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}"
	>
		<!-- flag -->
		{#if settings.current.enableFlags && flag}
			{#key flag}
				<span in:fade class="fi fi-{flag} flex h-fit w-fit rounded-xl text-[6rem]"></span>
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
			class="flex flex-col {sideKey === 'rightPlayer' ? 'items-end' : 'items-start'}"
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
                                {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}"
			>
				{#each { length: overlay.current[sideKey].score }}
					<span
						class="size-8 border-4 border-ctp-text bg-ctp-lavender transition-all duration-1000 starting:border-ctp-text/50 starting:bg-ctp-lavender/0"
					></span>
				{/each}
				{#each { length: (overlay.current.bestOf + 1) / 2 - overlay.current[sideKey].score }}
					<span class="size-8 border-4 border-ctp-text/50"></span>
				{/each}
				<!-- PRs -->
				<div
					class="mr-2 ml-2 flex max-w-55 flex-wrap {sideKey === 'rightPlayer'
						? 'flex-row-reverse'
						: ''} {settings.current.monoFont} -mt-3"
				>
					{#if settings.current.enablePRs && settings.current.useWebSocket}
						<div class="flex gap-2">
							<span class="text-2xl">pr</span>
							<span class="text-3xl"
								>{sideKey == 'leftPlayer'
									? csToTime(Math.trunc(timer.current.leftPr! * 100))
									: sideKey == 'rightPlayer'
										? csToTime(Math.trunc(timer.current.rightPr! * 100))
										: ''}</span
							>
						</div>
					{:else if settings.current.enablePRs && overlay.current[sideKey].pr !== ''}
						<div class="flex gap-2">
							<span class="text-2xl">pr</span>
							<span class="text-3xl">{overlay.current[sideKey].pr}</span>
						</div>
					{/if}
					{#if settings.current.enablePRs && tempusPR}
						<div class="flex gap-2">
							<span class="text-xl">tpn pr</span>
							<span class="text-xl">{tempusPR.time}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/snippet}
