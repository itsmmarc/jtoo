<script lang="ts">
	import { leftTimer, rightTimer, resetTimer, resetPulse, csToTime } from '$lib/websocket.svelte';
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
		if (leftTimer.timer_start) {
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
		if (rightTimer.timer_start) {
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
		if (leftTimer.timer_stop) {
			leftCs = 0;
		}
	});

	$effect(() => {
		if (rightTimer.timer_stop) {
			rightCs = 0;
		}
	});
</script>

<div class="absolute flex h-32 w-full items-center justify-center gap-36">
	<span
		class="{!leftTimer.timer_start
			? 'text-palewhite/40'
			: 'text-palewhite'} font-chivomono text-center text-5xl transition-colors duration-1000"
		>{!leftTimer.timer_finish ? leftTime : csToTime(Math.trunc(leftTimer.finishTime * 100))}</span
	>
	<span
		class="{!rightTimer.timer_start
			? 'text-palewhite/40'
			: 'text-palewhite'} font-chivomono text-center text-5xl transition-colors duration-1000"
		>{!rightTimer.timer_finish
			? rightTime
			: csToTime(Math.trunc(rightTimer.finishTime * 100))}</span
	>
</div>
