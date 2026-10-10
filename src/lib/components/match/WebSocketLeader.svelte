<script lang="ts">
	import { settings } from '$lib/storage.svelte';
	import { KSNWebSocket } from '$lib/websockets/ksn/ws-ksn.svelte';
	import { getPlayer } from '$lib/util';
	import { fade } from 'svelte/transition';
	import { getContext } from 'svelte';

	let ksnWs: KSNWebSocket = getContext('ksnWs');

	type Props = { class?: string };
	let { class: styleClass }: Props = $props();

	const maxNameLength = 12;
</script>

<div class="{styleClass}  mt-2 w-fit {settings.current.font}">
	{#if ksnWs.timer.leader}
		{@const leader = getPlayer(ksnWs.timer.leader)}
		{@const leaderTimer = ksnWs.timer.getPlayerTimer(ksnWs.timer.leader)}
		<div class="text-center text-xl opacity-70">leader</div>
		<div class="flex items-center gap-4 text-3xl">
			<div>
				<img
					in:fade
					src={leader.avatarURL}
					alt=""
					class="size-13 rounded-xl object-cover object-center"
					draggable="false"
				/>
			</div>
			<div>
				{leader.name.length > maxNameLength
					? leader.name.substring(0, maxNameLength) + '...'
					: leader.name.substring(0, maxNameLength)}
			</div>
			<div class={settings.current.monoFont}>
				{leaderTimer?.prCs ? leaderTimer.prFormatted : ''}
			</div>
		</div>
	{/if}
</div>
