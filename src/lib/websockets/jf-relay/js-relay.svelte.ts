import { ProxyWebSocket } from '$lib/ProxyWebSocket';
import type { SteamID3 } from '$lib/types.svelte';

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

		console.log('initializing jf relay websocket');

		// connect to websocket
		this._ws = new ProxyWebSocket(
			`wss://console.jumpfortress.tf/?token=${wsToken}&channel=progress`
		);

		// broadcast welcome on connect
		this._ws.onopen = () => {
			console.log('jf relay websocket connected');
			const msg: JFRelayWelcomeEvent = {
				type: 'overlay_connected',
				value: 'hello world'
			};
			this.send(msg);
		};

		this._ws.onclose = () => {
			console.log('jf relay websocket closing');
		};

		this._ws.state?.subscribe((state) => {
			console.log(`wsState: ${state}`);
			this._wsState = state;
		});
	}

	broadcastSelectedPlayers(steamId3s: Array<SteamID3 | undefined>) {
		const playerA = steamId3s[0] ?? null;
		const playerB = steamId3s[1] ?? null;
		console.log(`jf relay broadcasting player selections: [${playerA}, ${playerB}]`);
		const msg: JFRelaySpectatorSelectEvent = {
			type: 'spectator_select',
			value: { playerA: playerA, playerB: playerB }
		};
		this.send(msg);
	}

	send(msg: JFRelayEvents) {
		const msgString = JSON.stringify(msg);
		console.log('readyState:', this._ws?.readyState); // 0 connecting, 1 open, 2 closing, 3 closed
		console.log(this._ws?.url);

		if (this._ws?.readyState === WebSocket.OPEN) {
			this._ws.send(msgString);
		} else {
			console.warn('socket not open, dropping', msgString);
		}
	}

	// getters
	get wsState(): number {
		return this._wsState;
	}
}
