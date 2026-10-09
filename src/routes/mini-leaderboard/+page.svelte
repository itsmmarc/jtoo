<script lang="ts">
	import MiniLeaderboard from '$lib/components/match/MiniLeaderboard.svelte';
	import { overlay, settings } from '$lib/storage.svelte';

	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { onMount, setContext, type Component } from 'svelte';

	let ksnWs: KSNWebSocket | undefined = $state();

	onMount(() => {
		ksnWs = new KSNWebSocket('ksnWs');
		setContext('ksnWs', ksnWs);

		if (settings.current.ksnWebSocketToken) {
			ksnWs.connect(settings.current.ksnWebSocketToken);
		}
		for (const p of overlay.current.players) {
			if (p) ksnWs.timer.verifyPlayerAdded(p);
		}
	});
</script>

{#if ksnWs}
	<MiniLeaderboard />
{/if}
