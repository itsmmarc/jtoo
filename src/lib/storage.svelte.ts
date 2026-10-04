import { PersistentState } from '@friendofsvelte/state';
import {
        type Items,
        type Overlay,
        type Settings,
        Player,
        type SteamID3,
        TFMap,
        Tournament,
        type TempusID
} from './types';
import { getPlayerByTempusID, getPlayerIndexByTempusID } from './util';
import { Tempus2 } from './api/tempus2/api-tempus2';
import { Steam } from './api/steam/api-steam';

export const defaultStages: Array<string> = [
        '',
        'Round 1',
        'Round 2',
        'Quarterfinals',
        'Semifinals',
        'Finals',
        'Grand Finals',
        "Loser's Quarters",
        "Loser's Semis",
        "Loser's Finals"
];



export const defaultSettings: Settings = {
        font: 'font-space-grotesk',
        monoFont: 'font-chivo-mono',
        hue: 0,
        saturation: 100,
        enableMovingBG: true,
        enablePRs: true,
        enableAvatars: true,
        enableTags: false,
        enableFlags: true,
        enableGradient: true,
        enableTeamColors: true,
        enablePOVGuide: false,
        useShortMapNames: true,
        ksnWebSocketToken: '',
        overlayScene: 'MatchScene',
        obsWsIp: '',
        obsWsPort: undefined,
        obsWsPw: ''
};

export const defaultOverlay: Overlay = {
        bestOf: 3,
        players: [undefined, undefined, undefined, undefined],
        map: '',
        stage: '',
        tournament: new Tournament()
};

export const defaultItems: Items = {
        players: [new Player()],
        maps: [new TFMap()],
        stages: defaultStages,
        tournaments: [new Tournament()]
};

// overlay settings
export const settings = new PersistentState('settings', defaultSettings, 'localStorage');

// overlay state
export const overlay = new PersistentState('overlay', defaultOverlay);

// overlay items
export const items = new PersistentState('items', defaultItems);

export function fullReset() {
        settings.current = defaultSettings;
        overlay.current = defaultOverlay;
        // items.current = defaultItems;
}

const bootcampTestPlayers: TempusID[] = [
        11459, 12754, 325297, 378025, 24856, 47849, 511949, 121553, 83019, 597475
]

async function addPlayersFromTempusID(tempusIds: TempusID[]) {
        for (const tempusId of tempusIds) {
                // skip existing players
                // if (getPlayerIndexByTempusID(tempusId) == -1) continue

                console.log(`adding ${tempusId}`)

                // fetch player
                let player = await Tempus2.fetchPlayerByTempusID(tempusId)

                if (!player) continue

                player.avatarURL = await Steam.fetchPlayerAvatar(player.steamID)

                items.current.players.push(player)
        }
}
function tempusIDsToSteamID3s(tempusIds: TempusID[]): SteamID3[] {
        let list = []
        for (const tId of tempusIds) {
                list.push(getPlayerByTempusID(tId).steamID3)
        }
        return list
}

export async function addBootcampTestTournament() {
        await addPlayersFromTempusID(bootcampTestPlayers)
        let tournament = new Tournament()
        tournament.players = tempusIDsToSteamID3s(bootcampTestPlayers)
        tournament.format = 'MassRace'
        tournament.info = { name: 'BootcampTest', class: 'soldier' }
        items.current.players = [...items.current.players]
        items.current.tournaments = [...items.current.tournaments, tournament]
}

