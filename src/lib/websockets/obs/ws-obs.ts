import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

export async function obsConnect(ip: string, port: number, password: string) {
        const fullIp = `ws://${ip}:${port}`
        await obs.connect(fullIp, password);
        obs.emit('ConnectionOpened')
        console.log(obs);
}

export async function setScene(sceneName: string) {
        try {
                await obs.call('SetCurrentProgramScene', { sceneName, sceneUuid: undefined });
        } catch (error: any) {
                console.error('obs websocket failed to connect', error.code, error.message)
        }
}
