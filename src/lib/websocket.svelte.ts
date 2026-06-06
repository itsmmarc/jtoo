import { PersistentState } from '@friendofsvelte/state';
import { settings } from './storage.svelte';
import { type PickBansSessionStateEvent, defaultMessages } from './websocket-types';
import { SvelteMap } from 'svelte/reactivity';

let ws: WebSocket;
export const messages = new PersistentState('messages', defaultMessages);

export function initializeWebSocket() {
	messages.current.mapPicks = [];
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

		switch (data.type) {
			case 'pickbans_session_state':
				messages.current.mapPicks.push(data as PickBansSessionStateEvent);
				break;
			case 'timer_start':
			case 'timer_stop':
			case 'timer_finish':
			case 'welcome':
			default:
				return;
		}
	};
}

export const leftTimer = $state({
	timer_start: false,
	timer_stop: false,
	timer_finish: false,
	finishTime: 0
});

export const rightTimer = $state({
	timer_start: false,
	timer_stop: false,
	timer_finish: false,
	finishTime: 0
});

// cannot use with defaultTimer
export const leftCheckpointTimes: SvelteMap<string, number> = new SvelteMap([]);
export const rightCheckpointTimes: SvelteMap<string, number> = new SvelteMap([]);

// don't start timer if already finished
export function timer_start(side: string) {
	if (side === 'left' && !leftTimer.timer_finish) {
		Object.assign(leftTimer, defaultTimer);
		leftTimer.timer_start = true;
	} else if (side === 'right' && !rightTimer.timer_finish) {
		Object.assign(rightTimer, defaultTimer);
		rightTimer.timer_start = true;
	}
}

// don't stop timer if already finished
export function timer_stop(side: string) {
	if (side === 'left' && !leftTimer.timer_finish) {
		Object.assign(leftTimer, defaultTimer);
		leftCheckpointTimes.clear();
		leftTimer.timer_stop = true;
	} else if (side === 'right' && !rightTimer.timer_finish) {
		Object.assign(rightTimer, defaultTimer);
		leftCheckpointTimes.clear();
		rightTimer.timer_stop = true;
	}
}

export function timer_finish(side: string, finishTime: number) {
	if (side === 'left') {
		leftTimer.timer_start = false;
		leftTimer.timer_finish = true;
		leftTimer.finishTime = finishTime;
		leftCheckpointTimes.set('finish', finishTime);
	} else {
		rightTimer.timer_start = false;
		rightTimer.timer_finish = true;
		rightTimer.finishTime = finishTime;
		rightCheckpointTimes.set('finish', finishTime);
	}
}

export function timer_checkpoint(side: string, checkpointName: string, checkpointTime: number) {
	if (side === 'left') {
		leftCheckpointTimes.set(checkpointName, checkpointTime);
	} else {
		rightCheckpointTimes.set(checkpointName, checkpointTime);
	}
}

export function resetTimer(side: string) {
	if (side === 'left') {
		Object.assign(leftTimer, defaultTimer);
		leftCheckpointTimes.clear();
	} else {
		Object.assign(rightTimer, defaultTimer);
		rightCheckpointTimes.clear();
	}
}

export const resetPulse = $state({
	state: false
});

const defaultTimer = {
	timer_start: false,
	timer_stop: false,
	timer_finish: false,
	finishTime: 0
};

export function csToTime(cs: number) {
	const minutes = Math.floor(cs / 6000)
		.toString()
		.padStart(2, '0');
	const seconds = Math.floor((cs / 100) % 60)
		.toString()
		.padStart(2, '0');
	const centiseconds = Math.floor(cs % 100)
		.toString()
		.padStart(2, '0');

	return `${minutes}:${seconds}.${centiseconds}`;
}
