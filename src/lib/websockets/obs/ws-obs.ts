import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

export async function obsConnect(ip: string, port: number, password: string) {
        const fullIp = `ws://${ip}:${port}`
	await obs.connect(fullIp, password);
	console.log(obs);
}

export async function setScene(sceneName: string) {
	await obs.call('SetCurrentProgramScene', { sceneName, sceneUuid: undefined });
}
