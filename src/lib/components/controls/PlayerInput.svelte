<script lang="ts">
	import { type Player, items } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';

	function addPlayer() {
		items.current.players.push(player);
		error = { noName: false };
	}
	function clearPlayer() {
		player = { name: '', score: 0, rank: { soldier: 0, demo: 0, overall: 0 } };
	}
	let isOpen = false;
	let error = { noName: false };
	let player: Player = { name: '', score: 0, rank: { soldier: 0, demo: 0, overall: 0 } };
</script>

<div transition:slide>
	<button
		class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
		onclick={() => {
			clearPlayer();
			isOpen = true;
		}}>add player</button
	>
	<button
		class="button-remove"
		onclick={() => {
			items.current.players = [{ name: '', score: 0 } as Player];
		}}>remove all</button
	>
</div>
{#if isOpen}
	<div
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
		<a class="col-span-1" href="https://flagicons.lipis.dev/" target="_blank">
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
				player.numWRs = parseInt(value);
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

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		<button
			class="button col-span-6 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			// value=""
			onclick={() => {
				if (player.name != '') {
					addPlayer();
					isOpen = false;
				} else {
					error.noName = true;
				}
			}}>add player</button
		>
		{#if error.noName}
			<div class="col-span-6">error: no name entered</div>
		{/if}
		<button
			class="button-remove absolute top-0 right-2"
			onclick={() => {
				isOpen = false;
			}}>✖</button
		>
	</div>
{/if}
