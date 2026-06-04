import { settings } from './storage.svelte';
import { writable } from 'svelte/store';

let ws: WebSocket;
const messages = writable([]);

export function initializeWebSocket() {
	console.log('initializing');
	console.log(`token: ${settings.current.webSocketToken}`);
	ws = new WebSocket(`https://console.jumpfortress.tf/?token=${settings.current.webSocketToken}`);
	ws.onmessage = function (event) {
		messages.update((prev) => [...prev, event.data]);
		console.log(event.data);
	};
}
