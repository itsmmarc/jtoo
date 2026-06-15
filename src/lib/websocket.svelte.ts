import { PersistentState } from '@friendofsvelte/state';
import { settings, overlay } from './storage.svelte';
import { type BaseTimerEvent, type MessageTypes, defaultMessages } from './websocket-types';
import { ProxyWebSocket } from './ProxyWebSocket';
import { indexOf } from 'underscore';

export let ws: ProxyWebSocket;
export const wsState = new PersistentState('wsState', { state: 0 }, 'sessionStorage');
let competitionTimer: NodeJS.Timeout;
export const messages = new PersistentState('messages', defaultMessages);

export function clearWebSocketMessages() {
	messages.current = defaultMessages;
	timer.current.left.timer_stop = true;
	timer.current.right.timer_stop = true;
	timer.current = defaultTimerStore;
	resetCheckpoints();
}
export function clearPicksAndBans() {
	messages.current.mapPicks = { type: 'pickbans_session_state', session: null };
}

export function clearTimer() {
	timer.current.left.timer_stop = true;
	timer.current.right.timer_stop = true;
	timer.current = defaultTimerStore;
	resetCheckpoints();
}

export function initializeWebSocket() {
	if (ws && ws.readyState == ProxyWebSocket.OPEN) {
		console.log('closing web socket connection...');
		ws.close();
	}

	if (!settings.current.useWebSocket) {
		return;
	}

	console.log('initializing websocket');

	messages.current = defaultMessages;

	ws = new ProxyWebSocket(
		`https://console.jumpfortress.tf/?token=${settings.current.webSocketToken}`
	);

	ws.state.subscribe((s) => {
		wsState.current.state = s;
	});

	ws.onmessage = function (event) {
		const data: MessageTypes = JSON.parse(event.data);
		console.log(data);
		console.log(event.data);

		switch (data.type) {
			case 'pickbans_session_state':
				messages.current.mapPicks = data;
				break;
			case 'timer_start':
				timer_start(checkTimerSide(data));
				messages.current.timer.push(data);
				break;
			case 'timer_stop':
				timer_stop(checkTimerSide(data));
				messages.current.timer.push(data);
				break;
			case 'timer_finish':
				timer_finish(checkTimerSide(data), data.time);
				messages.current.timer.push(data);
				break;
			case 'timer_checkpoint':
				timer_checkpoint(checkTimerSide(data), data.formattedCheckpoint, data.time);
				break;
			case 'competition_session_live':
				competition_timer_start(data.durationSeconds);
				messages.current.competition.push(data);
				break;
			case 'competition_session_ended':
				competition_timer_stop();
				messages.current.competition.push(data);
				break;
			case 'competition_session_overtime':
				competition_timer_overtime();
				messages.current.competition.push(data);
				break;
			default:
				return;
		}
	};
}

// MARK: Timer
type Timer = {
	timer_start: boolean;
	timer_stop: boolean;
	timer_finish: boolean;
	finishTime: number;
};

const defaultTimer = {
	timer_start: false,
	timer_stop: false,
	timer_finish: false,
	finishTime: 0
} as Timer;

type CompetitionTimer = {
	timer_start: boolean;
	durationSeconds: number;
	timeLeftSeconds: number;
	timer_stop: boolean; // not sure if this is needed
	overtime: boolean;
};

const defaultCompetitionTimer = {
	timer_start: false,
	durationSeconds: 0,
	timeLeftSeconds: 0,
	timer_stop: false,
	overtime: false
};

type TimerStore = {
	left: Timer;
	right: Timer;
	competition: CompetitionTimer;
	leftPr: number | null;
	rightPr: number | null;
	leftcps: number[];
	rightcps: number[];
	checkpoints: string[];
};

const defaultTimerStore: TimerStore = {
	left: defaultTimer,
	right: defaultTimer,
	competition: defaultCompetitionTimer,
	leftPr: null,
	rightPr: null,
	leftcps: [],
	rightcps: [],
	checkpoints: []
};

export const timer = new PersistentState('timer', defaultTimerStore);

type Side = 'left' | 'right' | '';

function checkTimerSide(data: BaseTimerEvent): Side {
	return data.steamid == overlay.current.leftPlayer.steamID3
		? 'left'
		: data.steamid == overlay.current.rightPlayer.steamID3
			? 'right'
			: '';
}

function timer_start(side: Side) {
	if (side) {
		Object.assign(timer.current[side], defaultTimer);
		timer.current[side].timer_start = true;
	}
}

function timer_stop(side: Side) {
	if (side) {
		Object.assign(timer.current[side], defaultTimer);
		timer.current[`${side}cps`] = [];
		timer.current[side].timer_stop = true;
	}
}

function timer_finish(side: Side, finishTime: number) {
	if (side) {
		timer.current[side].timer_start = false;
		timer.current[side].timer_finish = true;
		timer.current[side].finishTime = finishTime;
		if (!timer.current[`${side}Pr`] || finishTime < timer.current[`${side}Pr`]!) {
			timer.current[`${side}Pr`] = finishTime;
		}
		Object.assign(timer.current[`${side}cps`], { finish: finishTime });
	}
}

function timer_checkpoint(side: Side, checkpointName: string, checkpointTime: number) {
	// this block of code causes the timer to reset when a checkpoint is collected
	if (timer.current.checkpoints && !timer.current.checkpoints.includes(checkpointName)) {
		console.log(timer.current.checkpoints);
		timer.current.checkpoints.push(checkpointName);
		console.log(timer.current.checkpoints);
	}

	const index = indexOf(timer.current.checkpoints, checkpointName);

	if (side) {
		timer.current[`${side}cps`][index] = checkpointTime;
	}
}

function resetCheckpoints() {
	timer.current.leftcps = [];
	timer.current.rightcps = [];
}

export function resetTimer(side: Side) {
	if (side) {
		Object.assign(timer.current[side], defaultTimer);
		timer.current[`${side}cps`] = [];
	}
}

export const resetPulse = $state({
	state: false
});

export function csToTime(cs: number, precision?: 'centiseconds' | 'seconds' | 'minutes') {
	const minutes = Math.floor(cs / 6000)
		.toString()
		.padStart(2, '0');
	const seconds = Math.floor((cs / 100) % 60)
		.toString()
		.padStart(2, '0');
	const centiseconds = Math.floor(cs % 100)
		.toString()
		.padStart(2, '0');

	let s: string;
	if (!precision) {
		s = `${minutes}:${seconds}.${centiseconds}`;
	} else {
		s = `${minutes}`;
		s += precision == 'seconds' || precision == 'centiseconds' ? `:${seconds}` : '';
		s += precision == 'centiseconds' ? `.${centiseconds}` : '';
	}
	return s;
}

// MARK: Competition
function competition_timer_start(durationSeconds: number) {
	if (timer.current.competition.timer_start) {
		return;
	}

	timer.current = defaultTimerStore;

	timer.current.competition.timer_stop = false;
	timer.current.competition.durationSeconds = durationSeconds;
	timer.current.competition.timeLeftSeconds = durationSeconds - 1;

	competitionTimer = setInterval(() => {
		if (timer.current.competition.timeLeftSeconds > 0) {
			timer.current.competition.timeLeftSeconds--;
		} else {
			timer.current.competition.timeLeftSeconds = 0;
		}
	}, 1000);
}

function competition_timer_stop() {
	clearTimeout(competitionTimer);
	timer.current.competition.timer_start = false;
	timer.current.competition.timer_stop = true;
}

function competition_timer_overtime() {
	timer.current.competition.overtime = true;
}
