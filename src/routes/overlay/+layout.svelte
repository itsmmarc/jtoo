<script lang="ts">
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import grain from '$lib/assets/grain.gif';
	import grid from '$lib/assets/grid.png';
	import { settings } from '$lib/storage.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex h-screen w-full flex-col overflow-hidden {settings.current.font}">
	{@render children()}

	{#if settings.current.enableMovingBG}
		<!-- grid mask -->
		<div
			class="absolute size-full animate-[movingMaskBG_20s_linear_infinite] opacity-100"
			style:mask-image="url({grid})"
		>
			<!-- grain -->
			<div class="absolute size-full opacity-15" style:background-image="url({grain})"></div>
		</div>
	{/if}
</div>
