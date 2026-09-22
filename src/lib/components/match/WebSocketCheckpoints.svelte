<script lang="ts">
	import { overlay, settings } from '$lib/storage.svelte';
	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getPlayer } from '$lib/util';
	import { fade } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { numPlayers: number };
	let { numPlayers }: Props = $props();

	let numCps = $derived(ksnWs.timer.checkpoints.length);

	// setInterval(() => {
	// 	console.log(ksnWs.timer.leader);
	// 	console.log(ksnWs.timer.leaderCheckpoints);
	// }, 1000);
</script>

<div class="absolute right-0 left-0 m-auto mt-2 w-[25%] {settings.current.monoFont}">
	{#if ksnWs.timer.leader}
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
					{ksnWs.timer.getPlayerTimer(ksnWs.timer.leader)?.prCs
						? ksnWs.timer.getPlayerTimer(ksnWs.timer.leader)!.prFormatted
						: '---'}
				</span>
			</div>
			<hr class="hr" />
		</div>

		<!-- cps -->
		<div
			class="grid h-83 grid-cols-3 justify-center gap-x-4
                        {numCps > 14 ? 'gap-y-1 text-2xl' : 'gap-y-3 text-3xl'}"
		>
			{@render Comparison(ksnWs.timer.leaderCheckpointsCs, overlay.current.players[0], 0)}

			<!-- best pr cps -->
			<div class="justify-self-center text-center">
				{#each ksnWs.timer.leaderCheckpointsFormatted as [cpName, cpTime], i (i)}
					<!-- {#if cp} -->
					<div>
						{cpTime}
					</div>
					<!-- {/if} -->
				{/each}
			</div>

			<!-- right comparison -->
			{@render Comparison(ksnWs.timer.leaderCheckpointsCs, overlay.current.players[1], 1)}
		</div>
	{/if}
</div>

{#snippet Comparison(
	leaderCps: SvelteMap<string, number>,
	steamID3: number | undefined,
	playerNum: number
)}
	{@const playerCps: SvelteMap<string, number> = steamID3 ? ksnWs.timer.getPlayerTimer(steamID3)!.currentCheckpointsCs : new SvelteMap()}
	<div class={playerNum == 0 ? 'justify-self-end text-right' : 'justify-self-start text-left'}>
		{#each leaderCps as [cpName, leaderCpTime], i (i)}
			{@const playerCpTime = playerCps.get(cpName)}
			{console.log(`playernum: ${playerNum}`)}
			{console.log(`playercp: ${playerCpTime}`)}
			{console.log(`leadercp: ${leaderCpTime}`)}
			<div>
				{#if playerCpTime}
					{@const diff = (playerCpTime - leaderCpTime) / 100}
					{@const speed: 'faster' | 'same' | 'slower' = diff < 0 ? 'faster' : diff > 0 ? 'slower' : 'same'}
					{@const clr = {
						faster: playerNum == 0 ? 'bg-ctp-blue-800/55' : 'bg-ctp-red-800/55',
						slower: playerNum == 0 ? 'bg-ctp-blue-950/40' : 'bg-ctp-red-950/40',
						same: 'bg-ctp-teal-950/55'
					}}

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
				{/if}
			</div>
		{/each}
	</div>
{/snippet}
