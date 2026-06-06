import { PersistentState } from '@friendofsvelte/state';
import { settings } from './storage.svelte';
import { type PickBansSessionStateEvent } from './websocket-types';

let ws: WebSocket;
export const messages = new PersistentState(
	'messages',
	new Array<PickBansSessionStateEvent>(),
	'localStorage'
);

export function initializeWebSocket() {
	messages.current = [];
	if (!settings.current.useWebSocket) {
		ws.close();
		return;
	}
	console.log('initializing websocket');
	// console.log(`token: ${settings.current.webSocketToken}`);
	ws = new WebSocket(`https://console.jumpfortress.tf/?token=${settings.current.webSocketToken}`);
	ws.onmessage = function (event) {
		const data = JSON.parse(event.data);
		console.log(data);

		// only using pickbans_session_state for now
		if (data.type == 'pickbans_session_state') {
			messages.current.push(data as PickBansSessionStateEvent);
		} else {
			return;
		}
	};
}
