<script lang="ts">
	import PopOver from './PopOver.svelte';
	import _ from 'underscore';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { Bracket8, Bracket4, type Match } from '$lib/Bracket.svelte';
	import { Player, type SteamID3, type TournamentFormat } from '$lib/types';
	import DraggableMatchList from '../DraggableMatchList.svelte';

	type Error = { state: boolean; msg: string };

	let error = $state({
		notEnoughPlayers: {
			state: false,
			msg: 'error: incorrect number of players for bracket'
		} as Error
	});
	let popoverState: 'open' | 'closed' = $state('closed');

	function clear() {}

	type Props = {
		container?: boolean;
		format: TournamentFormat;
		players: SteamID3[];
		bracket: Bracket4 | Bracket8 | undefined;
	};
	let { container = true, format, players, bracket = $bindable() }: Props = $props();

	function onopen() {
		if (bracket) {
			return;
		}

		console.log('onopen');
		console.log(bracket);

		// create bracket
		bracket = format == 'DoubleElim4Player' ? new Bracket4() : new Bracket8();

		// fill starting matches of bracket with players
		for (let i = 0; i < Object.values(bracket.Upper.QuarterFinals).length; i++) {
			Object.values(bracket.Upper.QuarterFinals)[i].A = players[i];
			Object.values(bracket.Upper.QuarterFinals)[i].B = players[players.length - 1 - i];
		}
		console.log(bracket);
	}
</script>

<PopOver title="add bracket" bind:state={popoverState} clearfn={clear} {onopen} {container}>
	{$inspect(bracket)}
	<section class="grid grid-cols-12 gap-2">
		<!-- MARK: Bracket Display -->
		{#if bracket}
			<div class="col-span-full flex flex-col">
				<h2 class="text-3xl" style:filter={getFiltersStyle()}>Starting Matches</h2>
				<DraggableMatchList bind:bracket tournamentFormat={format} />
			</div>

			<hr class="hr" />

			<button
				class="button col-span-6"
				onclick={() => {
					popoverState = 'closed';
				}}>save bracket</button
			>
		{/if}

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>
	</section>
</PopOver>
