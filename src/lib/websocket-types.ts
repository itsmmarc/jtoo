// kingstripes
// MARK: Picks and Bans
type SeriesLength = 3 | 5;
type PickBansActor = 'A' | 'B';
type PickBansAction = 'pick' | 'ban';
type PickBansSessionStatus = 'running' | 'completed' | 'cancelled';
type PickBansResolutionSource = 'web' | 'in-game' | 'timeout-random' | 'elimination';

interface MapOption {
	id: string;
	name: string;
	displayName: string | null;
}

interface PickBansSessionConfig {
	turnTimeLimitSeconds: number;
	seriesLength: SeriesLength;
}

interface StepDefinition {
	index: number;
	actor: PickBansActor;
	action: PickBansAction;
}

interface ActiveTurn {
	turnId: string;
	stepIndex: number;
	actor: PickBansActor;
	action: PickBansAction;
	startedAt: string;
	expiresAt: string;
	acceptanceClosesAt: string;
	remainingMapIds: string[];
}

interface StepResult {
	turnId: string;
	stepIndex: number;
	actor: PickBansActor;
	action: PickBansAction;
	mapId: string;
	resolvedBy: PickBansResolutionSource;
	resolvedAt: string;
}

interface PlayerRecord {
	id: string;
	displayName: string;
	personaName: string;
	steamId64: string;
	steamAccountId: string;
	steamId3: string;
	profileUrl: string;
	avatarUrl: string;
	countryCode: string | null;
	countryName: string | null;
	source: 'steam-import' | 'manual';
	createdAt: string;
	updatedAt: string;
}

interface PickBansSessionState {
	id: string;
	revision: number;
	status: PickBansSessionStatus;
	createdAt: string;
	startedAt?: string;
	completedAt?: string;
	updatedAt: string;
	playerA: PlayerRecord;
	playerB: PlayerRecord;
	mapPoolId: string;
	mapPoolName: string;
	maps: MapOption[];
	steps: StepDefinition[];
	currentStepIndex: number;
	config: PickBansSessionConfig;
	currentTurn?: ActiveTurn;
	history: StepResult[];
}

export interface PickBansSessionStateEvent {
	type: 'pickbans_session_state';
	session: PickBansSessionState | null; // null when a session is cancelled
}

interface WelcomeEvent {
	type: 'welcome';
	message: string; // "Connected to WebSocket server"
	timestamp: number; // Unix timestamp
}
// MARK: Timer

// modified, added timer_checkpoint
type TimerEventType = 'timer_start' | 'timer_stop' | 'timer_finish' | 'timer_checkpoint';

const STYLES = {
	RocketJump: 0,
	StickyJump: 1,
	EngineerJump: 2,
	PyroJump: 3,
	Conc: 4
} as const;
type Style = (typeof STYLES)[keyof typeof STYLES];

// modified
export interface BaseTimerEvent {
	type: TimerEventType;
	steamid: number; // the ID portion of steamID3 format [U:1:50734103]
	track: number; // 0 for main track, >0 is bonuses
	style: Style;
	timestamp: number; // Unix timestamp
	tick?: number;
}

/*
{"type":"timer_start","steamid":50734103,"track":0,"style":0,"timestamp":10000}
{"type":"timer_start","steamid":99019190,"track":0,"style":0,"timestamp":10000}
*/
interface TimerStartEvent extends BaseTimerEvent {
	type: 'timer_start';
}

/*
{"type":"timer_stop","steamid":50734103,"track":0,"style":0,"timestamp":10000}
{"type":"timer_stop","steamid":99019190,"track":0,"style":0,"timestamp":10000}
*/
interface TimerStopEvent extends BaseTimerEvent {
	type: 'timer_stop';
}

/*
{"type":"timer_finish","steamid":50734103,"track":0,"style":0,"timestamp":10000,"time":600,"jumps":21,"strafes":21,"sync":50,"oldtime":500,"perfs":21,"avgvel":1000,"maxvel":3500}
{"type":"timer_finish","steamid":99019190,"track":0,"style":0,"timestamp":10000,"time":600,"jumps":21,"strafes":21,"sync":50,"oldtime":500,"perfs":21,"avgvel":1000,"maxvel":3500}
*/
interface TimerFinishEvent extends BaseTimerEvent {
	type: 'timer_finish';
	time: number; // time in seconds float32
	jumps: number; // number of jumps (measured as +IN_JUMP)
	strafes: number; // number of strafes
	sync: number; // float ranging from 0 to 100
	oldtime: number; // time in seconds float32 - previous PR time
	perfs: number; // number of bhops
	avgvel: number; // average abs velocity float32
	maxvel: number; // max abs velocity float32
}

/*
{"type":"timer_checkpoint","steamid":50734103,"track":0,"style":0,"timestamp":10000,"tick":450,"formattedCheckpoint":"Checkpoint 1","time":300}
{"type":"timer_checkpoint","steamid":99019190,"track":0,"style":0,"timestamp":11000,"tick":500,"formattedCheckpoint":"Checkpoint 1","time":320}
{"type":"timer_checkpoint","steamid":50734103,"track":0,"style":0,"timestamp":12000,"tick":450,"formattedCheckpoint":"Checkpoint 2","time":400}
{"type":"timer_checkpoint","steamid":99019190,"track":0,"style":0,"timestamp":13000,"tick":450,"formattedCheckpoint":"Checkpoint 2","time":380}
{"type":"timer_checkpoint","steamid":50734103,"track":0,"style":0,"timestamp":14000,"tick":450,"formattedCheckpoint":"Checkpoint 3","time":550}
{"type":"timer_checkpoint","steamid":99019190,"track":0,"style":0,"timestamp":15000,"tick":500,"formattedCheckpoint":"Checkpoint 3","time":551.3}
*/
interface TimerCheckpointEvent extends BaseTimerEvent {
	type: 'timer_checkpoint';
	tick: number;
	formattedCheckpoint: string;
	time: number;
}

// MARK: Competition
// written by me for now, will get kingstripes' interfaces at some point
interface BaseCompetitionEvent {
	type:
		| 'competition_session_live'
		| 'competition_session_overtime'
		| 'competition_session_ended'
		| 'competition_session_player_end';
	timestamp: number;
	sessionId: number;
	startedAt: number;
	durationSeconds: number;
}

// {"type":"competition_session_live","timestamp":1780753370,"sessionId":49,"startedAt":1780753370,"durationSeconds":60,"expiresAt":1780753430}
interface CompetitionLiveEvent extends BaseCompetitionEvent {
	type: 'competition_session_live';
	expiresAt: number;
}

// {"type":"competition_session_overtime","timestamp":1780753430,"sessionId":49,"startedAt":1780753370,"durationSeconds":60,"expiredAt":1780753430}
interface CompetitionOvertimeEvent extends BaseCompetitionEvent {
	type: 'competition_session_overtime';
	expiredAt: number;
}

/*
{"type":"competition_session_ended","timestamp":1780753370,"sessionId":49,"startedAt":1780753370,"durationSeconds":60,"expiredAt":1780753430}
*/
interface CompetitionEndEvent extends BaseCompetitionEvent {
	type: 'competition_session_ended';
	expiredAt: number;
}

// MARK: Messages

export type MessageTypes =
	| PickBansSessionStateEvent
	| TimerStartEvent
	| TimerStopEvent
	| TimerFinishEvent
	| TimerCheckpointEvent
	| CompetitionLiveEvent
	| CompetitionOvertimeEvent
	| CompetitionEndEvent;

export type Messages = {
	mapPicks: PickBansSessionStateEvent;
	timer: BaseTimerEvent[];
	competition: BaseCompetitionEvent[];
};

export const defaultMessages = {
	mapPicks: { type: 'pickbans_session_state', session: null },
	timer: [],
	competition: []
} as Messages;

// test checkpoint object - {"type": "timer_checkpoint","steamid": 50734103,"track": 0,"style": 1,"formattedCheckpoint": "Checkpoint 1","time": 6.25499963760376,"timestamp": 1780761188,"tick": 2428}
