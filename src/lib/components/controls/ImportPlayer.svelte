<script lang="ts">
	import PopOver from './PopOver.svelte';
	import { items } from '$lib/storage.svelte';
	import { Player } from '$lib/types';
	import { Tempus2 } from '$lib/api/tempus2/api-tempus2';
	import { Steam } from '$lib/api/steam/api-steam';
	import _ from 'underscore';
	import Flag from '../util/Flag.svelte';

	type Error = { state: boolean; msg: string };

	let popoverState: 'open' | 'closed' = $state('closed');
	let queryTerm = $state('');
	let searchResultsTempus: Tempus2.PlayerInfo[] = $state([]);
	let searchResultsSteam: Steam.PlayerSummary[] | null = $state([]);
	let fetched = $state(false);
	let player = $state(new Player());
	let error = $state({
		invalidTempusID: { state: false, msg: 'error: invalid tempus id' } as Error,
		noName: { state: false, msg: 'error: no name entered' } as Error,
		noSteamID3: { state: false, msg: 'error: no steamid3 entered' } as Error,
		noSteamID64: { state: false, msg: 'error: no steamid64 entered' } as Error,
		noTempusID: { state: false, msg: 'error: no tempus id entered' } as Error
	});

	async function fetchPlayerByTempusID(tempusId: number) {
		error.invalidTempusID.state = false;
		fetched = false;
		let result = await Tempus2.fetchPlayerByTempusID(tempusId);
		if (!result) {
			error.invalidTempusID.state = true;
			return;
		}
		fetched = true;

		player = result as Player;

		// player.avatarURL = await Steam.fetchPlayerAvatar(player.steamID);

		player = { ...player };
	}

	async function searchPlayers(queryTerm: string) {
		fetched = false;
		searchResultsTempus = await Tempus2.searchPlayers(queryTerm);
		let ids: string[] = [];
		searchResultsTempus.forEach((r) => ids.push(r.steamid));
		// searchResultsSteam = await Steam.fetchPlayerSummaries(ids);
	}

	function importPlayer(player: Player) {
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

		let playerAlreadyExists = false;
		for (let existingPlayer of items.current.players) {
			if (existingPlayer.tempusID == player.tempusID) {
				existingPlayer = player;
				playerAlreadyExists = true;
				items.current.players = [...items.current.players];
				console.log('update player:');
				console.log(player);
				break;
			}
		}

		if (!playerAlreadyExists) {
			items.current.players = [...items.current.players, player];
			console.log('added player:');
			console.log(player);
		}

		popoverState = 'closed';

		if (oncreate) oncreate(player);

		clear();
	}

	async function onSearch(queryTerm: string) {
		fetched = false;
		if (queryTerm) {
			if (queryTerm.includes('_')) {
				await fetchPlayerByTempusID(parseInt(queryTerm));
			}
			if (!fetched) {
				searchPlayers(queryTerm);
			}
		}
	}

	function clear() {
		player = new Player();
		queryTerm = '';
		searchResultsTempus = [];
		searchResultsSteam = [];
		fetched = false;
	}

	type Props = { container?: boolean; oncreate?: (player: Player) => void };
	let { container = true, oncreate }: Props = $props();
</script>

<PopOver title="import player" bind:state={popoverState} clearfn={clear} {container}>
	<section class="grid grid-cols-12 gap-2">
		<form class="col-span-full flex gap-2" onsubmit={() => onSearch(queryTerm)}>
			<label for="tempus-id" class="col-span-4">search</label>
			<input
				class="remove-arrow input col-span-4"
				type="text"
				id="tempus-id"
				placeholder="tempus id or name"
				onkeyup={(e) => {
					queryTerm = (e.target as HTMLInputElement).value;
				}}
			/>
			<button type="submit" class="button col-span-4 max-w-30 justify-self-center">fetch</button>
		</form>

		<hr class="hr" />

		{#if searchResultsTempus.length > 0 && searchResultsSteam && searchResultsSteam.length > 0}
			<div class="col-span-full grid grid-cols-12 items-center gap-2">
				<div class="col-span-3"></div>
				<div class="col-span-6">name</div>

				<hr class="hr" />

				{#each searchResultsTempus as searchResult, i (i)}
					{@const searchResultSteam = searchResultsSteam.filter(
						(r) => r.steamid == Steam.convertSteamId(searchResult.steamid, 'SteamID64')
					)[0]}
					{console.log(searchResultSteam)}
					<div class="col-span-3">
						<img
							src={searchResultSteam.avatarmedium}
							alt=""
							class="col-span-2 row-span-2 size-12 rounded-xl object-cover object-center"
							draggable="false"
						/>
					</div>
					<div class="col-span-6">{searchResult.name}</div>
					<button
						class="button col-span-3"
						onclick={() => {
							fetchPlayerByTempusID(searchResult.id);
							searchResultsTempus = [];
							searchResultsSteam = [];
						}}>select</button
					>
				{/each}

				<hr class="hr" />
			</div>
		{/if}

		{#if fetched}
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
					importPlayer(player);
				}}>add player</button
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
