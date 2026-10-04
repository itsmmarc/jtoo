import { error } from "@sveltejs/kit";

export namespace Steam {
        /**
         *
         * @param id            any type of steamID
         * @param resultFormat  steamID format to convert to
         * @returns             string for SteamID32 & 64, the numerical part of SteamID3 as number
         */
        // https://github.com/SteamRun/SteamIDConverter/blob/master/SteamIDConverter.html
        export function convertSteamId(
                id: string,
                resultFormat: 'SteamID32' | 'SteamID64' | 'SteamID3'
        ): string | number {
                let SID64_1 = '7656'; //Starting Steam ID is 76561197960265728 (javascript cant handle numbers that big, so i took firt 4 digits out) and use them as a string
                let SID64_S = Number(1197960265728); //the rest of the digits from the Starting Steam ID (to calculate with) after calculations the remaining numbers will be SID64_2

                let isSteamID = false; //prepare in case that its not a steamid
                let isCustomUrl = false; //prepare in case that its not a custom url

                let PatternSteam3ID = /^\[([Ug]):([0-9]):([0-9]+)\]$/; // [U:1:40571167] [letter:number:longer_number]
                let PatternSteamID32 = /^STEAM_([0-9]):([0-9]):([0-9]+)$/; // STEAM_0:1:20285583 //find a string starting with STEAM_number:number:longer_number
                let PatternSteamID64 = /7656([0-9]{12,14})/; // 76561198000836895 number starting with 7656 (SID32_1) and has 12-14 more numbers after (SID64_2)

                let S3ID_1;
                let S3ID_2;
                let S3ID_3 = 0;

                let SID32_1;
                let SID32_2;
                let SID32_3;

                let SID64_2;

                if (PatternSteam3ID.test(id)) {
                        // [U:1:40571167]
                        let Steam3ID = PatternSteam3ID.exec(id);
                        S3ID_1 = Steam3ID[1];
                        S3ID_2 = Number(Steam3ID[2]);
                        S3ID_3 = Number(Steam3ID[3]);
                        if (Math.abs(S3ID_3 % 2) == 1) {
                                let SID32_2 = 1;
                        } else {
                                let SID32_2 = 0;
                        } //odd or even
                        SID32_3 = (S3ID_3 - SID32_2) / 2;
                        SID64_2 = S3ID_3 + SID64_S;
                        isSteamID = true;
                } else if (PatternSteamID32.test(id)) {
                        // STEAM_0:1:20285583
                        let SteamID32 = PatternSteamID32.exec(id);
                        SID32_1 = Number(SteamID32[1]);
                        SID32_2 = Number(SteamID32[2]);
                        SID32_3 = Number(SteamID32[3]);
                        S3ID_3 = SID32_3 * 2 + SID32_2;
                        SID64_2 = S3ID_3 + SID64_S;
                        isSteamID = true;
                } else if (PatternSteamID64.test(id)) {
                        // 76561198000836895
                        let SteamID64 = PatternSteamID64.exec(id);
                        SID64_2 = Number(SteamID64[1]);
                        S3ID_3 = SID64_2 - SID64_S;
                        if (Math.abs(S3ID_3 % 2) == 1) {
                                SID32_2 = 1;
                        } else {
                                SID32_2 = 0;
                        } //odd or even
                        SID32_3 = (S3ID_3 - SID32_2) / 2;
                        isSteamID = true;
                }

                if (isSteamID == true) {
                        //handle SteamIDs
                        let S3ID = S3ID_3; // modified to only return the numeric part as this is what is used for kingstripes' tf2 websocket. eg: returns 40571167 instead of [U:1:40571167]
                        let SID32 = 'STEAM_0:' + SID32_2 + ':' + SID32_3;
                        let SID64 = SID64_1 + SID64_2;

                        switch (resultFormat) {
                                case 'SteamID32':
                                        return SID32;
                                case 'SteamID64':
                                        return SID64;
                                case 'SteamID3':
                                        return S3ID;
                                default:
                                        throw new Error(`Invalid steam id format: ${resultFormat satisfies never}`);
                        }
                } else {
                        return '';
                }
        }

        export async function fetchPlayerSummary(steamID: string) {
                steamID = convertSteamId(steamID, 'SteamID64') as string;

                const endpoint = `/api/steam/GetPlayerSummaries`;
                console.log(endpoint);
                const response = await fetch('/api/steam/GetPlayerSummaries', {
                        method: 'POST',
                        body: JSON.stringify({ steamids: steamID }),
                        headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                        throw error(response.status, 'Upstream request failed');
                }

                let data = await response.json();
                console.log(data);

                if (data) {
                        let steamPlayer: Steam.PlayerSummary = data.response[0];
                        return steamPlayer;
                } else {
                        return null;
                }
        }
        export async function fetchPlayerSummaries(steamIds: string[]) {
                for (let i = 0; i < steamIds.length; i++) {
                        steamIds[i] = convertSteamId(steamIds[i], 'SteamID64') as string;
                }

                const endpoint = `/api/steam/GetPlayerSummaries`;
                console.log(endpoint);
                const response = await fetch('/api/steam/GetPlayerSummaries', {
                        method: 'POST',
                        body: JSON.stringify({ steamids: steamIds }),
                        headers: { 'Content-Type': 'application/json' }
                });
                let data = await response.json();
                console.log(data);

                if (data) {
                        let steamPlayers: Steam.PlayerSummary[] = data.response;
                        return steamPlayers;
                } else {
                        return null;
                }
        }

        export async function fetchPlayerAvatar(steamID: string) {
                let player = await fetchPlayerSummary(steamID);

                if (player) {
                        return player.avatarfull;
                } else {
                        return '';
                }
        }
        // GetPlayerSummaries
        // https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={apiKey}&steamids={steamId64}
        export interface GetPlayerSummaries {
                response: {
                        players: PlayerSummary[];
                };
        }
        export interface PlayerSummary {
                steamid: string; // steamId64
                communityvisibilitystate: number;
                profilestate: number;
                personaname: string;
                profileurl: string;
                avatar: string;
                avatarmedium: string;
                avatarfull: string;
                avatarhash: string;
                lastlogoff: number;
                personastate: number;
                primaryclanid: number;
                timecreated: number;
                personastateflags: number;
                loccountrycode: string;
        }
}
