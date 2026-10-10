<script lang="ts">
	import { overlay, settings } from '$lib/storage.svelte';
	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { type SteamID3 } from '$lib/types.svelte';
	import { csToFormattedTime } from '$lib/util';
	import { getContext } from 'svelte';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { numPlayers: number };
	let { numPlayers }: Props = $props();
</script>

{#if numPlayers == 2}
	<div
		class="absolute right-0 left-0 grid h-32 w-[55%] grid-cols-3 items-center justify-center justify-self-center
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
		{console.log(playerTimer)}
		<span
			class="text-palewhite font-chivomono text-center text-5xl transition-colors duration-1000
                                {!playerTimer || !playerTimer.isRunning ? 'opacity-40' : ''}"
		>
			{#if playerTimer && playerTimer.timeFormatted}
				{playerTimer ? playerTimer.timeFormatted : csToFormattedTime(0)}
			{/if}
		</span>
	{/key}
{/snippet}

{#snippet CompetitionTimer()}
	<div class="flex flex-col">
		{#if ksnWs.timer.competition.timeLeftSeconds > 0}
			<div class="text-palewhite/40 text-center text-5xl">
				{ksnWs.timer.competition.getTimeLeftFormatted('seconds')}
			</div>
		{/if}
		{#if ksnWs.timer.competition.overtimeStatus}
			<div class="text-palewhite/40 text-center text-4xl">OVERTIME</div>
		{/if}
	</div>
{/snippet}
