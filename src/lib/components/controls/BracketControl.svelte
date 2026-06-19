<script lang="ts">
	import { clearMatchWinner, setMatchWinner, type Match } from '$lib/Bracket.svelte';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, settings } from '$lib/storage.svelte';
	import { fade, slide } from 'svelte/transition';
</script>

{#if items.current.bracket}
	<section class="m-auto mt-6">
		<div class=" flex flex-col gap-20">
			<div class="flex gap-40">
				<h2
					class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
					style:filter={getFiltersStyle()}
				>
					Upper Bracket
				</h2>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Quarter Finals</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Upper.QuarterFinals as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Semi Finals</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Upper.SemiFinals as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Final</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Upper.Final as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Grand Final</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Upper.GrandFinal as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
			</div>
			<div class="flex gap-40">
				<h2
					class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
					style:filter={getFiltersStyle()}
				>
					Lower Bracket
				</h2>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Round 1</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Lower.Round1 as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Quarter Finals</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Lower.QuarterFinals as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Semi Final</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Lower.SemiFinal as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
				<div>
					<h2 class="text-3xl" style:filter={getFiltersStyle()}>Final</h2>
					<div class="grid h-full">
						<div class="stage-container">
							{#each items.current.bracket.Lower.Final as match, i (i)}
								{@render Match(match)}
							{/each}
						</div>
						<div class="background" style:filter={getFiltersStyle()}></div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

{#snippet Match(match: Match)}
	<div class="grid">
		<div
			class="col-[1/1] row-[1/1] flex min-h-32 min-w-60 flex-col justify-between rounded-xl text-3xl"
		>
			{@render MatchPlayer(match, 'A')}
			{@render MatchPlayer(match, 'B')}
		</div>
		<div
			class="col-[1/1] row-[1/1] min-h-32 min-w-60 rounded-xl
                        {match.A.name && match.B.name && !match.winner
				? 'bg-ctp-lavender-900'
				: 'bg-gray-800'}"
			style:filter={getFiltersStyle()}
		></div>
	</div>
{/snippet}

{#snippet MatchPlayer(match: Match, player: 'A' | 'B')}
	{#key match.winner}
		<button
			in:slide={{ axis: 'x', duration: 800 }}
			class="z-1 grow"
			onclick={() => {
				setMatchWinner(match, player);
			}}
			oncontextmenu={() => {
				clearMatchWinner(match);
			}}
		>
			<div
				class="flex h-full w-full items-center gap-4 bg-linear-to-tr pl-6
                                {player == 'A' ? 'rounded-t-xl' : 'rounded-b-xl'}
                                {match.winner
					? match.winner == player
						? 'from-[#06d641a5] via-[#53c359cb] to-[#bfefc1db] mix-blend-hard-light'
						: 'from-[#cd130acc] via-[#240a0a8f] to-[#0f0000d2] mix-blend-soft-light'
					: ''}"
			>
				{#if settings.current.enableAvatars && match[player].avatarURL}
					{#key match[player].avatarURL}
						<img
							in:fade
							src={match[player].avatarURL}
							alt=""
							class="size-12 rounded-xl object-cover object-center"
							draggable="false"
						/>
					{/key}
				{/if}
				<span style:filter={getFiltersStyle()}>
					{match[player].name}
				</span>
			</div>
		</button>
	{/key}
{/snippet}

<style>
	@import 'tailwindcss';
	h2 {
		@apply text-center;
	}
	.stage-container {
		@apply col-[1/1] row-[1/1] flex h-full flex-col justify-around gap-4 rounded-xl;
	}
	.stage-container ~ .background {
		@apply -z-1 col-[1/1] row-[1/1] min-h-32 min-w-60 rounded-xl bg-gray-900;
	}
</style>
