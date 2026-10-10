<script lang="ts">
	import { overlay, settings } from '$lib/storage.svelte';
	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { type SteamID3 } from '$lib/types.svelte';
	import { csToFormattedTime } from '$lib/util';
	import { getContext } from 'svelte';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { numPlayers: number; class?: string };
	let { numPlayers, class: styleClass }: Props = $props();
</script>

{#if numPlayers == 2}
	<div
		class="{styleClass} grid h-20 grid-cols-3 items-center justify-center
                {settings.current.monoFont}"
	>
		{@render PlayerStopwatch(overlay.current.players[0])}
		{@render CompetitionTimer()}
		{@render PlayerStopwatch(overlay.current.players[1])}
	</div>
{:else if numPlayers == 1}
	<div
		class="{styleClass} flex h-20 items-center justify-between *:w-fit
                {settings.current.monoFont}"
	>
		{@render PlayerStopwatch(overlay.current.players[0])}
		{@render CompetitionTimer()}
	</div>
{/if}

{#snippet PlayerStopwatch(player: SteamID3 | undefined)}
	{#key ksnWs.timer.players.size}
		{@const playerTimer = player ? ksnWs.timer.getPlayerTimer(player) : undefined}
		{console.log(playerTimer)}
		<div class="text-palewhite flex h-full flex-col justify-start text-center">
			<div class="text-xl opacity-80 {settings.current.font}">run timer</div>
			<div
				class="{settings.current.monoFont} text-5xl transition-colors duration-1000
                                {!playerTimer || !playerTimer.isRunning ? 'opacity-40' : ''}"
			>
				{#if playerTimer && playerTimer.timeFormatted}
					{playerTimer ? playerTimer.timeFormatted : csToFormattedTime(0)}
				{/if}
			</div>
		</div>
	{/key}
{/snippet}

{#snippet CompetitionTimer()}
	<div class="text-palewhite/40 flex h-full flex-col justify-start text-center">
		<div class="text-xl opacity-80 {settings.current.font}">match timer</div>
		{#if ksnWs.timer.competition.timeLeftSeconds > 0}
			<div class="text-5xl">
				{ksnWs.timer.competition.getTimeLeftFormatted('seconds')}
			</div>
		{/if}
		{#if ksnWs.timer.competition.overtimeStatus}
			<div class="text-4xl">OVERTIME</div>
		{/if}
	</div>
{/snippet}
