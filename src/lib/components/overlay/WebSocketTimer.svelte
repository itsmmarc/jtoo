<script lang="ts">
	import { timer, resetTimer, resetPulse, csToTime } from '$lib/websocket.svelte';
	import { settings } from '$lib/storage.svelte';
	let leftCs = $state(0);
	let rightCs = $state(0);
	let leftTime = $derived(csToTime(leftCs));
	let rightTime = $derived(csToTime(rightCs));
	const updateInterval = 77;

	let leftTimerStart = $derived(timer.current.left.timer_start);
	let rightTimerStart = $derived(timer.current.right.timer_start);
	let leftTimerStop = $derived(timer.current.left.timer_stop);
	let rightTimerStop = $derived(timer.current.right.timer_stop);

	$effect(() => {
		console.log('$effect resetPulse.state');
		if (resetPulse.state) {
			console.log('true');
			leftCs = 0;
			rightCs = 0;
			resetTimer('left');
			resetTimer('right');
			resetPulse.state = false;
		}
	});

	$effect(() => {
		console.log('$effect timer.current.left.timer_start');
		// run is ongoing
		if (leftTimerStart) {
			console.log('true');
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
		console.log('$effect timer.current.right.timer_start');
		// run is ongoing
		if (rightTimerStart) {
			console.log('true');
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
		console.log('$effect timer.current.left.timer_stop');
		if (leftTimerStop) {
			console.log('true');
			leftCs = 0;
		}
	});

	$effect(() => {
		console.log('$effect timer.current.right.timer_stop');
		if (rightTimerStop) {
			console.log('true');
			rightCs = 0;
		}
	});
</script>

<div
	class="absolute left-0 flex h-32 w-full items-center justify-center gap-70 {settings.current
		.monoFont}"
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
				{csToTime(Math.trunc(timer.current.competition.timeLeftSeconds * 100), 'seconds')}
			</div>
		{/if}
		{#if timer.current.competition.overtime}
			<div class="text-palewhite/40 text-center text-4xl">OVERTIME</div>
		{/if}
	</div>
</div>
