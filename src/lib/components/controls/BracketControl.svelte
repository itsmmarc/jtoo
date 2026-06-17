<script lang="ts">
	import { setMatchWinner, type Match } from '$lib/Bracket.svelte';
	import { items } from '$lib/storage.svelte';
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
					<h2 class="text-3xl">Quarter Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Upper.QuarterFinal as match, i (i)}
							{@render Match(match)}
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-3xl">Semi Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Upper.SemiFinal as match, i (i)}
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
					<h2 class="text-3xl">Quarter Final</h2>
					<div class="stage-container">
						{#each items.current.bracket.Lower.QuarterFinal as match, i (i)}
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
	<div class="flex min-h-25 min-w-60 flex-col justify-between gap-2 bg-red-400 p-2 text-3xl">
		<button
			class="z-1 {match.winner ? (match.winner == 'A' ? 'bg-green-500' : 'bg-red-500') : ''}"
			onclick={() => {
				setMatchWinner(match, 'A');
			}}
			oncontextmenu={() => {
				setMatchWinner(match, '');
			}}
		>
			{match.A.name}
		</button>

		<button
			class="z-1 {match.winner ? (match.winner == 'B' ? 'bg-green-500' : 'bg-red-500') : ''}"
			onclick={() => {
				setMatchWinner(match, 'B');
			}}
			oncontextmenu={() => {
				setMatchWinner(match, '');
			}}
		>
			{match.B.name}
		</button>
	</div>
{/snippet}

<style>
	@import 'tailwindcss';
	h2 {
		@apply text-center;
	}
	.stage-container {
		@apply flex h-full flex-col justify-around gap-10 bg-gray-400;
	}
</style>
