import { PersistentState } from '@friendofsvelte/state';
import { settings, overlay } from './storage.svelte';
import { type BaseTimerEvent, type MessageTypes, defaultMessages } from './websocket-types';
import { ProxyWebSocket } from './ProxyWebSocket';

export let ws: ProxyWebSocket = new ProxyWebSocket(`https://console.jumpfortress.tf/?token=0`);
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
	messages.current.mapPicks = [];
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
				messages.current.mapPicks.push(data);
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
			case 'competition_session_overtime':
				competition_timer_overtime(data.durationSeconds);
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
	leftcps: any;
	rightcps: any;
};

const defaultTimerStore: TimerStore = {
	left: defaultTimer,
	right: defaultTimer,
	competition: defaultCompetitionTimer,
	leftPr: null,
	rightPr: null,
	leftcps: {},
	rightcps: {}
};

export const timer = new PersistentState('timer', defaultTimerStore);

function checkTimerSide(data: BaseTimerEvent): string {
	return data.steamid == overlay.current.leftPlayer.steamID3
		? 'left'
		: data.steamid == overlay.current.rightPlayer.steamID3
			? 'right'
			: '';
}

// don't start timer if already finished
function timer_start(side: string) {
	if (side === 'left' && !timer.current.left.timer_finish) {
		Object.assign(timer.current.left, defaultTimer);
		timer.current.left.timer_start = true;
	} else if (side === 'right' && !timer.current.right.timer_finish) {
		Object.assign(timer.current.right, defaultTimer);
		timer.current.right.timer_start = true;
	}
}

// don't stop timer if already finished
function timer_stop(side: string) {
	if (side === 'left' && !timer.current.left.timer_finish) {
		Object.assign(timer.current.left, defaultTimer);
		timer.current.leftcps = {};
		timer.current.left.timer_stop = true;
	} else if (side === 'right' && !timer.current.right.timer_finish) {
		Object.assign(timer.current.right, defaultTimer);
		timer.current.leftcps = {};
		timer.current.right.timer_stop = true;
	}
}

function timer_finish(side: string, finishTime: number) {
	if (side === 'left') {
		timer.current.left.timer_start = false;
		timer.current.left.timer_finish = true;
		timer.current.left.finishTime = finishTime;
		if (!timer.current.leftPr || finishTime < timer.current.leftPr) {
			timer.current.leftPr = finishTime;
		}
		Object.assign(timer.current.leftcps, { finish: finishTime });
	} else {
		timer.current.right.timer_start = false;
		timer.current.right.timer_finish = true;
		timer.current.right.finishTime = finishTime;
		if (!timer.current.rightPr || finishTime < timer.current.rightPr) {
			timer.current.rightPr = finishTime;
		}
		Object.assign(timer.current.rightcps, { finish: finishTime });
	}
}

function timer_checkpoint(side: string, checkpointName: string, checkpointTime: number) {
	if (side === 'left') {
		Object.assign(timer.current.leftcps, { [checkpointName]: checkpointTime });
	} else {
		Object.assign(timer.current.rightcps, { [checkpointName]: checkpointTime });
	}
}

function resetCheckpoints() {
	timer.current.leftcps = {};
	timer.current.rightcps = {};
}

export function resetTimer(side: string) {
	if (side === 'left') {
		Object.assign(timer.current.left, defaultTimer);
		timer.current.leftcps = {};
	} else {
		Object.assign(timer.current.right, defaultTimer);
		timer.current.rightcps = {};
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
	timer.current.competition.durationSeconds = durationSeconds;
	timer.current.competition.timeLeftSeconds = durationSeconds;

	competitionTimer = setInterval(() => {
		if (timer.current.competition.timeLeftSeconds > 0) {
			timer.current.competition.timeLeftSeconds--;
		} else {
			competition_timer_stop();
		}
	}, 1000);
}

function competition_timer_stop() {
	clearTimeout(competitionTimer);
	timer.current.competition.timer_start = false;
	timer.current.competition.timer_stop = true;
}

function competition_timer_overtime(durationSeconds: number) {
	timer.current.competition.overtime = true;
	setTimeout(() => {
		timer.current.competition.overtime = false;
	}, durationSeconds * 1000);
}
