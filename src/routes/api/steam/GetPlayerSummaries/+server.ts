import { Steam } from '$lib/api/steam/api-steam';
import { json } from '@sveltejs/kit';
// import { STEAM_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';




export const POST: RequestHandler = async({platform, request}) => {
	let steamApiKey = platform?.env.STEAM_API_KEY;
	const body = await request.json();
	console.log('body:');
	console.log(body);

	if (!('steamids' in body)) {
		return json({}, { status: 400 });
	}

	let idParam: string;

	if (typeof body.steamids == 'string') {
		idParam = body.steamids as string;
	} else if (Array.isArray(body.steamids)) {
		idParam = body.steamids.join(',');
	} else {
		return json({}, { status: 400 });
	}

	const endpoint = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${idParam}`;
	console.log(endpoint);
	const response = await fetch(endpoint);
	let data: Steam.GetPlayerSummaries = await response.json();

	console.log('steamdata:');
	console.log(data);

	if (data.response.players.length == 0) {
		return null;
	}

	return json({ response: data.response.players }, { status: 201 });
}
