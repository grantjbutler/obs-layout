import { OBSConnectionOptions } from "@/obs/connection";
import { ipcMain } from "electron";
import OBSSocket from "@/electron/obs";
import Preferences from "./preferences";
import { Node } from './obs';
import emitter from './events';

export interface InstallationOptions {
  preferences: Preferences,
  obsSocket: OBSSocket
}

export function install(options: InstallationOptions): void {
  ipcMain.handle('load-obs-connection', async () => {
    return await options.preferences.getObsConnection()
  });

  ipcMain.on('connect-to-obs', async (_, connection: OBSConnectionOptions) => {
    await options.preferences.setObsConnection(connection)

    options.obsSocket.connect(connection);
  });

  ipcMain.on('disconnect-from-obs', () => {
    options.obsSocket.disconnect();
  })

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
  })

  ipcMain.handle('load-scene-filter', () => {
    return options.preferences.sceneFilter;
  });

  ipcMain.on('set-scene-filter', (_, filter: string) => {
    options.preferences.sceneFilter = filter;

    options.obsSocket.sceneFilter = filter;
  })

  ipcMain.handle('get-obs-scenes', () => {
    return options.obsSocket.scenes;
  });

  ipcMain.handle('sync-layout-to-scene', (_, nodes: Node[], sceneName: string) => {
    return options.obsSocket.syncLayout(nodes, sceneName);
  })
}