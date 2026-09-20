<script lang="ts">
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { getContext } from 'svelte';
	import type { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { KSN } from '$lib/websockets/ksn/ws-ksn-types';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	let progress = $state(0);
	let increment = 0;
	let timeout: NodeJS.Timeout;

	$effect(() => {
		clearTimeout(timeout);
		progress = 0;

		let m: KSN.PickBansSessionStateEvent = ksnWs.messages.mapPicks;

		if (m && m.session?.config.turnTimeLimitSeconds) {
			let timelimit = (m.session.config.turnTimeLimitSeconds + 2) * 1000;
			let fps = 30;
			let interval = 1000 / fps;
			increment = (interval / timelimit) * 100;

			timeout = setInterval(timer, interval);
		}
	});

	function timer() {
		progress += increment;
		if (progress > 100) {
			progress = 0;
		}
	}
</script>

<section class="m-auto flex w-[90%] flex-col gap-3 self-center pb-3">
	{#if ksnWs.messages.mapPicks}
		{@const m: KSN.PickBansSessionStateEvent = ksnWs.messages.mapPicks}
		{#if m && 'session' in m && m.session}
			{@const step = m.session.steps[m.session.currentStepIndex]}
			{#if step}
				{@const playerName =
					step.actor == 'A' ? m.session.playerA.displayName : m.session.playerB.displayName}
				<div class="text-4xl">
					{playerName} is {step.action == 'pick' ? 'picking' : 'banning'}
				</div>
				<div
					class="h-5 rounded-xl bg-ctp-lavender"
					style="width: {progress}%; {getFiltersStyle()}"
				></div>
			{/if}
		{/if}
	{/if}
</section>
