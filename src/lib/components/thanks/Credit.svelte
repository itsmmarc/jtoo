<script>
	let { credit, size = 'lg' } = $props();
</script>

{#if size === 'xl'}
	<div class=" flex items-center gap-2 text-4xl text-shadow-none">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img class="size-28 rounded-xl" src={credit.avatar} />
		<span>{credit.alias}</span>
	</div>
{:else if size === 'lg'}
	<div class="flex items-center gap-2 text-3xl text-shadow-none">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img class="size-24 rounded-xl" src={credit.avatar} />
		<span>{credit.alias}</span>
	</div>
{:else if size === 'md'}
	<div class="flex items-center gap-2 text-3xl text-shadow-none">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img class="size-18 rounded-lg" src={credit.avatar} />
		<span>{credit.alias}</span>
	</div>
{:else}
	<div class="flex items-center gap-2 text-2xl text-shadow-none">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img class="size-12 rounded-md" src={credit.avatar} />
		<span>{credit.alias}</span>
	</div>
{/if}
