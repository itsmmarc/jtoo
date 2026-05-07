<script lang="ts">
	import { settings, type Settings } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		desc: string;
		setting: keyof Settings;
	};

	let { desc, setting }: Props = $props();
</script>

<label transition:slide|global>
	<input
		class="peer size-4 accent-ctp-lavender"
		type="checkbox"
		bind:checked={settings.current[setting] as boolean}
	/>
	<span class="peer-not-checked:text-ctp-text/50">{desc}</span>
</label>
