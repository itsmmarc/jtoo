import { settings, wsState } from '../../storage.svelte';
import { KSN } from './ws-ksn-types';
import { ProxyWebSocket } from '../../ProxyWebSocket';
import { indexOf } from 'underscore';
import { csToTime } from '$lib/util';

type PickedMaps = Array<{ mapID: String; steamID3: string }>;
class RunTimer {
	private _timeout: NodeJS.Timeout | undefined;
	private _time: number;
	private _isRunning: boolean;

	constructor() {
		this._timeout = undefined;
		this._time = 0;
		this._isRunning = false;
	}

	start() {
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
	private _steamID3: number;
	private _timer: RunTimer;
	private _pr: number | undefined;
	private _prCps: number[];
	private _currentCps: number[];

	constructor(steamID3: number) {
		this._steamID3 = steamID3;
		this._timer = new RunTimer();
		this._pr = undefined;
		this._prCps = [];
		this._currentCps = [];
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
			this._pr = finishTime;
			this._prCps = [...this._currentCps];
		}
	}
	pushCheckpoint(checkpointTime: number, checkpointIndex: number) {
		this._currentCps[checkpointIndex] = checkpointTime;
	}
	resetTimer() {
		this._timer.reset();
	}
	resetCheckpoints() {
		this._currentCps = [];
	}
	clearPr() {
		this._pr = undefined;
		this._prCps = [];
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
	get prCheckpointsCs(): number[] {
		return this._prCps;
	}
	get prCheckpointsFormatted(): string[] {
		return this._prCps.map((cp) => csToTime(cp));
	}
	get currentCheckpointsCs(): number[] {
		return this._currentCps;
	}
	get currentCheckpointsFormatted(): string[] {
		return this._currentCps.map((cp) => csToTime(cp));
	}
	get isRunning(): boolean {
		return this._timer.isRunning;
	}
	get checkpointsCollected(): number {
		return this._currentCps.length;
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
		this._timeLeftSeconds = 0;
		this._overtimeStatus = false;
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
	private _players: PlayerTimer[];
	private _checkpoints: string[];

	constructor() {
		this._competition = new CompetitionTimer();
		this._players = [];
		this._checkpoints = [];
	}

	getPlayerIndex(steamID3: number): number {
		for (let i = 0; i < this._players.length; i++) {
			if (this._players[i].steamID3 == steamID3) {
				return i;
			}
		}
		this._players.push(new PlayerTimer(steamID3));
		return this._players.length - 1;
	}
	playerIndexIsValid(playerIndex: number): boolean {
		return playerIndex > 0 && playerIndex < this._players.length;
	}

	clearAllTimers() {
		this.clearAllPlayerTimers();
		this._competition.clear();
	}
	startPlayerTimer(playerIndex: number) {
		if (this.playerIndexIsValid(playerIndex)) {
			this._players[playerIndex].startTimer();
		}
	}
	stopPlayerTimer(playerIndex: number) {
		if (this.playerIndexIsValid(playerIndex)) {
			this._players[playerIndex].stopTimer();
		}
	}
	finishPlayerTimer(playerIndex: number, finishTime: number) {
		if (this.playerIndexIsValid(playerIndex)) {
			this._players[playerIndex].finishTimer(finishTime);
		}
	}
	clearPlayerPr(playerIndex: number) {
		if (this.playerIndexIsValid(playerIndex)) {
			this._players[playerIndex].clearPr();
		}
	}
	pushCheckpointPlayerTimer(playerIndex: number, checkpointName: string, checkpointTime: number) {
		if (this._checkpoints && !this._checkpoints.includes(checkpointName)) {
			this._checkpoints.push(checkpointName);
		}

		const checkpointIndex = indexOf(this._checkpoints, checkpointName);

		if (this.playerIndexIsValid(playerIndex)) {
			this._players[playerIndex].pushCheckpoint(checkpointTime, checkpointIndex);
		}
	}
	resetPlayerTimer(playerIndex: number) {
		if (this.playerIndexIsValid(playerIndex)) {
			this._players[playerIndex].resetTimer();
			this._players[playerIndex].resetCheckpoints();
		}
	}

	stopAllPlayerTimers() {
		this._players.every((_, index) => this.stopPlayerTimer(index));
	}
	resetAllPlayerCheckpoints() {
		this._players.every((player, _) => player.resetCheckpoints());
	}
	clearAllPlayerTimers() {
		this._players.every((_, index) => this.resetPlayerTimer(index));
	}
	clearAllPlayerPrs() {
		this._players.every((_, index) => this.clearPlayerPr(index));
	}

	fullClear() {
		this.clearAllTimers();
		this.clearAllPlayerPrs();
	}

	sortPlayers() {
		// sort by pr
		this._players.sort((a, b) => {
			if (a.prCs && b.prCs) {
				return a.prCs < b.prCs ? -1 : 1;
			}
			if (a.prCs && !b.prCs) {
				return -1;
			}
			if (!a.prCs && b.prCs) {
				return 1;
			}
			return 0;
		});

		// sort players without a pr by number of checkpoints
		this._players.sort((a, b) => {
			if (a.prCs || b.prCs) {
				return 0;
			}
			if (a.checkpointsCollected > b.checkpointsCollected) {
				return 1;
			}
			if (a.checkpointsCollected < b.checkpointsCollected) {
				return -1;
			}
			if (
				a.currentCheckpointsCs[a.checkpointsCollected - 1] <
				b.currentCheckpointsCs[b.checkpointsCollected - 1]
			) {
				return -1;
			} else {
				return 1;
			}
		});
	}

	// getters
	getPlayerTimerBySteamId3(steamID3: number) {
		return this._players[this.getPlayerIndex(steamID3)];
	}

	getLeaderCheckpoints() {
		this.sortPlayers();
		if (this._players[this._players.length - 1].prCs) {
			return this._players[this._players.length - 1].prCheckpointsCs;
		}
		return this._players[this._players.length - 1].currentCheckpointsCs;
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
	private _messages: KSN.Messages;
	private _pickedMaps: PickedMaps;
	private _timer: KSNTimer;

	constructor() {
		this._ws = undefined;
		this._channel = new BroadcastChannel('ksnTimer');
		this._messages = KSN.defaultMessages;
		this._pickedMaps = [] as PickedMaps;
		this._timer = new KSNTimer();

		this._channel.onmessage = (event) => this.onBcMessage(event);
	}

	private onBcMessage(event: MessageEvent) {
		const data: KSNBCMessageType = JSON.parse(event.data);

		console.log(data);
		console.log(event.data);

		switch (data.type) {
			case 'connect':
				this.connect(data.value);
				break;
			case 'clearPicksAndBans':
				this.clearPicksAndBans();
				break;
			case 'clearTimers':
				this.clearTimers();
				break;
			default:
				break;
		}
	}
	private onWsMessage(event: MessageEvent) {
		const data: KSN.MessageTypes = JSON.parse(event.data);

		console.log(data);
		console.log(event.data);

		let playerIndex: number | undefined;

		switch (data.type) {
			case 'pickbans_session_state':
				this._messages.mapPicks = data;
				this.processMapPick();
				break;
			case 'timer_start':
				playerIndex = this.timer.getPlayerIndex(data.steamid);
				this.timer.startPlayerTimer(playerIndex);
				break;
			case 'timer_stop':
				playerIndex = this.timer.getPlayerIndex(data.steamid);
				this.timer.stopPlayerTimer(playerIndex);
				break;
			case 'timer_finish':
				playerIndex = this.timer.getPlayerIndex(data.steamid);
				this.timer.finishPlayerTimer(playerIndex, data.time);
				break;
			case 'timer_checkpoint':
				playerIndex = this.timer.getPlayerIndex(data.steamid);
				this.timer.pushCheckpointPlayerTimer(playerIndex, data.formattedCheckpoint, data.time);
				break;
			case 'competition_session_live':
				this.timer.fullClear();
				this.timer.competition.startCountdownTimer(data.durationSeconds);
				break;
			case 'competition_session_end':
				this.timer.competition.stopCountdownTimer();
				this.timer.stopAllPlayerTimers();
				break;
			case 'competition_session_overtime':
				this.timer.competition.activateOvertime();
				break;
			case 'competition_session_player_ended':
				playerIndex = this.timer.getPlayerIndex(parseInt(data.steamAccountId));
				this.timer.stopPlayerTimer(playerIndex);
				break;
			default:
				return;
		}
	}
	connect(wsToken: string) {
		if (this._ws && this._ws.readyState == ProxyWebSocket.OPEN) {
			console.log('closing web socket connection...');
			this._ws.close();
		}

		console.log('initializing websocket');

		// clear messages
		this._messages = KSN.defaultMessages;

		// connect to websocket
		this._ws = new ProxyWebSocket(`https://console.jumpfortress.tf/?token=${wsToken}`);

		/**
		 * subscribe to update persistent store with state changes
		 * used to display ws state on the controls page while this object runs on the overlay page
		 */
		this._ws.state.subscribe((s) => {
			wsState.current.state = s;
		});

		// handle websocket messages
		this._ws.onmessage = (event) => {
			this.onWsMessage(event);
		};

		this._channel.postMessage({
			type: 'connect',
			value: wsToken
		});
	}

	clearPicksAndBans() {
		this._messages.mapPicks = { type: 'pickbans_session_state', session: null };
		this._pickedMaps = [];

		this._channel.postMessage({
			type: 'clearPicksAndBans'
		});
	}

	clearTimers() {
		this._timer.fullClear();

		this._channel.postMessage({
			type: 'clearTimers'
		});
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
				let actor = this._messages.mapPicks.session[`player${turn.actor}`].steamId3;
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
