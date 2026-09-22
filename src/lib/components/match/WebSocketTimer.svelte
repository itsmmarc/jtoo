<script lang="ts">
	import { overlay, settings } from '$lib/storage.svelte';
	import type { SteamID3 } from '$lib/types';
	import { csToTime } from '$lib/util';
	import type { KSNWebSocket, PlayerTimer } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getContext } from 'svelte';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { numPlayers: number };
	let { numPlayers }: Props = $props();
	let competitionTimer = $derived(ksnWs.timer.competition);
</script>

{#if numPlayers == 2}
	<div
		class="absolute left-0 flex h-32 w-full items-center justify-center gap-60
                {settings.current.monoFont}"
	>
		{@render PlayerStopwatch(overlay.current.players[0])}
		{@render CompetitionTimer()}
		{@render PlayerStopwatch(overlay.current.players[1])}
	</div>
{/if}

{#snippet PlayerStopwatch(player: SteamID3 | undefined)}
	{#key ksnWs.timer.players.size}
		{@const playerTimer = player ? ksnWs.timer.getPlayerTimer(player) : undefined}
		{console.log('rerendering player stopwatch')}
		{console.log(playerTimer)}
		<span
			class="text-palewhite font-chivomono text-center text-5xl transition-colors duration-1000
                                {!playerTimer || (playerTimer && !playerTimer.isRunning)
				? 'opacity-40'
				: ''}"
		>
			{#if playerTimer && playerTimer.timeFormatted}
				{playerTimer ? playerTimer.timeFormatted : csToTime(0)}
			{/if}
		</span>
	{/key}
{/snippet}

{#snippet CompetitionTimer()}
	<div class="absolute top-5 flex flex-col">
		{#if competitionTimer.timeLeftSeconds > 0}
			<div class="text-palewhite/40 text-center text-5xl">
				{competitionTimer.getTimeLeftFormatted('seconds')}
			</div>
		{/if}
		{#if competitionTimer.overtimeStatus}
			<div class="text-palewhite/40 text-center text-4xl">OVERTIME</div>
		{/if}
	</div>
{/snippet}
