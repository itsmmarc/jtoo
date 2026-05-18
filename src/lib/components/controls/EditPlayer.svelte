<script lang="ts">
	import { type Player, items } from '$lib/storage.svelte';
	import * as _ from 'underscore';
	type Props = {
		p: Player;
	};

	function replacePlayer() {
		let index: number = _.findIndex(items.current.players, (p) => _.isEqual(p, oldPlayer));
		items.current.players[index] = player;
		items.current.players = [...items.current.players];
		error = { noName: false };
	}

	let { p }: Props = $props();
	const oldPlayer = $derived(p);
	let player = $derived({ ...$state.snapshot(p) });
	let isOpen = $state(false);
	let error = $state({ noName: false });
</script>

<button
	class="button w-7/8 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
	onclick={() => (isOpen = true)}>edit player</button
>

{#if isOpen}
	<section
		class="absolute top-0 left-0 z-50 grid w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<label for="name" class="col-span-6">name</label>
		<input
			class="input col-span-4"
			type="text"
			id="name"
			placeholder="*name"
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
			value={player.avatarURL}
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.avatarURL = value;
				player = { ...player };
			}}
		/>

		<label for="tag" class="col-span-6">tag</label>
		<input
			class="input col-span-4"
			type="text"
			id="tag"
			placeholder="tag"
			value={player.tag}
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
			value={player.flag}
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.flag = value;
				player = { ...player };
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
			value={player.rank?.overall}
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
			value={player.rank?.soldier}
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
			value={player.rank?.demo}
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
			value={player.numWRs}
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
			value={player.bestRun}
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
			value={player.favouriteMap}
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
			value={player.note}
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
					value={player.pr![map].time ?? ''}
					onkeyup={(e) => {
						const value = (e.target as HTMLInputElement).value;
						player.pr![map].rank = parseInt(value);
					}}
				/>
				<input
					class="input col-span-1"
					type="text"
					id="pr-{map}-time"
					placeholder="rank"
					value={player.pr![map].rank ?? ''}
					onkeyup={(e) => {
						const value = (e.target as HTMLInputElement).value;
						player.pr![map].time = value;
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
				replacePlayer();
				isOpen = false;
			}}>update player</button
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
	</section>
{/if}
