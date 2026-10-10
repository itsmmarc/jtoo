import { ProxyWebSocket } from '$lib/ProxyWebSocket';
import type { SteamID3 } from '$lib/types';

interface JFRelayEvent {
	type: 'spectator_select' | 'overlay_connected';
}

interface JFRelaySpectatorSelectEvent extends JFRelayEvent {
	type: 'spectator_select';
	value: {
		playerA: number | null; // numeric part of steamid3
		playerB: number | null; // numeric part of steamid3
	};
}

interface JFRelayWelcomeEvent extends JFRelayEvent {
	type: 'overlay_connected';
	value: string;
}

type JFRelayEvents = JFRelaySpectatorSelectEvent | JFRelayWelcomeEvent;

export class JFRelayWebSocket {
	private _ws: ProxyWebSocket | undefined;
	private _wsState: number;

	constructor() {
		this._ws = undefined;
		this._wsState = $state(WebSocket.CLOSED);
	}

	connect(wsToken: string) {
		if (this._ws && this._ws.readyState == ProxyWebSocket.OPEN) {
			console.log('closing web socket connection...');
			this._ws.close();
		}

		console.log('initializing websocket');

		// connect to websocket
		this._ws = new ProxyWebSocket(
			`wss://console.jumpfortress.tf/?token=${wsToken}&channel=progress`
		);

		// handle websocket messages
		this._ws.onopen = () => {
			const msg: JFRelayWelcomeEvent = {
				type: 'overlay_connected',
				value: 'hello world'
			};
			this.send(msg);
		};
	}

	broadcastSelectedPlayers(steamId3s: Array<SteamID3 | undefined>) {
		const playerA = steamId3s[0] ?? null;
		const playerB = steamId3s[1] ?? null;
		const msg: JFRelaySpectatorSelectEvent = {
			type: 'spectator_select',
			value: { playerA: playerA, playerB: playerB }
		};
		this.send(msg);
	}

	send(msg: JFRelayEvents) {
		const msgString = JSON.stringify(msg);
		if (this._ws?.readyState === WebSocket.OPEN) this._ws.send(msgString);
	}

	// getters
	get wsState(): number {
		return this._wsState;
	}
}
