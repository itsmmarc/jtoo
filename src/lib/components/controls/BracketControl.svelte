<script lang="ts">
	import { clearMatchWinner, setMatchWinner, type Match } from '$lib/Bracket.svelte';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { items, settings, overlay } from '$lib/storage.svelte';
	import { fade, slide } from 'svelte/transition';

	type Coordinate = { x: number; y: number };
</script>

{#if items.current.bracket}
	{#if items.current.bracket.type == 8}
		<section class="m-auto">
			<div class=" flex flex-col gap-20">
				{#if overlay.current.bracket == 'whole' || overlay.current.bracket == 'upper'}
					<div class="flex gap-40" in:fade>
						<h2
							class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
							style:filter={getFiltersStyle()}
						>
							Upper Bracket
						</h2>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Quarter Finals</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.QuarterFinals as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Semi Finals</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.SemiFinals as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.Final as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Grand Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.GrandFinal as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						{#key overlay.current.bracket}
							{@const col1r = 240}
							{@const col2l = 400}
							{@const col2r = 640}
							{@const col3l = 800}
							{@const col3r = 1040}
							{@const col4l = 1200}

							{@const row1 = 108}
							{@const row2 = 181}
							{@const row3 = 252}
							{@const row4 = 323}
							{@const row5 = 396}
							{@const row6 = 467}
							{@const row7 = 541}

							<svg
								width="1200"
								height="550"
								class="absolute -z-1 w-[80%]"
								style:filter={getFiltersStyle()}
							>
								{@render Path({ x: col1r, y: row1 }, { x: col2l, y: row2 }, 'down')}
								{@render Path({ x: col1r, y: row3 }, { x: col2l, y: row2 }, 'up')}

								{@render Path({ x: col1r, y: row5 }, { x: col2l, y: row6 }, 'down')}
								{@render Path({ x: col1r, y: row7 }, { x: col2l, y: row6 }, 'up')}

								{@render Path({ x: col2r, y: row2 }, { x: col3l, y: row4 }, 'down')}
								{@render Path({ x: col2r, y: row6 }, { x: col3l, y: row4 }, 'up')}

								{@render Path({ x: col3r, y: row4 }, { x: col4l, y: row4 })}
							</svg>
						{/key}
					</div>
				{/if}
				{#if overlay.current.bracket == 'whole' || overlay.current.bracket == 'lower'}
					<div class="flex gap-40" in:fade>
						<h2
							class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
							style:filter={getFiltersStyle()}
						>
							Lower Bracket
						</h2>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Round 1</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Lower.Round1 as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Quarter Finals</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Lower.QuarterFinals as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Semi Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Lower.SemiFinal as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Lower.Final as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						{#key overlay.current.bracket}
							{@const col1r = 240}
							{@const col2l = 400}
							{@const col2r = 640}
							{@const col3l = 800}
							{@const col3r = 1040}
							{@const col4l = 1200}

							{@const row1 = 109}
							{@const row2 = 179}
							{@const row3 = 252}

							<svg
								width="1200"
								height="260"
								class="absolute -z-1 w-[80%]"
								style:filter={getFiltersStyle()}
							>
								{@render Path({ x: col1r, y: row1 }, { x: col2l, y: row1 })}

								{@render Path({ x: col1r, y: row3 }, { x: col2l, y: row3 })}

								{@render Path({ x: col2r, y: row1 }, { x: col3l, y: row2 }, 'down')}
								{@render Path({ x: col2r, y: row3 }, { x: col3l, y: row2 }, 'up')}

								{@render Path({ x: col3r, y: row2 }, { x: col4l, y: row2 })}
							</svg>
						{/key}
					</div>
				{/if}
			</div>
		</section>
	{:else if items.current.bracket.type == 4}
		<section class="m-auto">
			<div class=" flex flex-col gap-20">
				{#if overlay.current.bracket == 'whole' || overlay.current.bracket == 'upper'}
					<div class="flex gap-40" in:fade>
						<h2
							class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
							style:filter={getFiltersStyle()}
						>
							Upper Bracket
						</h2>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Quarter Finals</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.QuarterFinals as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Semi Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.SemiFinal as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Grand Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Upper.GrandFinal as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						{#key overlay.current.bracket}
							{@const col1r = 240}
							{@const col2l = 400}
							{@const col2r = 640}
							{@const col3l = 800}

							{@const row1 = 108}
							{@const row2 = 181}
							{@const row3 = 252}

							<svg
								width="800"
								height="255"
								class="absolute -z-1 w-[50%]"
								style:filter={getFiltersStyle()}
							>
								{@render Path({ x: col1r, y: row1 }, { x: col2l, y: row2 }, 'down')}
								{@render Path({ x: col1r, y: row3 }, { x: col2l, y: row2 }, 'up')}

								{@render Path({ x: col2r, y: row2 }, { x: col3l, y: row2 })}
							</svg>
						{/key}
					</div>
				{/if}
				{#if overlay.current.bracket == 'whole' || overlay.current.bracket == 'lower'}
					<div class="flex gap-40" in:fade>
						<h2
							class="-ml-40 max-w-0 translate-x-30 translate-y-10 rotate-180 text-3xl [writing-mode:vertical-lr]"
							style:filter={getFiltersStyle()}
						>
							Lower Bracket
						</h2>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Semi Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Lower.SemiFinal as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						<div class="flex flex-col">
							<h2 class="text-3xl" style:filter={getFiltersStyle()}>Final</h2>
							<div class="grid grow">
								<div class="stage-container">
									{#each items.current.bracket.Lower.Final as match, i (i)}
										{@render Match(match)}
									{/each}
								</div>
								<div class="background" style:filter={getFiltersStyle()}></div>
							</div>
						</div>
						{#key overlay.current.bracket}
							{@const col1r = 240}
							{@const col2l = 400}

							{@const row1 = 129}

							<svg
								width="400"
								height="130"
								class="absolute -z-1 w-[50%]"
								style:filter={getFiltersStyle()}
							>
								{@render Path({ x: col1r, y: row1 }, { x: col2l, y: row1 })}
							</svg>
						{/key}
					</div>
				{/if}
			</div>
		</section>
	{/if}
{/if}

{#snippet Path(A: Coordinate, B: Coordinate, direction?: 'up' | 'down')}
	{@const mod = direction == 'down' ? 1 : -1}
	{@const midx = A.x + (A.x - B.x) / -2}
	{@const curveRadius = 25}
	{#if direction}
		<path
			d="
                                M{A.x} {A.y} 
                                H{midx - curveRadius} 
                                a{curveRadius},{curveRadius} 0 0 {mod == 1
				? 1
				: 0} {curveRadius},{mod * curveRadius} 
                                V{B.y - mod * curveRadius} 
                                a{curveRadius},{curveRadius} 0 0 {mod == 1
				? 0
				: 1} {curveRadius},{mod * curveRadius} 
                                H{B.x}
                        "
		></path>
	{:else}
		<path
			d="
                                M{A.x} {A.y} 
                                H{midx} 
                                V{B.y} 
                                H{B.x}
                        "
		></path>
	{/if}
{/snippet}

{#snippet Match(match: Match)}
	<div class="grid">
		<div
			class="col-[1/1] row-[1/1] flex min-h-32 min-w-60 flex-col justify-between rounded-xl text-3xl"
		>
			{@render MatchPlayer(match, 'A')}
			{@render MatchPlayer(match, 'B')}
		</div>
		<div
			class="col-[1/1] row-[1/1] min-h-32 min-w-60 rounded-xl bg-linear-to-tr
                        {match.A.name && match.B.name && !match.winner
				? 'from-ctp-lavender-950 via-ctp-lavender-800 to-ctp-lavender-400'
				: 'from-[#121925] via-[bg-gray-800] to-[#202833]'} bg-gray-800"
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
			<div class="grid">
				<div class="col-[1/1] row-[1/1] flex h-full w-full items-center gap-4 p-2">
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
				<div
					class=" -z-1 col-[1/1] row-[1/1] h-full w-full bg-linear-to-tr pl-6
                                        {player == 'A' ? 'rounded-t-xl' : 'rounded-b-xl'}
                                        {match.winner
						? match.winner == player
							? 'from-[#40834a]   via-[#369455]  to-[#b2e1bd]'
							: 'from-ctp-lavender-950/60 via-ctp-lavender-900/20 to-ctp-lavender-950/10'
						: ''}"
					style:filter={getFiltersStyle()}
				></div>
			</div>
		</button>
	{/key}
{/snippet}

<style>
	@import 'tailwindcss';
	@import '@catppuccin/tailwindcss/mocha.css';
	h2 {
		@apply mb-2 text-center;
	}
	.stage-container {
		@apply col-[1/1] row-[1/1] flex h-full flex-col justify-around gap-4 rounded-xl;
	}
	.stage-container ~ .background {
		@apply -z-1 col-[1/1] row-[1/1] min-h-32 min-w-60 rounded-xl bg-gray-900/70;
	}

	svg > line {
		@apply stroke-ctp-lavender-900 stroke-2;
	}
	svg > path {
		@apply fill-none stroke-ctp-lavender-900 stroke-2;
	}
</style>
