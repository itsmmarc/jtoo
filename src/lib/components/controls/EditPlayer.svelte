<script lang="ts">
	import PopOver from './PopOver.svelte';
	import { items } from '$lib/storage.svelte';
	import { Player } from '$lib/types.svelte';
	import _ from 'underscore';
	import Flag from '../util/Flag.svelte';

	type Error = { state: boolean; msg: string };

	type Props = { player: Player };
	let { player }: Props = $props();

	let popoverState: 'open' | 'closed' = $state('closed');
	let error = $state({
		invalidTempusID: { state: false, msg: 'error: invalid tempus id' } as Error,
		noName: { state: false, msg: 'error: no name entered' } as Error,
		noSteamID3: { state: false, msg: 'error: no steamid3 entered' } as Error,
		noSteamID64: { state: false, msg: 'error: no steamid64 entered' } as Error,
		noTempusID: { state: false, msg: 'error: no tempus id entered' } as Error
	});

	function savePlayer(player: Player) {
		let errorFound = false;
		if (!player.name) {
			error.noName.state = true;
			errorFound = true;
		}
		if (!player.tempusID) {
			error.noSteamID3.state = true;
			errorFound = true;
		}
		if (!player.steamID) {
			error.noSteamID3.state = true;
			errorFound = true;
		}
		if (!player.steamID3) {
			error.noSteamID3.state = true;
			errorFound = true;
		}

		if (errorFound) {
			return;
		}

		for (let p of items.current.players) {
			if (p.tempusID == player.tempusID) {
				p = { ...player };
				break;
			}
		}

		items.current.players = [...items.current.players];
		console.log('saved player:');
		console.log(player);

		popoverState = 'closed';
	}
</script>

<PopOver title="edit player" bind:state={popoverState} container={false}>
	<section class="grid grid-cols-12 gap-2">
		<label for="name" class="col-span-6">name</label>
		<input
			class="input col-span-4"
			type="text"
			id="name"
			placeholder="name"
			value={player.name}
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.name = value;
			}}
		/>

		{#if player.avatarURL}
			<img
				src={player.avatarURL}
				alt=""
				class="col-span-2 row-span-2 size-16 rounded-xl object-cover object-center"
				draggable="false"
			/>
		{/if}

		<label for="avatarURL" class="col-span-6">avatar URL</label>
		<input
			class="input col-span-4"
			type="text"
			id="avatarURL"
			placeholder="avatar URL"
			value={player.avatarURL}
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.avatarURL = value;
			}}
		/>

		<label for="flag" class="col-span-5">flag </label>
		<a
			class="col-span-1"
			aria-label="flag-preview"
			href="https://flagicons.lipis.dev/"
			target="_blank"
		>
			<span class="icon-[mdi--question-mark]"></span>
		</a>
		<input
			class="input col-span-4"
			type="text"
			id="flag"
			placeholder="flag"
			value={player.flag}
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.flag = value;
			}}
		/>
		<Flag code={player.flag} class="col-span-1 ml-4 rounded text-[1.5rem]" />

		<hr class="hr" />

		<label class="col-span-6" for="bestRun">best run</label>
		<input
			class="input col-span-4"
			type="text"
			id="bestRun"
			placeholder="best run"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.bestRun = value;
			}}
		/>

		<label class="col-span-6" for="favouriteMap">favourite map</label>
		<input
			class="input col-span-4"
			type="text"
			id="favouriteMap"
			placeholder="favourite map"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.favouriteMap = value;
			}}
		/>

		<label class="col-span-6" for="note">note</label>
		<textarea
			class="input col-span-4 h-16 align-text-top"
			id="note"
			placeholder="note"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.note = value;
			}}
		></textarea>

		<hr class="hr" />

		<button
			class="button col-span-6"
			// value=""
			onclick={() => {
				savePlayer(player);
			}}>save player</button
		>

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>
	</section>
</PopOver>
