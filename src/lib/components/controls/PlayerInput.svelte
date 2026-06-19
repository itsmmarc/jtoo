<script lang="ts">
	import { type Player, nullPlayer, items } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';
	import EditPlayer from './EditPlayer.svelte';

	function addPlayer() {
		items.current.players = [...items.current.players, player];
		clearErrors();
	}

	function clearErrors() {
		error.noName.state = false;
		error.noSteamID.state = false;
	}
	function clearPlayer() {
		player = { name: '', isCompetitor: false, score: 0, rank: { soldier: 0, demo: 0, overall: 0 } };
	}

	type Error = { state: boolean; msg: string };

	let openAddPlayers = $state(false);
	let openManagePlayers = $state(false);
	let error = $state({
		noName: { state: false, msg: 'error: no name entered' } as Error,
		noSteamID: { state: false, msg: 'error: no steam id3 entered' } as Error
	});
	let player: Player = $state({
		name: '',
		isCompetitor: false,
		score: 0,
		rank: { soldier: 0, demo: 0, overall: 0 }
	});
</script>

<div transition:slide>
	<button
		class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
		onclick={() => {
			clearPlayer();
			openAddPlayers = true;
		}}>add player</button
	>
	<button
		class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
		onclick={() => {
			openManagePlayers = true;
		}}>manage players</button
	>
	<button
		class="button-remove"
		onclick={() => {
			items.current.players = [nullPlayer as Player];
		}}>remove all</button
	>
</div>
{#if openAddPlayers}
	<section
		class="absolute z-50 grid w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<label for="name" class="col-span-6">name*</label>
		<input
			class="input col-span-4"
			type="text"
			id="name"
			placeholder="*name"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.name = value;
			}}
		/>

		{#if player.avatarURL}
			<img
				src={player.avatarURL}
				alt=""
				class="col-span-2 row-span-3 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
				draggable="false"
			/>
		{/if}

		<label for="avatarURL" class="col-span-6">avatar URL</label>
		<input
			class="input col-span-4"
			type="text"
			id="avatarURL"
			placeholder="avatar URL"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.avatarURL = value;
			}}
		/>

		<label for="isCompetitor" class="col-span-6">tournament competitor?*</label>
		<input
			class="peer col-span-4 mt-1 size-4 accent-ctp-lavender"
			id="isCompetitor"
			name="isCompetitor"
			type="checkbox"
			bind:checked={player.isCompetitor as boolean}
		/>

		<label for="tag" class="col-span-6">tag</label>
		<input
			class="input col-span-4"
			type="text"
			id="tag"
			placeholder="tag"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.tag = value;
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
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.flag = value;
			}}
		/>
		<span class="fi fi-{player.flag} col-span-1 ml-4 rounded text-[1.5rem]"></span>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<label for="tempusid" class="col-span-6">tempus ID</label>
		<input
			class="input col-span-4"
			type="text"
			id="tempusid"
			placeholder="tempus id"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.tempusID = value;
			}}
		/>

		<label for="steamid3" class="col-span-5">steam ID3*</label>
		<button
			onclick={() => {
				alert(
					"enter the the long number from the end of a steamID3.\neg: [U:1:99019190] => 99019190\n\nyou can find a player's steamID3 here https://steamid.io/"
				);
			}}
			class="col-span-1 text-left"
			aria-label="steamid3-explanation"
		>
			<span class="icon-[mdi--question-mark]"></span>
		</button>
		<input
			class="input remove-arrow col-span-4"
			type="number"
			id="steamid3"
			placeholder="*steam id3"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.steamID3 = parseInt(value);
			}}
		/>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<label class="col-span-6" for="rank-overall">overall rank</label>
		<input
			class="remove-arrow input col-span-4"
			type="number"
			pattern="[0-9]"
			id="rank-overall"
			placeholder="overall"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.rank!.overall = parseInt(value);
			}}
		/>

		<label class="col-span-6" for="rank-soldier">soldier rank</label>
		<input
			class="remove-arrow input col-span-4"
			type="number"
			pattern="[0-9]"
			id="rank-soldier"
			placeholder="soldier"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.rank!.soldier = parseInt(value);
			}}
		/>

		<label class="col-span-6" for="rank-demo">demo rank</label>
		<input
			class="remove-arrow input col-span-4"
			type="number"
			pattern="[0-9]"
			id="rank-demo"
			placeholder="demo"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.rank!.demo = parseInt(value);
			}}
		/>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<label class="col-span-6" for="numWRs">number of WRs</label>
		<input
			class="remove-arrow input col-span-4"
			type="number"
			pattern="[0-9]"
			id="numWRs"
			placeholder="numWRs"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.WRs = parseInt(value);
			}}
		/>

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
		<input
			class="input col-span-4"
			type="text"
			id="note"
			placeholder="note"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.note = value;
			}}
		/>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		{#each Object.entries(items.current.maps) as [map], i (i)}
			{#if map !== 'null'}
				<label class="col-span-6" for="pr-{map}-time">pr {map}</label>
				<input
					class="input col-span-3 mr-1"
					type="text"
					id="pr-{map}-time"
					placeholder="0:00.00"
					onkeyup={(e) => {
						const value = (e.target as HTMLInputElement).value;
						player.tempusPrs![map].time = value;
					}}
				/>
				<input
					class="input remove-arrow col-span-1"
					type="number"
					id="pr-{map}-rank"
					placeholder="rank"
					onkeyup={(e) => {
						const value = (e.target as HTMLInputElement).value;
						player.tempusPrs![map].rank = parseInt(value);
					}}
				/>
			{/if}
		{/each}

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<button
			class="button col-span-6 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			// value=""
			onclick={() => {
				let errorFound = false;
				if (!player.name) {
					error.noName.state = true;
					errorFound = true;
				}
				if (!player.steamID3) {
					error.noSteamID.state = true;
					errorFound = true;
				}

				if (errorFound) {
					return;
				}

				addPlayer();
				openAddPlayers = false;
			}}>add player</button
		>

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>

		<button
			class="button-remove absolute top-0 right-2"
			onclick={() => {
				openAddPlayers = false;
			}}>✖</button
		>
	</section>
{/if}

{#if openManagePlayers}
	<section
		class="absolute z-50 grid w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2 pt-6"
	>
		{#if items.current.players.length <= 1}
			<div class="col-span-12">no players</div>
		{:else}
			{#each items.current.players as player, i (i)}
				{#if player.name}
					<div class="col-span-12 grid grid-cols-3">
						<div>{player.name}</div>
						<EditPlayer p={player} />
						<button
							class="button-remove"
							onclick={() => {
								items.current.players = items.current.players.filter((p) => p.name !== player.name);
							}}>delete player</button
						>
					</div>
				{/if}
			{/each}
		{/if}

		<button
			class="button-remove absolute top-0 right-2"
			onclick={() => {
				openManagePlayers = false;
			}}>✖</button
		>
	</section>
{/if}
