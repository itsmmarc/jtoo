<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { overlay } from '$lib/storage.svelte';
	import { getMap, getTournament, getPlayer } from '$lib/util';

	let tournament = $derived(getTournament(overlay.current.tournament));
</script>

<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<section>
	<div class="grid grid-cols-12">
		<div class="col-span-full flex">
			{#if tournament.info.imageUrl}
				<img src={tournament.info.imageUrl} alt="tournament logo" />
			{/if}
			<h1 class="text-6xl">{tournament.info.name}</h1>
		</div>
		<div class="col-span-8 row-start-2 flex">prizepool info</div>
		<div class="col-span-8 row-start-3 flex">
			{#each tournament.players as playerId, i (i)}
				{@const player = getPlayer(playerId)}
				<div>
					<img src={player.avatarURL} alt="{player.name}'s avatar" />
					<div>{player.name}</div>
				</div>
			{/each}
		</div>
		<div class="col-span-4 row-span-2 row-start-2 flex">
			{#each tournament.maps as mapFilename, i (i)}
				{@const map = getMap(mapFilename)}
				<div>
					<img src={map.imageURL} alt={map.shortName} />
					<div>{map.shortName}</div>
				</div>
			{/each}
		</div>
	</div>
</section>
