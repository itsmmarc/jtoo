<script lang="ts">
	import { getPlayer } from '$lib/util';
	import { overlay, settings } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { KSNWebSocket, PlayerTimer } from '$lib/websockets/ksn/ws-ksn.svelte';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { numPlayers: number };
	let { numPlayers }: Props = $props();
	let playerTimers = $derived(getPlayerTimers(ksnWs));

	function getPlayerTimers(ksnWs: KSNWebSocket) {
		let timers: Array<PlayerTimer | undefined> = [];
		overlay.current.players.every((steamID3) => {
			if (!steamID3) {
				timers.push(undefined);
			} else {
				timers.push(ksnWs.timer.getPlayerTimer(steamID3));
			}
		});
		return timers;
	}

	let leftCps = $derived(playerTimers[0]?.currentCheckpointsCs);
	let rightCps = $derived(playerTimers[1]?.currentCheckpointsCs);
	let bestCps = $derived(ksnWs.timer.leaderCheckpoints);

	let numCps = $derived(ksnWs.timer.checkpoints.length);

	$effect(() => {
		if (overlay.current.players) {
			for (const p of overlay.current.players)
				if (p) {
					ksnWs.timer.verifyPlayerAdded(p);
				}
		}
	});

        function test(){
                console.log(ksnWs)
                console.log(ksnWs.timer)
                console.log(ksnWs.timer.leader)
                console.log(ksnWs.timer.getPlayerTimer(
		ksnWs.timer.leader!
	))
                return 1
        }
</script>

{#if ksnWs.timer.leader}
        {@const cps = ksnWs.timer.leaderCheckpoints}
        {const x = test()}
        {@const cpsFormatted = ksnWs.timer.getPlayerTimer(
                ksnWs.timer.leader
        )!.prCheckpointsFormatted}
	<div class="absolute right-0 left-0 m-auto mt-2 w-[25%] {settings.current.monoFont}">
		<!-- header -->
		<div class="grid grid-cols-3 items-center justify-center gap-x-4 text-center text-3xl">
			<div class="justify-self-end">
				<img
					in:fade
					src={getPlayer(ksnWs.timer.leader).avatarURL}
					alt=""
					class="size-13 rounded-xl object-cover object-center"
					draggable="false"
				/>
			</div>
			<div class="col-span-2 mt-2 h-11">
				<span>
					{ksnWs.timer.getPlayerTimer(ksnWs.timer.leader)!.prFormatted}
				</span>
			</div>
			<hr class="hr" />
		</div>

		<!-- cps -->
		<div
			class="grid h-83 grid-cols-3 justify-center gap-x-4
                        {numCps > 14 ? 'gap-y-1 text-2xl' : 'gap-y-3 text-3xl'}"
		>
			{@render Comparison(cps, overlay.current.players[0], 0)}

			<!-- best pr cps -->
			<div class="justify-self-center text-center">
				{#each cpsFormatted as cp, i (i)}
					{#if cp}
						<div>
							{cp}
						</div>
					{/if}
				{/each}
			</div>

			<!-- right comparison -->
			{@render Comparison(cps, overlay.current.players[1], 1)}
		</div>
	</div>
{/if}

{#snippet Comparison(leaderCps: number[], steamID3: number | undefined, playerNum: number)}
	{@const playerCps: number[] = steamID3 ? ksnWs.timer.getPlayerTimer(steamID3)!.currentCheckpointsCs : []}
	<div class={playerNum == 0 ? 'justify-self-end text-right' : 'justify-self-start text-left'}>
		{#each leaderCps as time, i (i)}
			{#if leaderCps && leaderCps[i]}
				{@const diff = time - playerCps[i]}
				{@const speed: 'faster' | 'same' | 'slower' = diff > 0 ? 'faster' : diff < 0 ? 'slower' : 'same'}
				{@const clr = {
					faster: playerNum == 0 ? 'bg-ctp-blue-800/55' : 'bg-ctp-red-800/55',
					slower: playerNum == 0 ? 'bg-ctp-blue-950/40' : 'bg-ctp-red-950/40',
					same: 'bg-ctp-teal-950/55'
				}}

				<div>
					<span
						transition:fade|global
						class="rounded-lg px-2.5
                                                {speed == 'slower'
							? clr.slower
							: speed == 'faster'
								? clr.faster
								: speed == 'same'
									? clr.same
									: ''}
                                                        {numCps > 14 ? 'text-xl' : 'text-2xl'}"
					>
						{speed == 'same'
							? '-'
							: speed == 'slower'
								? `+${diff.toFixed(2)}`
								: speed == 'faster'
									? diff.toFixed(2)
									: ''}
					</span>
				</div>
			{/if}
		{/each}
	</div>
{/snippet}
