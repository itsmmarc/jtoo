<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	let copied = $state({});
	let baseUrl = page.url;
</script>

<main class="mt-20 mb-20 flex flex-col items-center gap-10 self-center">
	<div>
		<h1 class="text-center text-8xl">Jump Fortress Playoffs 2026 Overlay</h1>
	</div>
	<div>
		<h2 class="mb-2 text-center text-3xl">Docks</h2>
		<hr class="mb-0.5 h-0.5 w-full border-none bg-obs-padding" />
		<ul class="mb-5 list-decimal italic">
			<li>in OBS, navigate to Docks -> Custom Browser Docks</li>
			<li>add controls url</li>
		</ul>
		{@render URLButton('controls', 'controls')}
	</div>
	<div>
		<h2 class="mb-2 text-center text-3xl">Overlays</h2>
		<hr class="mb-0.5 h-0.5 w-full border-none bg-obs-padding" />
		<ul class="m-auto mb-5 w-fit list-decimal italic">
			<li>in OBS, navigate to Sources -> Add Source -> Browser</li>
			<li>add overlay url</li>
			<li>set width to 1920 and height to 1080</li>
			<li>remove Custom CSS</li>
			<li>repeat steps 2-4 for each overlay</li>
		</ul>
		<div class="flex gap-5 pb-10">
			{@render URLButton('match', 'overlay')}
			{@render URLButton('maps', 'maps')}
			{@render URLButton('player cards', 'playercards')}
		</div>
		<div class="flex justify-center gap-5">
			{@render URLButton('bracket', 'bracket')}
			{@render URLButton('thanks', 'thanks')}
		</div>
	</div>
</main>

{#snippet URLButton(name: string, pageUrl: string)}
	<div class="relative flex flex-col items-center gap-5">
		<a href={resolve(`/${pageUrl}`)}>
			<button
				class="button border-ctp-lavender-950/50 bg-ctp-lavender/35 p-1 px-5 text-4xl hover:bg-ctp-lavender/85"
			>
				{name}
			</button>
		</a>
		<button
			class="button-remove p-1 px-5 text-2xl"
			onmousedown={(e) => {
				let url = e.currentTarget.innerText;
				navigator.clipboard.writeText(url);
				copied[name] = url;
			}}
			onmouseup={() => {
				copied[name] = '';
			}}
		>
			{baseUrl}{pageUrl}
		</button>
		{#if copied[name]}
			<div class="absolute -bottom-5" out:fade={{ duration: 3000 }}>copied url to clipboard</div>
		{/if}
	</div>
{/snippet}
