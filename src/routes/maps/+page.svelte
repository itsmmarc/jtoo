<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { settings, items } from '$lib/storage.svelte';
	import { fade, slide } from 'svelte/transition';
	import { messages } from '$lib/websocket.svelte';
	import { type PickBansSessionStateEvent } from '$lib/websocket-types';
	import type { Attachment } from 'svelte/attachments';

	let progress = 0;
	let increment = 0;
	let timeout: NodeJS.Timeout;

	const turnTimer: Attachment = () => {
		clearTimeout(timeout);
		progress = 0;

		let m: PickBansSessionStateEvent =
			messages.current.mapPicks[messages.current.mapPicks.length - 1];

		if (m && m.session?.config.turnTimeLimitSeconds) {
			let timelimit = (m.session.config.turnTimeLimitSeconds + 2) * 1000;
			let fps = 30;
			let interval = 1000 / fps;
			increment = (interval / timelimit) * 100;

			timeout = setInterval(timer, interval);
		}
	};
	function timer() {
		progress += increment;
		if (progress > 100) {
			progress = 0;
		}
	}
	console.log(messages.current);
</script>

<!-- isolated border filter -->
<div class="border-b-4 border-ctp-lavender/50" style:filter={getFiltersStyle()}></div>

<section class="relative z-20 m-auto flex w-full flex-col justify-center gap-10 p-4">
	{#if settings.current.enableGradient}
		<!-- gradients -->
		{#if settings.current.enableTeamColors}
			<div
				class="absolute top-0 left-0 size-full bg-linear-to-r from-ctp-blue/35 via-black/35 to-ctp-red/35"
			></div>
		{:else}
			<div
				class="absolute top-0 left-0 size-full bg-linear-to-r from-ctp-lavender/35 via-black/35 to-ctp-lavender/35"
				style:filter={getFiltersStyle()}
			></div>
		{/if}
	{:else}
		<!-- transparent black bg -->
		<div class="absolute top-0 left-0 size-full bg-black/35"></div>
	{/if}
	<section class="flex flex-wrap justify-around gap-5 p-10">
		{#each Object.entries(items.current.maps) as [key, map], i (i)}
			{#if key !== 'null'}
				{@const m: PickBansSessionStateEvent | null = messages.current.mapPicks ? messages.current.mapPicks[messages.current.mapPicks.length - 1] : null}
				<div class="@container relative mb-2 h-80 w-160 text-4xl">
					{#if m && 'session' in m && m.session}
						{#each m.session.history as step, i (i)}
							{#if step.mapId == map.ID}
								<div
									transition:fade|global
									class="absolute top-0 right-0 -z-1 h-full w-full rounded-xl bg-linear-to-tr
                                                                {step.action == 'pick'
										? 'from-[#06d641a5] via-[#53c35823] to-[#bfefc10f] mix-blend-hard-light'
										: 'from-[#cd130acc] via-[#250101b5] to-[#18000065] mix-blend-soft-light'}"
								></div>
								<img
									transition:slide|global={{ axis: 'x' }}
									src={step.actor == 'A'
										? m.session.playerA.avatarUrl
										: m.session.playerB.avatarUrl}
									alt=""
									class="absolute bottom-4 left-4 size-24 rounded-xl object-cover object-center"
									draggable="false"
								/>
								{#if step.action == 'ban'}
									<div
										class="absolute top-0 right-0 -z-2 h-full w-full rounded-xl bg-[#0e0e0e] opacity-90 mix-blend-hue"
									></div>
								{/if}
							{/if}
						{/each}
					{/if}
					<h1
						class="absolute top-0 right-0 w-full p-2 text-center"
						style:filter={getFiltersStyle()}
					>
						{key}
					</h1>
					<div
						class="absolute top-0 right-0 -z-1 h-full w-full rounded-xl bg-linear-to-t from-transparent via-transparent to-[#000000d0]"
					></div>
					{#if map.imageURL}
						<img
							in:fade
							src={map.imageURL}
							alt=""
							class="absolute -z-10 h-full w-full rounded-xl object-cover"
							draggable="false"
						/>
					{/if}
				</div>
			{/if}
		{/each}
	</section>
	<section class="m-auto flex w-[90%] flex-col gap-3 self-center pb-3">
		{#if messages.current.mapPicks && messages.current.mapPicks[messages.current.mapPicks.length - 1]}
			{@const m: PickBansSessionStateEvent = messages.current.mapPicks[messages.current.mapPicks.length - 1]}
			{#if m && 'session' in m && m.session}
				{@const step = m.session.steps[m.session.currentStepIndex]}
				{#if step}
					<div class="text-4xl">
						{step.actor == 'A' ? m.session.playerA.displayName : m.session.playerB.displayName} is {step.action ==
						'pick'
							? 'picking'
							: 'banning'}
					</div>
					<div
						{@attach turnTimer}
						class="h-5 rounded-xl bg-ctp-lavender"
						style="width: {progress}%; {getFiltersStyle()}"
					></div>
				{/if}
			{/if}
		{/if}
	</section>
</section>
