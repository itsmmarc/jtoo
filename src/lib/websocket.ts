import { PersistentState } from '@friendofsvelte/state';
import { settings } from './storage.svelte';

let ws: WebSocket;
export const messages = new PersistentState('messages', [{}]);

export function initializeWebSocket() {
	messages.current = [{}];
	console.log('initializing');
	console.log(`token: ${settings.current.webSocketToken}`);
	ws = new WebSocket(`https://console.jumpfortress.tf/?token=${settings.current.webSocketToken}`);
	ws.onmessage = function (event) {
		messages.current.push(JSON.parse(event.data));
		console.log(JSON.parse(event.data));
	};
}
