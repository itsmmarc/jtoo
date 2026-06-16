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
import owlfy from '$lib/assets/jump-fortress-team/owlfy.png';
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
import cier from '$lib/assets/jump-fortress-team/cier.jpg';
import metalcloud from '$lib/assets/jump-fortress-team/metalcloud.jpg';
import overpovered from '$lib/assets/jump-fortress-team/overpovered.jpg';

import momentummod from '$lib/assets/jump-fortress-team/special-thanks/momentum-mod.png';
import essentialstf from '$lib/assets/jump-fortress-team/special-thanks/essentialstf.jpg';
import obsidiian from '$lib/assets/jump-fortress-team/special-thanks/obsidiian.jpg';
import tempus from '$lib/assets/jump-fortress-team/special-thanks/tempus.webp';
import b4nny from '$lib/assets/jump-fortress-team/special-thanks/b4nny.jpg';
import htwo from '$lib/assets/jump-fortress-team/special-thanks/htwo.jpg';
import sourceruns from '$lib/assets/jump-fortress-team/special-thanks/sourceruns.png';
import passfortress from '$lib/assets/jump-fortress-team/special-thanks/passfortress.jpg';
import rtf2 from '$lib/assets/jump-fortress-team/special-thanks/rtf2.webp';
import plaza from '$lib/assets/jump-fortress-team/special-thanks/plaza.webp';
import steam from '$lib/assets/jump-fortress-team/special-thanks/steam.png';
import tftv from '$lib/assets/jump-fortress-team/special-thanks/tftv.png';

export type Member = { name: string; image: string };
export const team: { casters: Member[]; shanks: Member; team: Member[]; specialThanks: Member[] } =
	{
		casters: [
			{ name: 'Zagrfige', image: zag },
			{ name: 'tev', image: tev },
			{ name: 'pmittens', image: pmittens },
			{ name: 'Warped', image: warped },
			{ name: 'Matty', image: matty },
			{ name: 'Steve', image: steve },
			{ name: 'Wild_Rumpus', image: wild_rumpus },
			{ name: '879m', image: m879 },
			{ name: 'Zike1017', image: zike }
		],
		shanks: { name: 'Shanks', image: shanks },
		team: [
			{ name: 'resin', image: resin },
			{ name: 'mmarc', image: mmarc },
			{ name: 'Kingstripes', image: kingstripes },

			{ name: 'Kendrick', image: kendrick },
			{ name: 'goth', image: goth },
			{ name: 'ShadowOfLight', image: shadowoflight },
			{ name: 'Jbrns♡', image: jbrns },
			{ name: 'sgt Bytheway', image: sgt },
			{ name: 'Zagrfige', image: zag },
			{ name: 'Sandman', image: sandman },
			{ name: 'c00kie', image: c00kie },
			{ name: 'Charlie', image: charlie },
			{ name: 'Digital', image: digital },
			{ name: 'Else', image: Else },
			{ name: 'ixam', image: ixam },
			{ name: 'lily', image: lily },
			{ name: 'omega', image: omega },
			{ name: 'Star', image: star },
			{ name: 'BLANK', image: blank },
			{ name: 'Matty', image: matty },
			{ name: 'Owlfy', image: owlfy },
			{ name: 'ADJ', image: ADJ },
			{ name: 'tev', image: tev },
			{ name: 'NVG', image: NVG },
			{ name: 'stoneflower', image: stoneflower },
			{ name: 'hiei', image: hiei },
			{ name: 'vice', image: vice },
			{ name: 'MetalCloud', image: metalcloud },
			{ name: 'Cier', image: cier },
			{ name: 'OverPovered', image: overpovered }
		],
		specialThanks: [
			{ name: 'Tempus Network', image: tempus },
			{ name: 'Momentum Mod', image: momentummod },
			{ name: 'EssentialsTF', image: essentialstf },
			{ name: 'Tempus Plaza', image: plaza },
			{ name: 'Pass Fortress', image: passfortress },
			{ name: 'r/tf2', image: rtf2 },
			{ name: 'TFTV', image: tftv },
			{ name: 'SourceRuns', image: sourceruns },
			{ name: 'b4nny', image: b4nny },
			{ name: 'Htwo', image: htwo },
			{ name: 'obsidiian', image: obsidiian },
			{ name: 'Steam', image: steam }
		]
	};
