<script>
	import Credit from '$lib/components/thanks/Credit.svelte';
	import { settings } from '$lib/storage.svelte';

	const credits = {
		organizers: [
			{
				alias: 'Shanks',
				avatar: 'https://files.catbox.moe/1u9n42.png'
			},
			{
				alias: 'tev',
				avatar: 'https://files.catbox.moe/oey7yt.webp'
			}
		],
		production: {
			broadcaster: {
				alias: 'resin',
				avatar: 'https://files.catbox.moe/3d7oyl.png'
			},
			map_transitions: {
				alias: 'Speedy',
				avatar: 'https://files.catbox.moe/fycese.png'
			},
			trailer: [
				{
					alias: 'Kendrick',
					avatar: 'https://files.catbox.moe/k1boxq.png'
				},
				{
					alias: 'Shanks',
					avatar: 'https://files.catbox.moe/1u9n42.png'
				}
			]
		},
		exec_producers: [
			{
				alias: 'hiei',
				avatar: 'https://files.catbox.moe/9qsxfs.png'
			},
			{
				alias: 'nvg',
				avatar: 'https://files.catbox.moe/bzlf26.png'
			}
		],
		server_management: {
			alias: 'Kingstripes',
			avatar: 'https://files.catbox.moe/itziy8.png'
		},
		hud: [
			{
				alias: 'mmarc',
				avatar: 'https://files.catbox.moe/6mu9xi.png'
			},
			{
				alias: 'resin',
				avatar: 'https://files.catbox.moe/3d7oyl.png'
			}
		],
		consultants: [
			{
				alias: 'exile',
				avatar: 'https://files.catbox.moe/53o07i.png'
			},
			{
				alias: 'Ad',
				avatar: 'https://files.catbox.moe/rnqflm.png'
			},
			{
				alias: 'Charlie',
				avatar: 'https://files.catbox.moe/wssdwy.png'
			},
			{
				alias: 'Cier',
				avatar: 'https://files.catbox.moe/0w7r8a.png'
			},
			{
				alias: 'Claire',
				avatar: 'https://files.catbox.moe/2p8an4.png'
			},
			{
				alias: 'Else',
				avatar: 'https://files.catbox.moe/6qua92.png'
			},
			{
				alias: 'Goth',
				avatar: 'https://files.catbox.moe/byrbqr.png'
			},
			{
				alias: 'Grandma',
				avatar: 'https://files.catbox.moe/fscmau.png'
			},
			{
				alias: 'Kaja',
				avatar: 'https://files.catbox.moe/u1h3zv.png'
			},
			{
				alias: 'layla',
				avatar: 'https://files.catbox.moe/1ccg5d.png'
			},
			{
				alias: 'lily',
				avatar: 'https://files.catbox.moe/etl9kj.png'
			},
			{
				alias: 'Matty',
				avatar: 'https://files.catbox.moe/8hibvy.gif'
			},
			{
				alias: 'omega',
				avatar: 'https://files.catbox.moe/05xk47.png'
			},
			{
				alias: 'rellort',
				avatar: 'https://files.catbox.moe/zoh9rg.png'
			},
			{
				alias: 'sgt Bytheway',
				avatar: 'https://files.catbox.moe/7h9qj2.png'
			},
			{
				alias: 'ShadowOfLight',
				avatar: 'https://files.catbox.moe/n1r3f9.png'
			},
			{
				alias: 'Speedy',
				avatar: 'https://files.catbox.moe/fycese.png'
			},
			{
				alias: 'vice',
				avatar: 'https://files.catbox.moe/vctlnr.png'
			}
		],
		special_thanks: [
			{
				alias: 'MetalCloud',
				avatar: 'https://files.catbox.moe/pp6o2q.jpg'
			},
			{
				alias: 'Htwo',
				avatar: 'https://files.catbox.moe/spzhgr.png'
			},
			{
				alias: 'b4nny',
				avatar: 'https://files.catbox.moe/dgj7m6.png'
			},
			{
				alias: 'EssentialsTF',
				avatar: 'https://files.catbox.moe/9zitlc.png'
			},
			{
				alias: 'Momentum Mod',
				avatar: 'https://files.catbox.moe/z10rj4.png'
			},
			{
				alias: 'Fortress Faceoffs',
				avatar: 'https://files.catbox.moe/442i4v.png'
			},
			{
				alias: 'ADJ',
				avatar: 'https://files.catbox.moe/fujrx5.png'
			},
			{
				alias: 'osplo',
				avatar: 'https://files.catbox.moe/py0bvn.png'
			}
		]
	};
</script>

<div class="{settings.current.font} flex flex-col items-center gap-12 pt-8 text-center">
	<span
		class="from-lavender via-palewhite to-lavender w-full bg-linear-to-r from-25% to-75% bg-clip-text text-6xl/18 text-transparent"
		>See you next year !</span
	>

	<div class="flex w-full justify-center gap-64">
		<div class="  flex flex-col gap-2 text-center text-5xl">
			<span>Head Organizers</span>
			<div class="flex w-full flex-row justify-center gap-12">
				{#each credits.organizers as credit, i (i)}
					<Credit {credit} size="xl" />
				{/each}
			</div>
		</div>

		<div class="flex flex-col gap-2 text-center text-5xl">
			<span>Executive Producers</span>
			<div class="flex w-full flex-row justify-center gap-12">
				{#each credits.exec_producers as credit, i (i)}
					<Credit {credit} size="xl" />
				{/each}
			</div>
		</div>
	</div>

	<div class="flex flex-col items-center gap-2 text-center text-5xl">
		<span>Production</span>
		<div class="flex justify-center gap-24">
			<div class="flex flex-col items-center gap-2 text-4xl">
				<span>Broadcast</span>
				<Credit credit={credits.production.broadcaster} size="lg" />
			</div>
			<div class="flex flex-col items-center gap-2 text-4xl">
				<span>Overlay</span>
				{@render mur()}
			</div>
			<div class="flex flex-col items-center gap-2 text-4xl">
				<span>Trailer</span>
				<div class="flex h-full gap-8">
					{#each credits.production.trailer as credit, i (i)}
						<Credit {credit} size="lg" />
					{/each}
				</div>
			</div>
			<div class="flex flex-col items-center gap-2 text-4xl">
				<span>Map Transitions</span>
				<Credit credit={credits.production.map_transitions} size="lg" />
			</div>
		</div>
	</div>

	<div class="flex w-full justify-center gap-32">
		<div class="flex h-full flex-col items-center gap-2 text-center text-4xl">
			<span>Server Infrastructure</span>
			<Credit credit={credits.server_management} size="lg" />
		</div>

		<div class="flex flex-col items-center gap-2 text-center text-4xl">
			<span>Ingame HUD</span>
			<div class="flex h-full gap-8">
				{#each credits.hud as credit, i (i)}
					<Credit {credit} size="md" />
				{/each}
			</div>
		</div>
	</div>

	<div class="flex w-full justify-center gap-16">
		<div class="flex w-5/12 flex-col items-center gap-2 text-4xl">
			<span>Jump Fortress Consultants</span>
			<div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
				{#each credits.consultants as credit, i (i)}
					<Credit {credit} size="sm" />
				{/each}
			</div>
		</div>
		<div class="flex w-1/3 flex-col items-center gap-2 text-4xl">
			<span>Special Thanks 🤍</span>
			<div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
				{#each credits.special_thanks as credit, i (i)}
					<Credit {credit} size="sm" />
				{/each}
			</div>
		</div>
	</div>
</div>

{#snippet mur()}
	<div class="flex h-full items-center gap-10">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img
			class="relative scale-200 bg-auto"
			style="image-rendering: pixelated;"
			src="https://play.pokemonshowdown.com/sprites/gen5ani/zigzagoon.gif"
		/>
		<span>mur</span>
	</div>
{/snippet}
