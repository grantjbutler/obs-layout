import { ipcRenderer } from 'electron';
import type { OBSConnectionOptions } from '../../shared/src/obs';

export function loadConnectionOptions(): Promise<OBSConnectionOptions | null> {
  return ipcRenderer.invoke('load-obs-connection');
}

export function loadSourceFilter(): Promise<string> {
  return ipcRenderer.invoke('load-source-filter');
}

export function loadSceneFilter(): Promise<string> {
  return ipcRenderer.invoke('load-scene-filter');
}

export function setSourceFilter(filter: string) {
  ipcRenderer.send('set-source-filter', filter);
}

export function setSceneFilter(filter: string) {
  ipcRenderer.send('set-scene-filter', filter);
}
