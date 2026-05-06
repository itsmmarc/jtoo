<script lang="ts">
	import { overlay, items, settings } from '$lib/storage.svelte';
	import PlayerItemList from './PlayerItemList.svelte';

	type Props = {
		side: 'left' | 'right';
	};

	let { side }: Props = $props();
	let sideKey: 'leftPlayer' | 'rightPlayer' = $derived(
		side === 'left' ? 'leftPlayer' : 'rightPlayer'
	);

	function updateScore(s: number) {
		// whole number jic
		const score = Math.floor(s);

		// keep score in range
		if (score < 0) return;
		let newScore: number;
		const max: number = (overlay.current.bestOf + 1) / 2;
		if (score > max) {
			newScore = max;
		} else {
			newScore = score;
		}
		overlay.current[sideKey].score = newScore;
	}
</script>

<div class="flex w-full max-w-full flex-col items-start">
	<span class="self-center text-center">{side} player</span>

	<!-- score -->
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<div class="flex justify-center self-center">
		<button
			class="button rounded-r-none border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			onclick={() => {
				updateScore(overlay.current[sideKey].score - 1);
			}}><span class="icon-[mdi--minus] align-middle"></span></button
		>
		<span class="button button-selected rounded-none">{overlay.current[sideKey].score}</span>
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button
			class="button rounded-l-none border-ctp-lavender-950/50 bg-ctp-lavender/50 px-2 hover:bg-ctp-lavender/85"
			onclick={() => {
				updateScore(overlay.current[sideKey].score + 1);
			}}><span class="icon-[mdi--plus] align-middle"></span></button
		>
	</div>

	{#if settings.current.enablePRs}
		<input
			class="input mt-1 w-24 self-center"
			placeholder="pr"
			bind:value={overlay.current[sideKey].pr}
		/>
	{/if}

	<div class="flex flex-col">
		<!-- name -->
		<span>player</span>
		{#if items.current.names.length === 0}
			<span class="text-ctp-text/50">no players..</span>
		{:else}
			<PlayerItemList {sideKey} key="name" item="names" />
		{/if}

		<!-- avatars -->
		{#if settings.current.enableAvatars}
			<span>avatar</span>
			{#if items.current.avatarURLs.length === 0}
				<span class="text-ctp-text/50">no avatars..</span>
			{:else}
				<PlayerItemList {sideKey} key="avatarURL" item="avatarURLs" />
			{/if}
		{/if}

		<!-- tags -->
		{#if settings.current.enableTags}
			<span>tag</span>
			{#if items.current.tags.length === 0}
				<span class="text-ctp-text/50">no tags..</span>
			{:else}
				<PlayerItemList {sideKey} key="tag" item="tags" />
			{/if}
		{/if}

		<!-- flags -->
		<span>flag</span>
		{#if items.current.flags.length === 0}
			<span class="text-ctp-text/50">no flags..</span>
		{:else}
			<PlayerItemList {sideKey} key="flag" item="flags" />
		{/if}
	</div>
</div>
