<script lang="ts">
	import { timer, resetTimer, resetPulse, csToTime } from '$lib/websocket.svelte';
	import { settings } from '$lib/storage.svelte';
	let leftCs = $state(0);
	let rightCs = $state(0);
	let leftTime = $derived(csToTime(leftCs));
	let rightTime = $derived(csToTime(rightCs));
	const updateInterval = 77;

	$effect(() => {
		if (resetPulse.state) {
			leftCs = 0;
			rightCs = 0;
			resetTimer('left');
			resetTimer('right');
			resetPulse.state = false;
		}
	});

	$effect(() => {
		// run is ongoing
		if (timer.current.left.timer_start) {
			const startDate = Math.floor(Date.now() / 10);
			const leftTimer = setInterval(() => {
				leftCs = Math.floor(Date.now() / 10 - startDate);
			}, updateInterval);

			return () => {
				clearInterval(leftTimer);
			};
		}
	});

	$effect(() => {
		// run is ongoing
		if (timer.current.right.timer_start) {
			const startDate = Date.now() / 10;
			const rightTimer = setInterval(() => {
				rightCs = Math.floor(Date.now() / 10 - startDate);
			}, updateInterval);

			return () => {
				clearInterval(rightTimer);
			};
		}
	});

	$effect(() => {
		if (timer.current.left.timer_stop) {
			leftCs = 0;
		}
	});

	$effect(() => {
		if (timer.current.right.timer_stop) {
			rightCs = 0;
		}
	});
</script>

<div
	class="absolute flex h-32 w-full items-center justify-center gap-80 {settings.current.monoFont}"
>
	<span
		class="{!timer.current.left.timer_start
			? 'text-palewhite/40'
			: 'text-palewhite'} font-chivomono text-center text-5xl transition-colors duration-1000"
		>{!timer.current.left.timer_finish
			? leftTime
			: csToTime(Math.trunc(timer.current.left.finishTime * 100))}</span
	>
	<span
		class="{!timer.current.right.timer_start
			? 'text-palewhite/40'
			: 'text-palewhite'} font-chivomono text-center text-5xl transition-colors duration-1000"
		>{!timer.current.right.timer_finish
			? rightTime
			: csToTime(Math.trunc(timer.current.right.finishTime * 100))}</span
	>
	<div class="absolute top-5 flex flex-col">
		{#if timer.current.competition.timeLeftSeconds > 0}
			<div class="text-palewhite/40 text-center text-5xl">
				{csToTime(Math.trunc(timer.current.competition.timeLeftSeconds * 100))}
			</div>
		{/if}
		{#if timer.current.competition.overtime}
			<div class="text-palewhite/40 text-center text-4xl">OVERTIME</div>
		{/if}
	</div>
</div>
