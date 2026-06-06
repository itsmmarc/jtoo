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

// MARK: Timer
interface WelcomeEvent {
	type: 'welcome';
	message: string; // "Connected to WebSocket server"
	timestamp: number; // Unix timestamp
}

type TimerEventType = 'timer_start' | 'timer_stop' | 'timer_finish';

const STYLES = {
	RocketJump: 0,
	StickyJump: 1,
	EngineerJump: 2,
	PyroJump: 3,
	Conc: 4
} as const;
type Style = (typeof STYLES)[keyof typeof STYLES];

interface BaseTimerEvent {
	type: TimerEventType;
	steamid: number; // the ID portion of steamID3 format [U:1:50734103]
	track: number; // 0 for main track, >0 is bonuses
	style: Style;
	timestamp: number; // Unix timestamp
}

interface TimerStartEvent extends BaseTimerEvent {
	type: 'timer_start';
}

interface TimerStopEvent extends BaseTimerEvent {
	type: 'timer_stop';
}

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

// MARK: Messages
export type Messages = {
	mapPicks: PickBansSessionStateEvent[];
	timer: BaseTimerEvent[];
};

export const defaultMessages = {
	mapPicks: [
		{
			type: 'pickbans_session_state',
			session: null
		}
	],
	timer: []
} as Messages;
