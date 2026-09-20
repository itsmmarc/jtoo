<script lang="ts">
	import _ from 'underscore';
	import { v4 as uuidv4 } from 'uuid';

	type Props = {
		opts: any[];
		labelkey?: string | string[];
		optlabels?: string[];
		value: any;
		log?: boolean;
		onchange?: Function;
	};
	let { opts, labelkey, optlabels, log = false, value = $bindable(), onchange }: Props = $props();

	let name = uuidv4();

	function onSelect() {
		if (log) console.log(`${name}: ${value}`);

		if (onchange) onchange();
	}

	function getOptionLabel(opt: any, labelkey: string | string[] | undefined, index: number) {
		if (optlabels && optlabels.length > index) {
			return optlabels[index];
		}
		if (typeof labelkey == 'undefined') {
			return opt;
		}

		if (typeof labelkey == 'string' && labelkey in opt) {
			return opt[labelkey];
		}

		if (labelkey.constructor === Array) {
			const numKeys = labelkey.length;
			let optLabel = { ...opt };

			for (let i = 0; i < numKeys; i++) {
				if (!(labelkey[i] in optLabel)) {
					return opt;
				}
				optLabel = optLabel[labelkey[i]];

				if (i + 1 == numKeys) {
					return optLabel;
				}
			}
		}
	}
</script>

<div class="button-container">
	{#each opts as opt, i (i)}
		{@render RadioButton(opt, i)}
	{/each}
</div>

{#snippet RadioButton(opt: any, index: number)}
	{@const optlabel = getOptionLabel(opt, labelkey, index)}
	<label
		class="button button-unselected flex cursor-pointer flex-col select-none has-checked:border-ctp-lavender-950 has-checked:bg-ctp-lavender
                {labelkey && _.isEqual(opt, value)
			? 'border-ctp-lavender-950 bg-ctp-lavender'
			: ''}"
	>
		<input
			type="radio"
			class="hidden"
			id={optlabel}
			{name}
			bind:group={value}
			value={opt}
			onchange={() => {
				onSelect();
			}}
		/>
		{optlabel === '' ? '✖' : optlabel}
	</label>
{/snippet}
