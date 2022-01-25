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
}