import type { OBSConnectionOptions } from '../../shared/src/obs';
import { ipcMain } from 'electron';
import type OBSSocket from '/@/obs';
import type Preferences from './preferences';
import type { Node } from './obs';

export interface InstallationOptions {
  preferences: Preferences,
  obsSocket: OBSSocket
}

export function install(options: InstallationOptions): void {
  ipcMain.handle('load-obs-connection', async () => {
    return options.preferences.obsConnection;
  });

  ipcMain.on('connect-to-obs', async (_, connection: OBSConnectionOptions) => {
    options.preferences.obsConnection = connection;

    options.obsSocket.connect(connection);
  });

  ipcMain.on('disconnect-from-obs', () => {
    options.obsSocket.disconnect();
  });

  ipcMain.handle('get-obs-connection-status', () => {
    return options.obsSocket.state;
  });

  ipcMain.handle('get-obs-sources', () => {
    return options.obsSocket.sources;
  });

  ipcMain.handle('load-source-filter', () => {
    return options.preferences.sourceFilter;
  });

  ipcMain.on('set-source-filter', (_, filter: string) => {
    options.preferences.sourceFilter = filter;

    options.obsSocket.sourceFilter = filter;
  });

  ipcMain.handle('load-scene-filter', () => {
    return options.preferences.sceneFilter;
  });

  ipcMain.on('set-scene-filter', (_, filter: string) => {
    options.preferences.sceneFilter = filter;

    options.obsSocket.sceneFilter = filter;
  });

  ipcMain.handle('get-obs-scenes', () => {
    return options.obsSocket.scenes;
  });

  ipcMain.handle('sync-layout-to-scene', (_, nodes: Node[], sceneName: string) => {
    return options.obsSocket.syncLayout(nodes, sceneName);
  });

  ipcMain.handle('get-obs-canvas-size', () => {
    return options.obsSocket.canvasSize;
  });

  ipcMain.on('refresh-obs-settings', () => {
    options.obsSocket.refreshSettings();
  });

  ipcMain.handle('screenshot-obs-source', (_, sourceName: string) => {
    return options.obsSocket.screenshotSource(sourceName);
  });
}
