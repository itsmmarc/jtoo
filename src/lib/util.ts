import { indexOf } from 'underscore';
import { items } from './storage.svelte';
import { Player, TFMap, type MapFileName, type SteamID3, type TempusID } from './types';

export function getPlayer(steamID3: SteamID3 | undefined): Player {
        if (!steamID3) return items.current.players[0];
        return { ...items.current.players.filter((p) => p.steamID3 == steamID3)[0] };
}
export function getPlayerByTempusID(tempusId: TempusID | undefined): Player {
        if (!tempusId) return items.current.players[0];
        return { ...items.current.players.filter((p) => p.tempusID == tempusId)[0] };
}
export function getPlayerIndex(steamID3: SteamID3 | undefined): number {
        if (!steamID3) return -1;
        return items.current.players.findIndex((p) => p.steamID3 == steamID3);
}
export function getPlayerIndexByTempusID(tempusID: TempusID | undefined): number {
        if (!tempusID) return -1;
        return items.current.players.findIndex((p) => p.tempusID == tempusID);
}
export function getMap(mapFileName: MapFileName): TFMap {
        return { ...items.current.maps.filter((m) => m.fileName == mapFileName)[0] };
}

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
