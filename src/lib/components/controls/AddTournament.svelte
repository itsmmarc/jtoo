<script lang="ts">
	import PopOver from './PopOver.svelte';
	import { items } from '$lib/storage.svelte';
	import {
		Player,
		TFClasses,
		TFMap,
		Tournament,
		TournamentFormats,
		type TFClass
	} from '$lib/types';
	import _ from 'underscore';
	import RadioInputs from './RadioInputs.svelte';
	import Importplayer from './ImportPlayer.svelte';
	import Importmap from './ImportMap.svelte';
	import { Bracket4, Bracket8 } from '$lib/Bracket.svelte';
	import AddBracket from './AddBracket.svelte';
	import DraggablePlayerList from '../DraggablePlayerList.svelte';

	type Error = { state: boolean; msg: string };

	let maxPlayers = $state(999);
	let playerSeachTerm = $state('');
	let mapSeachTerm = $state('');
	let playerSearchResults: Player[] = $state([]);
	let mapSearchResults: TFMap[] = $state([]);

	let formatChosen = $state(false);
	let popoverState: 'open' | 'closed' = $state('closed');
	let tournament = $state(new Tournament());
	let error = $state({
		invalidTempusID: { state: false, msg: 'error: invalid tempus id' } as Error,
		noName: { state: false, msg: 'error: no name entered' } as Error,
		invalidFormat: { state: false, msg: 'error: invalid tournament format' } as Error,
		invalidClass: { state: false, msg: 'error: invalid tournament class' } as Error,
		maxPlayers: { state: false, msg: 'error: cannot add more players for this format' } as Error,
		notEnoughPlayers: {
			state: false,
			msg: `error: not enough players for bracket`
		}
	});

	function addTournament(tournament: Tournament) {
		let errorFound = false;
		if (!tournament.info.name) {
			error.noName.state = true;
			errorFound = true;
		}

		if (errorFound) {
			return;
		}

		items.current.tournaments = [...items.current.tournaments, tournament];
		console.log('added tournament:');
		console.log(tournament);

		popoverState = 'closed';

		clear();
	}

	function onCreate() {
		let errorFound = false;

		if (!tournament.format) {
			error.invalidFormat.state = true;
			errorFound = true;
		} else {
			error.invalidFormat.state = false;
		}

		if (!tournament.info.class) {
			error.invalidClass.state = true;
			errorFound = true;
		} else {
			error.invalidClass.state = false;
		}

		if (errorFound) {
			return;
		}

		formatChosen = true;
	}

	function clearErrors() {
		for (let e of Object.values(error)) {
			e.state = false;
		}
	}

	function clear() {
		tournament = new Tournament();
		clearErrors();
		formatChosen = false;
		playerSeachTerm = '';
		playerSearchResults = [];
		mapSeachTerm = '';
		mapSearchResults = [];
	}

	function searchPlayers(searchTerm: string) {
		playerSearchResults = items.current.players.filter((p) => p.name.includes(searchTerm));
	}
	function searchMaps(searchTerm: string) {
		mapSearchResults = items.current.maps.filter((m) => m.fileName.includes(searchTerm));
	}

	function importplayer(player: Player) {
		if (tournament.players.length < maxPlayers) {
			tournament = {
				...tournament,
				players: [...tournament.players, player]
			};
			return;
		}
		error.maxPlayers.state = true;
	}
	function importMap(map: TFMap) {
		console.log('adding map to tournament');
		console.log(map);
		tournament = {
			...tournament,
			maps: sortMaps([...tournament.maps, map], tournament.info.class)
		};
		return;
	}

	function removePlayer(player: Player) {
		tournament.players = tournament.players.filter((p) => p.tempusID != player.tempusID);
		error.maxPlayers.state = false;
	}
	function removeMap(map: TFMap) {
		tournament.maps = tournament.maps.filter((m) => m.mapZoneId != map.mapZoneId);
	}

	function isPlayerInTournament(player: Player) {
		for (const p of tournament.players) {
			if (p.tempusID == player.tempusID) {
				return true;
			}
		}
		return false;
	}
	function isMapInTournament(map: TFMap) {
		for (const m of tournament.maps) {
			if (m.mapZoneId == map.mapZoneId) {
				return true;
			}
		}
		return false;
	}

	function sortPlayers(players: Player[], tfClass: TFClass): Player[] {
		return players.sort((a, b) => {
			return a.rank[tfClass].rank - b.rank[tfClass].rank;
		});
	}

	function sortMaps(maps: TFMap[], tfClass: TFClass): TFMap[] {
		return maps.sort((a, b) => {
			if (tfClass == 'overall') tfClass = 'soldier';
			return b.tier[tfClass] - a.tier[tfClass];
		});
	}
</script>

<PopOver title="add tournament" bind:state={popoverState} clearfn={clear}>
	<section class="grid grid-cols-12 gap-2">
		<!-- MARK: Format -->
		<div class="col-span-full flex flex-col">
			<label for="format" class="col-span-4">format</label>
			<RadioInputs
				name="format"
				bind:value={tournament.format}
				opts={[...TournamentFormats]}
				onchange={() => {
					switch (tournament.format) {
						case 'DoubleElim4Player':
							tournament.bracket = new Bracket4();
							maxPlayers = 4;
							break;
						case 'DoubleElim8Player':
							tournament.bracket = new Bracket8();
							maxPlayers = 8;
							break;
						case 'Leaderboard':
							tournament.bracket = undefined;
							maxPlayers = 999;
							break;
						case 'AllOutRoyale':
						case '':
							console.log(`using not properly implemented tournament format: ${tournament.format}`);
							tournament.bracket = undefined;
							maxPlayers = 999;
							break;
						default:
							throw new Error(`Invalid tournament format: ${tournament.format satisfies never}`);
					}
				}}
			/>
			<label for="tfclass" class="col-span-4">class</label>
			<RadioInputs name="tfclass" bind:value={tournament.info.class} opts={[...TFClasses]} />
			<button
				class="button col-span-4 mt-2 max-w-30 justify-self-center"
				onclick={() => {
					onCreate();
				}}>create</button
			>
		</div>

		<hr class="hr" />

		<!-- MARK: Info -->
		{#if formatChosen}
			<label for="name" class="col-span-6">name</label>
			<input
				class="input col-span-4"
				type="text"
				id="name"
				placeholder="name"
				value={tournament.info.name}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					tournament.info.name = value;
				}}
			/>

			{#if tournament.info.imageUrl}
				<img
					src={tournament.info.imageUrl}
					alt=""
					class="col-span-2 row-span-2 size-16 rounded-xl object-cover object-center"
					draggable="false"
				/>
			{/if}

			<label for="imageUrl" class="col-span-6">image URL</label>
			<input
				class="input col-span-4"
				type="text"
				id="imageUrl"
				placeholder="image URL"
				value={tournament.info.imageUrl}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					tournament.info.imageUrl = value;
				}}
			/>

			<hr class="hr" />

			<!-- MARK: Players -->
			{#if tournament.players.length < maxPlayers}
				<div class="col-span-full flex gap-2">
					<label for="map-name" class="col-span-4">search players</label>
					<input
						class="remove-arrow input col-span-4"
						type="text"
						id="map-name"
						placeholder="name"
						bind:value={playerSeachTerm}
					/>
					<button
						class="button col-span-4 max-w-30 justify-self-center"
						onclick={() => {
							searchPlayers(playerSeachTerm);
						}}>search</button
					>
				</div>

				<hr class="hr" />

				{#if playerSearchResults.length > 0}
					<div class="col-span-full grid grid-cols-12 gap-2">
						{#each playerSearchResults as player, i (i)}
							{#if player.name && !isPlayerInTournament(player)}
								<div class="col-span-3">
									<img
										src={player.avatarURL}
										alt=""
										class="size-12 rounded-xl object-cover object-center"
										draggable="false"
									/>
								</div>
								<div class="col-span-6">{player.name}</div>
								<button
									class="button col-span-3"
									onclick={() => {
										importplayer(player);

										playerSearchResults = [];
										playerSeachTerm = '';
									}}>add</button
								>
							{/if}
						{/each}
					</div>
				{/if}

				<div class="col-span-full">
					<Importplayer container={false} oncreate={(player) => importplayer(player)} />
				</div>
			{/if}

			<DraggablePlayerList
				bind:players={tournament.players}
				class="col-span-full"
				onremove={() => {
					error.maxPlayers.state = false;
					tournament = {
						...tournament,
						players: tournament.players
					};
				}}
			/>

			<hr class="hr" />

			<!-- MARK: Maps -->
			<div class="col-span-full flex gap-2">
				<label for="search-maps" class="col-span-4">search maps</label>
				<input
					class="remove-arrow input col-span-4"
					type="text"
					id="search-maps"
					placeholder="name"
					bind:value={mapSeachTerm}
				/>
				<button
					class="button col-span-4 max-w-30 justify-self-center"
					onclick={() => {
						searchMaps(mapSeachTerm);
					}}>search</button
				>
			</div>

			<hr class="hr" />

			{#if mapSearchResults.length > 0}
				<div class="col-span-full grid grid-cols-12 gap-2">
					{#each mapSearchResults as map, i (i)}
						{#if map.fileName && !isMapInTournament(map)}
							<div class="col-span-3">
								<img
									src={map.imageURL}
									alt=""
									class="size-12 rounded-xl object-cover object-center"
									draggable="false"
								/>
							</div>
							<div class="col-span-6">{map.fileName}</div>
							<button
								class="button col-span-3"
								onclick={() => {
									importMap(map);
									mapSearchResults = [];
									mapSeachTerm = '';
									console.log(tournament.maps);
								}}>add</button
							>
						{/if}
					{/each}
				</div>
			{/if}

			<div class="col-span-full">
				<Importmap container={false} oncreate={(map) => importMap(map)} />
			</div>

			{#each tournament.maps as map, i (i)}
				<div class="col-span-3">
					<img
						src={map.imageURL}
						alt=""
						class="size-12 rounded-xl object-cover object-center"
						draggable="false"
					/>
				</div>
				<div class="col-span-6">{map.fileName}</div>
				<div class="col-span-3">
					<button
						class="button-remove"
						onclick={() => {
							removeMap(map);
							tournament = {
								...tournament,
								maps: sortMaps([...tournament.maps], tournament.info.class)
							};
						}}>remove</button
					>
				</div>
			{/each}

			<hr class="hr" />
			<!-- MARK: Bracket -->
			{#if (tournament.format == 'DoubleElim4Player' || tournament.format == 'DoubleElim8Player') && tournament.players.length == maxPlayers}
				<div class="col-span-full">
					<AddBracket
						container={false}
						format={tournament.format}
						players={tournament.players}
						bind:value={tournament.bracket}
					/>
				</div>

				<hr class="hr" />
			{/if}

			<button
				class="button col-span-6"
				onclick={() => {
					addTournament(tournament);
				}}>add tournament</button
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
