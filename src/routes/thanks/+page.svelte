<script lang="ts">
	import { settings } from '$lib/storage.svelte';
	import { team, type Member } from './team.svelte';
</script>

<section class="{settings.current.font} grid grid-cols-12 text-center text-3xl">
	<h1 class="col-span-full mt-5 text-center text-5xl">Thanks to the Jump Fortress team!</h1>
	<div class="col-span-5 m-10 mt-0 grid auto-rows-min grid-cols-5 gap-x-12 gap-y-4">
		<h2>Casters</h2>
		{#each team.casters as member, i (i)}
			{@render TeamMember(member)}
		{/each}
	</div>

	<div class="col-span-7 row-span-2 m-10 mt-0 grid auto-rows-min grid-cols-6 gap-3">
		<h2>Team</h2>
		<div class="col-span-full">
			{@render TeamMember(team.shanks, 'h-30 w-30')}
		</div>
		{#each team.team as member, i (i)}
			{@render TeamMember(member)}
		{/each}
	</div>

	<div class="col-span-5 m-10 mt-0 grid auto-rows-min grid-cols-4 gap-x-12 gap-y-4">
		<h2>Special Thanks</h2>
		{#each team.specialThanks as member, i (i)}
			{@render TeamMember(member)}
		{/each}
	</div>
</section>

{#snippet TeamMember(member: Member, size?: string)}
	<div class="flex grow flex-col items-center gap-1">
		<img
			class="{size ? size : 'h-25 w-25'} rounded-2xl object-cover"
			src={member.image}
			alt={member.name}
		/>
		<span>{member.name}</span>
	</div>
{/snippet}

<style>
	@import 'tailwindcss';

	.grid > h2 {
		@apply col-span-full;
	}
	.flex > h2 {
		@apply w-full;
	}
</style>
