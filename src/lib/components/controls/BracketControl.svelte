<script lang="ts">
	import { clearMatchWinner, setMatchWinner, type Match } from '$lib/Bracket.svelte';
	import { items, settings } from '$lib/storage.svelte';
	import { fade, slide } from 'svelte/transition';
</script>

{#if items.current.bracket}
	<section class="m-auto">
		<div class=" flex flex-col gap-20">
			<div class="flex gap-40">
				<h2
					class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
				>
					Upper Bracket
				</h2>
				<div>
					<h2 class="text-3xl">Quarter Finals</h2>
					<div class="stage-container">
						{#each items.current.bracket.Upper.QuarterFinals as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Semi Finals</h2>
					<div class="stage-container">
						{#each items.current.bracket.Upper.SemiFinals as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Upper.Final as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Grand Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Upper.GrandFinal as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
			</div>
			<div class="flex gap-40">
				<h2
					class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
				>
					Lower Bracket
				</h2>
				<div>
					<h2 class="text-3xl">Round 1</h2>
					<div class="stage-container">
						{#each items.current.bracket.Lower.Round1 as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Quarter Finals</h2>
					<div class="stage-container">
						{#each items.current.bracket.Lower.QuarterFinals as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Semi Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Lower.SemiFinal as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Lower.Final as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

{#snippet Match(match: Match)}
	<div
		class="flex min-h-32 min-w-60 flex-col justify-between
                {match.A.name && match.B.name && !match.winner
			? 'bg-ctp-lavender-900'
			: 'bg-gray-800'} text-3xl"
	>
		{@render MatchPlayer(match, 'A')}
		{@render MatchPlayer(match, 'B')}
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
				{match[player].name}
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
		@apply flex h-full flex-col justify-around gap-4 bg-gray-900;
	}
</style>
