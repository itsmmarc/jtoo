<script lang="ts">
	import { overlay, settings } from '$lib/storage.svelte';

	import MatchScene from '$lib/scenes/MatchScene.svelte';
	import MapScene from '$lib/scenes/MapScene.svelte';
	import BracketScene from '$lib/scenes/BracketScene.svelte';
	import PlayerCardScene from '$lib/scenes/PlayerCardScene.svelte';
	import PlayerListScene from '$lib/scenes/PlayerListScene.svelte';
	import ThanksScene from '$lib/scenes/ThanksScene.svelte';
	import TournamentInfoScene from '$lib/scenes/TournamentInfoScene.svelte';
	import { OverlayScenes, type OverlayScene } from '$lib/types';

	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { setContext } from 'svelte';

	let ksnWs = $state(new KSNWebSocket());
	setContext('ksnWs', ksnWs);

	if (settings.current.ksnWebSocketToken) {
		ksnWs.connect(settings.current.ksnWebSocketToken);
	}
	for (const p of overlay.current.players) {
		if (p) ksnWs.timer.verifyPlayerAdded(p);
	}

	let sceneComponents: Record<Exclude<OverlayScene, ''>, any> = {
		MatchScene,
		MapScene,
		BracketScene,
		PlayerCardScene,
		PlayerListScene,
		ThanksScene,
		TournamentInfoScene
	};

	let page = $derived(settings.current.overlayScene);
</script>

{#each OverlayScenes as scene, i (i)}
	{#if scene && page == scene}
		{@const SvelteComponent = sceneComponents[scene]}
		<SvelteComponent />
	{/if}
{/each}
