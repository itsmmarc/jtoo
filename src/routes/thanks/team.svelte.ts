import ADJ from '$lib/assets/jump-fortress-team/adj.png';
import blank from '$lib/assets/jump-fortress-team/blank.png';
import c00kie from '$lib/assets/jump-fortress-team/c00kie.png';
import charlie from '$lib/assets/jump-fortress-team/charlie.png';
import digital from '$lib/assets/jump-fortress-team/digital.png';
import Else from '$lib/assets/jump-fortress-team/else.png';
import goth from '$lib/assets/jump-fortress-team/goth.png';
import hiei from '$lib/assets/jump-fortress-team/hiei.png';
import ixam from '$lib/assets/jump-fortress-team/ixam.png';
import jbrns from '$lib/assets/jump-fortress-team/jbrns.png';
import jessica from '$lib/assets/jump-fortress-team/jessica.png';
import kingstripes from '$lib/assets/jump-fortress-team/kingstripes.png';
import lily from '$lib/assets/jump-fortress-team/lily.png';
import mmarc from '$lib/assets/jump-fortress-team/mmarc.jpg';
import NVG from '$lib/assets/jump-fortress-team/nvg.png';
import omega from '$lib/assets/jump-fortress-team/omega.png';
import resin from '$lib/assets/jump-fortress-team/resin.png';
import sandman from '$lib/assets/jump-fortress-team/sandman.png';
import shadowoflight from '$lib/assets/jump-fortress-team/shadowoflight.png';
import shanks from '$lib/assets/jump-fortress-team/shanks.png';
import star from '$lib/assets/jump-fortress-team/star.png';
import stoneflower from '$lib/assets/jump-fortress-team/stoneflower.png';
import tev from '$lib/assets/jump-fortress-team/tev.png';
import vice from '$lib/assets/jump-fortress-team/vice.png';
import zag from '$lib/assets/jump-fortress-team/zag.png';
import warped from '$lib/assets/jump-fortress-team/warped.jpg';
import matty from '$lib/assets/jump-fortress-team/matty.jpg';
import pmittens from '$lib/assets/jump-fortress-team/pmittens.jpg';
import steve from '$lib/assets/jump-fortress-team/steve.jpg';
import wild_rumpus from '$lib/assets/jump-fortress-team/wild_rumpus.jpg';
import m879 from '$lib/assets/jump-fortress-team/879m.jpg';
import zike from '$lib/assets/jump-fortress-team/zike.jpg';
import kendrick from '$lib/assets/jump-fortress-team/kendrick.jpg';
import sgt from '$lib/assets/jump-fortress-team/sgt.jpg';

import momentummod from '$lib/assets/jump-fortress-team/special-thanks/momentum-mod.png';
import essentialstf from '$lib/assets/jump-fortress-team/special-thanks/essentialstf.jpg';
import obsidiian from '$lib/assets/jump-fortress-team/special-thanks/obsidiian.jpg';
import tempus from '$lib/assets/jump-fortress-team/special-thanks/tempus.webp';
import b4nny from '$lib/assets/jump-fortress-team/special-thanks/b4nny.jpg';
import htwo from '$lib/assets/jump-fortress-team/special-thanks/htwo.jpg';
import sourceruns from '$lib/assets/jump-fortress-team/special-thanks/sourceruns.png';

export type Member = { name: string; image: string };
export const team: { casters: Member[]; team: Member[]; specialThanks: Member[] } = {
	casters: [
		{ name: 'zagrfige', image: zag },
		{ name: 'tev', image: tev },
		{ name: 'pmittens', image: pmittens },
		{ name: 'warped', image: warped },
		{ name: 'matty', image: matty },
		{ name: 'steve', image: steve },
		{ name: 'wild_rumpus', image: wild_rumpus },
		{ name: '879m', image: m879 },
		{ name: 'zike1017', image: zike }
	],
	team: [
		{ name: 'Shanks', image: shanks },
		{ name: 'resin', image: resin },
		{ name: 'mmarc', image: mmarc },
		{ name: 'kingstripes', image: kingstripes },

		{ name: 'kendrick', image: kendrick },
		{ name: 'goth', image: goth },
		{ name: 'shadowoflight', image: shadowoflight },
		{ name: 'jbrns', image: jbrns },
		{ name: 'sgt Bytheway', image: sgt },
		{ name: 'zagrfige', image: zag },
		{ name: 'sandman', image: sandman },
		{ name: 'c00kie', image: c00kie },
		{ name: 'charlie', image: charlie },
		{ name: 'digital', image: digital },
		{ name: 'Else', image: Else },
		{ name: 'ixam', image: ixam },
		{ name: 'lily', image: lily },
		{ name: 'omega', image: omega },
		{ name: 'star', image: star },
		{ name: 'blank', image: blank },
		{ name: 'matty', image: matty },
		{ name: 'jessica', image: jessica },
		{ name: 'ADJ', image: ADJ },
		{ name: 'tev', image: tev },
		{ name: 'NVG', image: NVG },
		{ name: 'stoneflower', image: stoneflower },
		{ name: 'hiei', image: hiei },
		{ name: 'vice', image: vice }
	],
	specialThanks: [
		{ name: 'Tempus', image: tempus },
		{ name: 'Momentum Mod', image: momentummod },
		{ name: 'EssentialsTF', image: essentialstf },
		{ name: 'SourceRuns', image: sourceruns },
		{ name: 'b4nny', image: b4nny },
		{ name: 'htwo', image: htwo },
		{ name: 'obsidiian', image: obsidiian }
	]
};
