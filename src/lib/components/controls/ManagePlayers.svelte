<script lang="ts">
	import { items } from '$lib/storage.svelte';
	import { Player } from '$lib/types.svelte';
	import EditPlayer from './EditPlayer.svelte';
	import PopOver from './PopOver.svelte';

	let popoverState: 'open' | 'closed' = $state('closed');

	function deletePlayer(player: Player) {
		items.current.players = items.current.players.filter((p) => p.tempusID !== player.tempusID);
	}
</script>

<PopOver title="manage players" bind:state={popoverState}>
	<div class="grid w-full grid-cols-[max-content_1fr_max-content_max-content] items-center gap-x-4">
		{#each items.current.players as player, i (i)}
			{#if player.name}
				<div>
					{#if player.avatarURL}
						<img
							src={player.avatarURL}
							alt=""
							class="col-span-2 row-span-2 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/if}
				</div>
				<div>{player.name}</div>
				<div><EditPlayer {player} /></div>
				<div>
					<button class="button-remove" onclick={() => deletePlayer(player)}>delete</button>
				</div>
			{/if}
		{/each}
	</div>
</PopOver>
