<script lang="ts">
	import { overlay, settings } from '$lib/storage.svelte';
	import { csToTime } from '$lib/util';
	import type { KSNWebSocket, PlayerTimer } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getContext } from 'svelte';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { numPlayers: number };
	let { numPlayers }: Props = $props();
	let playerTimers = $derived(getPlayerTimers(ksnWs));
	let competitionTimer = $derived(ksnWs.timer.competition);

	function getPlayerTimers(ksnWs: KSNWebSocket) {
		let timers: Array<PlayerTimer | undefined> = [];
		overlay.current.players.every((steamID3) => {
			if (!steamID3) {
				timers.push(undefined);
			} else {
				timers.push(ksnWs.timer.getPlayerTimerBySteamId3(steamID3));
			}
		});
		return timers;
	}
</script>

{#if numPlayers == 2}
	<div
		class="absolute left-0 flex h-32 w-full items-center justify-center gap-60
                {settings.current.monoFont}"
	>
		<span
			class="text-palewhite font-chivomono text-center text-5xl transition-colors duration-1000
                                {playerTimers[0] && !playerTimers[0].isRunning ? 'opacity-40' : ''}"
		>
			{playerTimers[0] ? playerTimers[0].timeFormatted : csToTime(0)}
		</span>
		<span
			class="text-palewhite font-chivomono text-center text-5xl transition-colors duration-1000
                                {playerTimers[1] && !playerTimers[1].isRunning ? 'opacity-40' : ''}"
		>
			{playerTimers[1] ? playerTimers[1].timeFormatted : csToTime(0)}
		</span>
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
	</div>
{/if}
