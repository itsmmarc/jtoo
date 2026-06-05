// kingstripes
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
