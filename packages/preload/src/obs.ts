import { ipcRenderer } from 'electron';
import type { OBSConnectionOptions, OBSConnectionState, Source } from '../../shared/src/obs';

export function connect(options: OBSConnectionOptions) {
  ipcRenderer.send('connect-to-obs', JSON.parse(JSON.stringify(options)));
}

export function disconnect() {
  ipcRenderer.send('disconnect-from-obs');
}

export function getConnectionStatus(): Promise<OBSConnectionState> {
  return ipcRenderer.invoke('get-obs-connection-status');
}

export function onConnectionStateChanged(handler: (value: OBSConnectionState) => void) {
  ipcRenderer.on('obs-connection-state', (_, value: OBSConnectionState) => handler(value));
}

export function onSourcesChanged(handler: (value: Source[]) => void) {
  ipcRenderer.on('obs-sources', (_, value: Source[]) => handler(value));
}

export function onScenesChanged(handler: (value: string[]) => void) {
  ipcRenderer.on('obs-scenes', (_, value: string[]) => handler(value));
}

export function getSources(): Promise<Source[]> {
  return ipcRenderer.invoke('get-obs-sources');
}

export function getScenes(): Promise<string[]> {
  return ipcRenderer.invoke('get-obs-scenes');
}

export interface Node {
  sourceName: string;
  frame: {
    x: number;
    y: number;
    width: number;
    height: number
  }
}

export function sync(nodes: Node[], sceneName: string) {
  ipcRenderer.invoke('sync-layout-to-scene', nodes, sceneName);
}
