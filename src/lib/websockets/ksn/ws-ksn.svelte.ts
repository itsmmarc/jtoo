import { KSN } from './ws-ksn-types';
import { ProxyWebSocket } from '../../ProxyWebSocket';
import { csToTime } from '$lib/util';
import type { SteamID3 } from '$lib/types';
import { SvelteMap } from 'svelte/reactivity';

type PickedMaps = Array<{ mapID: string; steamID3: string }>;
class RunTimer {
	private _timeout: NodeJS.Timeout | undefined;
	private _time: number;
	private _isRunning: boolean;

	constructor() {
		this._timeout = undefined;
		this._time = $state(0);
		this._isRunning = $state(false);
	}

	start() {
		console.log('starting run timer');
		this._time = 0;
		clearTimeout(this._timeout);
		this._isRunning = true;

		const updatesPerSecond = 60;
		const updateIntervalMs = 1000 / updatesPerSecond;

		const startDate = Math.floor(Date.now() / 10);

		this._timeout = setInterval(() => {
			this._time = Math.floor(Date.now() / 10 - startDate);
		}, updateIntervalMs);
	}
	stop() {
		clearTimeout(this._timeout);
		this._isRunning = false;
	}
	reset() {
		this.stop();
		this._time = 0;
	}

	// getters
	get timeCs(): number {
		return this._time;
	}
	get timeFormatted(): string {
		return csToTime(this._time);
	}
	get isRunning(): boolean {
		return this._isRunning;
	}
}
export class PlayerTimer {
	private readonly _steamID3: number;
	private _timer: RunTimer;
	private _pr: number | undefined;
	private _prCps: SvelteMap<string, number>;
	private _currentCps: SvelteMap<string, number>;

	constructor(steamID3: number) {
		this._steamID3 = steamID3;
		this._timer = $state(new RunTimer());
		this._pr = $state(undefined);
		this._prCps = $state(new SvelteMap<string, number>());
		this._currentCps = $state(new SvelteMap<string, number>());
	}

	startTimer() {
		this.resetCheckpoints();
		this._timer.start();
	}
	stopTimer() {
		this._timer.stop();
	}
	finishTimer(finishTime: number) {
		this.stopTimer();

		if (!this._pr || finishTime < this._pr) {
			this._pr = finishTime * 100; // convert from seconds to centiseconds
			this._prCps = new SvelteMap(this._currentCps);
		}
	}
	pushCheckpoint(checkpointTime: number, checkpointName: string) {
		this._currentCps.set(checkpointName, checkpointTime);
	}
	resetTimer() {
		this._timer.reset();
	}
	resetCheckpoints() {
		this._currentCps.clear();
	}
	clearPr() {
		this._pr = undefined;
		this._prCps.clear();
	}

	// getters
	get timeCs(): number {
		return this._timer.timeCs;
	}
	get timeFormatted(): string {
		return this._timer.timeFormatted;
	}
	get steamID3(): number {
		return this._steamID3;
	}
	get prCs(): number | undefined {
		return this._pr;
	}
	get prFormatted(): string | undefined {
		if (this._pr) {
			return csToTime(this._pr);
		}
		return undefined;
	}
	get prCheckpointsCs(): SvelteMap<string, number> {
		return this._prCps;
	}
	get prCheckpointsFormatted(): SvelteMap<string, string> {
		const result = new SvelteMap<string, string>();
		this._prCps.forEach((cpTime, cpName) => {
			result.set(cpName, csToTime(cpTime));
		});
		return result;
	}
	get currentCheckpointsCs(): SvelteMap<string, number> {
		return this._currentCps;
	}
	get currentCheckpointsFormatted(): SvelteMap<string, string> {
		const result = new SvelteMap<string, string>();
		this._currentCps.forEach((cpTime, cpName) => {
			result.set(cpName, csToTime(cpTime));
		});
		return result;
	}
	get isRunning(): boolean {
		return this._timer.isRunning;
	}
	get checkpointsCollected(): number {
		return this._currentCps.size;
	}
}
class CompetitionTimer {
	private _timeout: NodeJS.Timeout | undefined;
	private _durationSeconds: number;
	private _timeLeftSeconds: number;
	private _overtimeStatus: boolean;

	constructor() {
		this._timeout = undefined;
		this._durationSeconds = 0;
		this._timeLeftSeconds = $state(0);
		this._overtimeStatus = $state(false);
	}

	startCountdownTimer(durationSeconds: number) {
		if (this._timeout) {
			clearTimeout(this._timeout);
		}

		this.clear();

		this._durationSeconds = durationSeconds;
		this._timeLeftSeconds = durationSeconds - 1;

		this._timeout = setInterval(() => {
			if (this._timeLeftSeconds > 0) {
				this._timeLeftSeconds--;
			} else {
				this._timeLeftSeconds = 0;
			}
		}, 1000);
	}

	stopCountdownTimer() {
		clearTimeout(this._timeout);
		this.clear();
	}

	activateOvertime() {
		this._overtimeStatus = true;
	}

	clear() {
		clearTimeout(this._timeout);
		this._durationSeconds = 0;
		this._timeLeftSeconds = 0;
		this._overtimeStatus = false;
	}

	// getters
	get overtimeStatus(): boolean {
		return this._overtimeStatus;
	}
	get timeLeftSeconds(): number {
		return this._timeLeftSeconds;
	}
	getTimeLeftFormatted(format: 'seconds' | 'minutes'): string {
		return csToTime(Math.trunc(this._timeLeftSeconds * 100), format);
	}
	get durationSeconds(): number {
		return this._durationSeconds;
	}
	get durationFormatted(): string {
		return csToTime(Math.trunc(this._durationSeconds * 100));
	}
}
class KSNTimer {
	private _competition: CompetitionTimer;
	private _players: SvelteMap<SteamID3, PlayerTimer>;
	private _checkpoints: string[];

	constructor() {
		this._competition = $state(new CompetitionTimer());
		this._players = $state(new SvelteMap<SteamID3, PlayerTimer>());
		this._checkpoints = $state([]);
	}

	verifyPlayerAdded(steamID3: SteamID3) {
		if (!this.getPlayerTimer(steamID3)) {
			this._players.set(steamID3, new PlayerTimer(steamID3));
		}
	}

	clearAllTimers() {
		this.clearAllPlayerTimers();
		this._competition.clear();
	}
	startPlayerTimer(steamID3: SteamID3) {
		this.getPlayerTimer(steamID3)?.startTimer();
	}
	stopPlayerTimer(steamID3: SteamID3) {
		this.getPlayerTimer(steamID3)?.stopTimer();
	}
	finishPlayerTimer(steamID3: SteamID3, finishTime: number) {
		this.getPlayerTimer(steamID3)?.finishTimer(finishTime);
	}
	clearPlayerPr(steamID3: SteamID3) {
		this.getPlayerTimer(steamID3)?.clearPr();
	}
	pushCheckpointPlayerTimer(steamID3: SteamID3, checkpointName: string, checkpointTime: number) {
		if (this._checkpoints && !this._checkpoints.includes(checkpointName)) {
			this._checkpoints.push(checkpointName);
		}

		this.getPlayerTimer(steamID3)?.pushCheckpoint(checkpointTime, checkpointName);
	}
	resetPlayerTimer(steamID3: SteamID3) {
		this.getPlayerTimer(steamID3)?.resetTimer();
		this.getPlayerTimer(steamID3)?.resetCheckpoints();
	}

	stopAllPlayerTimers() {
		this._players.forEach((player) => player.stopTimer());
	}
	resetAllPlayerCheckpoints() {
		this._players.forEach((player) => player.resetCheckpoints());
	}
	clearAllPlayerTimers() {
		this._players.forEach((player) => {
			player.resetTimer();
			player.resetCheckpoints();
		});
	}
	clearAllPlayerPrs() {
		this._players.forEach((player) => player.clearPr());
	}

	fullClear() {
		this.clearAllTimers();
		this.clearAllPlayerPrs();
	}

	sortPlayers() {
		console.log('sorting players');
		const temp = Array.from(this._players);
		// sort by pr
		temp.sort((a, b) => {
			if (a[1].prCs && b[1].prCs) {
				return a[1].prCs < b[1].prCs ? -1 : 1;
			}
			if (a[1].prCs && !b[1].prCs) {
				return -1;
			}
			if (!a[1].prCs && b[1].prCs) {
				return 1;
			}
			return 0;
		});

		// sort players without a pr by number of checkpoints
		temp.sort((a, b) => {
			// if either has a pr, they were already sorted
			if (a[1].prCs || b[1].prCs) {
				return 0;
			}
			// if neither a nor b has collected a checkpoint
			if (a[1].checkpointsCollected == 0 && b[1].checkpointsCollected == 0) {
				return 0;
			}
			// if a has more checkpoints than b
			if (a[1].checkpointsCollected > b[1].checkpointsCollected) {
				return -1;
			}
			// if b has more checkpoints than a
			if (a[1].checkpointsCollected < b[1].checkpointsCollected) {
				return 1;
			}
			// if a's last checkpoint is faster than b's last checkpoint
			if ([...a[1].currentCheckpointsCs].pop()![1]! < [...b[1].currentCheckpointsCs].pop()![1]!) {
				return 1;
			} else {
				return -1;
			}
		});

		this._players = new SvelteMap(temp);
		console.log(this._players);
	}

	// getters
	/**
	 * @param steamID3
	 * @returns player index if exists, else undefined
	 * call verifyPlayerAdded if this returns undefined
	 */
	getPlayerTimer(steamID3: number): PlayerTimer | undefined {
		return this._players.get(steamID3);
	}

	get leaderCheckpointsCs(): SvelteMap<string, number> {
		if (this.players.size == 0) return new SvelteMap();

		const leaderTimer = this._players.values().next().value;

		if (!leaderTimer) return new SvelteMap();

		if (!leaderTimer.prCs) return leaderTimer.currentCheckpointsCs;

		return leaderTimer.prCheckpointsCs;
	}
	get leaderCheckpointsFormatted() {
		const result = new SvelteMap<string, string>();
		this.leaderCheckpointsCs.forEach((cpTime, cpName) => {
			result.set(cpName, csToTime(cpTime));
		});
		return result;
	}

	get leader(): SteamID3 | undefined {
		if (this.players.size == 0) return undefined;

		const leader = this._players.keys().next().value;

		if (!leader) return undefined;

		const leaderTimer = this.getPlayerTimer(leader);

		if (!leaderTimer!.prCs && !leaderTimer!.checkpointsCollected) return undefined;

		return leader;
	}
	// get checkpoints of hypothetical "sum of best" run. probably going to be too expensive to run often when we have large player counts
	// getBestCheckpoints() {
	// 	let newBestCps: number[] = [];

	// 	let cpOps: number[] = [];

	// 	for (let i = 0; i < size; i++) {
	// 		cpOps = [];
	// 		if (leftCps[i]) cpOps.push(leftCps[i]);
	// 		if (rightCps[i]) cpOps.push(rightCps[i]);
	// 		if (bestCps[i]) cpOps.push(bestCps[i]);

	// 		newBestCps[i] = Math.min(...cpOps);
	// 	}

	// 	return newBestCps;
	// }

	get checkpoints() {
		return this._checkpoints;
	}
	get competition() {
		return this._competition;
	}
	get players() {
		return this._players;
	}
}
export class KSNWebSocket {
	private _ws: ProxyWebSocket | undefined;
	private _channel: BroadcastChannel;
	private _messages: KSN.Messages; // probably not necessary, really only need previousMapPicks
	private _pickedMaps: PickedMaps;
	private _timer: KSNTimer;

	constructor() {
		this._ws = undefined;
		this._channel = new BroadcastChannel('ksnTimer');
		this._messages = KSN.defaultMessages;
		this._pickedMaps = $state([]) as PickedMaps;
		this._timer = $state(new KSNTimer());

		this._channel.postMessage({ type: 'welcome', value: 'hello world' });
		this._channel.onmessage = (event) => this.onBcMessage(event);
	}

	private onBcMessage(event: MessageEvent) {
		const data: KSNBCMessageType = event.data;

		console.log(data);

		switch (data.type) {
			case 'connect':
				this._connect(data.value);
				break;
			case 'clearPicksAndBans':
				this._clearPicksAndBans();
				break;
			case 'clearTimers':
				this._clearTimers();
				break;
			default:
				break;
		}
	}
	private onWsMessage(event: MessageEvent) {
		const data: KSN.MessageTypes = JSON.parse(event.data);

		console.log(data);

		// let playerTimer: PlayerTimer | undefined;

		switch (data.type) {
			case 'pickbans_session_state':
				this._messages.mapPicks = data;
				this.processMapPick();
				break;
			case 'timer_start':
				this.timer.verifyPlayerAdded(data.steamid);
				this.timer.startPlayerTimer(data.steamid);
				break;
			case 'timer_stop':
				this.timer.verifyPlayerAdded(data.steamid);
				this.timer.stopPlayerTimer(data.steamid);
				break;
			case 'timer_finish':
				this.timer.verifyPlayerAdded(data.steamid);
				this.timer.finishPlayerTimer(data.steamid, data.time);
				this.timer.sortPlayers();
				break;
			case 'timer_checkpoint':
				this.timer.verifyPlayerAdded(data.steamid);
				this.timer.pushCheckpointPlayerTimer(
					data.steamid,
					data.formattedCheckpoint,
					data.time * 100
				);
				this.timer.sortPlayers();
				break;
			case 'competition_session_live':
				this.timer.fullClear();
				this.timer.competition.startCountdownTimer(data.durationSeconds);
				break;
			case 'competition_session_end':
				this.timer.competition.stopCountdownTimer();
				this.timer.stopAllPlayerTimers();
				this.timer.sortPlayers();
				break;
			case 'competition_session_overtime':
				this.timer.competition.activateOvertime();
				break;
			case 'competition_session_player_ended':
				this.timer.verifyPlayerAdded(parseInt(data.steamAccountId));
				this.timer.stopPlayerTimer(parseInt(data.steamAccountId));
				this.timer.sortPlayers();
				break;
			default:
				return;
		}
	}
	connect(wsToken: string) {
		this._connect(wsToken);

		this._channel.postMessage({
			type: 'connect',
			value: wsToken
		});
	}
	connectNoBroadcast(wsToken: string) {
		this._connect(wsToken);
	}
	private _connect(wsToken: string) {
		if (this._ws && this._ws.readyState == ProxyWebSocket.OPEN) {
			console.log('closing web socket connection...');
			this._ws.close();
		}

		console.log('initializing websocket');

		// clear messages
		this._messages = KSN.defaultMessages;

		// connect to websocket
		this._ws = new ProxyWebSocket(`https://console.jumpfortress.tf/?token=${wsToken}`);

		// handle websocket messages
		this._ws.onmessage = (event) => {
			this.onWsMessage(event);
		};
	}

	clearPicksAndBans() {
		this._clearPicksAndBans();

		this._channel.postMessage({
			type: 'clearPicksAndBans'
		});
	}
	private _clearPicksAndBans() {
		this._messages.mapPicks = { type: 'pickbans_session_state', session: null };
		this._pickedMaps = [];
	}

	clearTimers() {
		this._clearTimers();

		this._channel.postMessage({
			type: 'clearTimers'
		});
	}
	private _clearTimers() {
		this._timer.fullClear();
	}

	// map picks
	processMapPick() {
		if (!this._messages.mapPicks.session) {
			return;
		}

		// if this is the first session, set up old session
		if (!this._messages.mapPicksPrevious) {
			this._messages.mapPicksPrevious = { ...this._messages.mapPicks };
		} else if (
			// if the new session matches the old session, ignore
			this._messages.mapPicksPrevious.session &&
			this._messages.mapPicks.session.currentTurn?.turnId ==
				this._messages.mapPicksPrevious.session.currentTurn?.turnId
		) {
			return;
		}

		this._pickedMaps = [];
		for (const turn of this._messages.mapPicks.session.history) {
			if (turn.action == 'pick') {
				const actor = this._messages.mapPicks.session[`player${turn.actor}`].steamId3;
				this._pickedMaps = [...this._pickedMaps, { mapID: turn.mapId, steamID3: actor }];
			}
		}

		this._messages.mapPicksPrevious = { ...this._messages.mapPicks };
	}
	// getters
	get pickedMaps(): PickedMaps {
		return this._pickedMaps;
	}
	get timer(): KSNTimer {
		return this._timer;
	}
	get messages(): KSN.Messages {
		return this._messages;
	}
	get wsState() {
		return this._ws?.state;
	}
}
interface BaseKSNBCMessage {
	type: 'connect' | 'clearPicksAndBans' | 'clearTimers';
}
interface KSNBCConnectMessage extends BaseKSNBCMessage {
	type: 'connect';
	value: string;
}
interface KSNBCPickBanMessage extends BaseKSNBCMessage {
	type: 'clearPicksAndBans';
}
interface KSNBCClearTimersMessage extends BaseKSNBCMessage {
	type: 'clearTimers';
}

export type KSNBCMessageType = KSNBCConnectMessage | KSNBCClearTimersMessage | KSNBCPickBanMessage;
