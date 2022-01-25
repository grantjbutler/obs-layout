import { OBSConnectionOptions } from "@/obs/connection";
import { ipcMain } from "electron";
import OBSSocket from "@/electron/obs";
import Preferences from "./preferences";

export interface InstallationOptions {
  preferences: Preferences,
  obsSocket: OBSSocket
}

export function install(options: InstallationOptions): void {
  ipcMain.handle('load-obs-connection', () => {
    return options.preferences.obsConnection
  });

  ipcMain.on('connect-to-obs', (_, connection: OBSConnectionOptions) => {
    options.preferences.obsConnection = connection

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
}