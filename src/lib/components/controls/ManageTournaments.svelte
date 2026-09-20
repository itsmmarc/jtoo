<script lang="ts">
	import { items } from '$lib/storage.svelte';
	import { Tournament } from '$lib/types';
	import AddTournament from './AddTournament.svelte';
	import PopOver from './PopOver.svelte';

	let popoverState: 'open' | 'closed' = $state('closed');

	function deleteTournament(tournament: Tournament) {
		items.current.tournaments = items.current.tournaments.filter((t) => t.id !== tournament.id);
	}
</script>

<PopOver title="manage tournaments" bind:state={popoverState}>
	<div class="grid w-full grid-cols-[max-content_1fr_max-content_max-content] items-center gap-x-4">
		{#each items.current.tournaments as tournament, i (i)}
			{#if tournament.info.name}
				<div>
					{#if tournament.info.imageUrl}
						<img
							src={tournament.info.imageUrl}
							alt=""
							class="col-span-2 row-span-2 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/if}
				</div>
				<div>{tournament.info.name}</div>
				<div><AddTournament {tournament} /></div>
				<div>
					<button class="button-remove" onclick={() => deleteTournament(tournament)}>delete</button>
				</div>
			{/if}
		{/each}
	</div>
</PopOver>
