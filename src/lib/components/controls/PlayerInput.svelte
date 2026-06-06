<script lang="ts">
	import { type Player, items } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';
	import EditPlayer from './EditPlayer.svelte';

	function addPlayer() {
		items.current.players.push(player);
		error = { noName: false };
	}
	function clearPlayer() {
		player = { name: '', score: 0, rank: { soldier: 0, demo: 0, overall: 0 } };
	}
	let openAddPlayers = false;
	let openManagePlayers = false;
	let error = { noName: false };
	let player: Player = { name: '', score: 0, rank: { soldier: 0, demo: 0, overall: 0 } };
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
			items.current.players = [{ name: '', score: 0 } as Player];
		}}>remove all</button
	>
</div>
{#if openAddPlayers}
	<section
		class="absolute z-50 grid w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<label for="name" class="col-span-6">name</label>
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
				<label class="col-span-6" for="pr-{map}-rank">pr {map}</label>
				<input
					class="input col-span-3 mr-1"
					type="text"
					id="pr-{map}-rank"
					placeholder="0:00.00"
					onkeyup={(e) => {
						const value = (e.target as HTMLInputElement).value;
						player.tempusPrs![map].rank = parseInt(value);
					}}
				/>
				<input
					class="input col-span-1"
					type="text"
					id="pr-{map}-time"
					placeholder="rank"
					onkeyup={(e) => {
						const value = (e.target as HTMLInputElement).value;
						player.tempusPrs![map].time = value;
					}}
				/>
			{/if}
		{/each}

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<button
			class="button col-span-6 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			// value=""
			onclick={() => {
				if (player.name === '') {
					error.noName = true;
					return;
				}
				addPlayer();
				openAddPlayers = false;
			}}>add player</button
		>
		{#if error.noName}
			<div class="col-span-6">error: no name entered</div>
		{/if}
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
				{#if player.name != ''}
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
