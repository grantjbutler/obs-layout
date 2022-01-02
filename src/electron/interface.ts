import { OBSConnectionOptions } from "@/obs/connection";
import { ipcMain } from "electron";
import Preferences from "./preferences";

export interface InstallationOptions {
  preferences: Preferences
}

export function install(options: InstallationOptions): void {
  ipcMain.handle('load-obs-connection', () => {
    return options.preferences.obsConnection
  });

  ipcMain.on('set-obs-connection', (_, connection: OBSConnectionOptions) => {
    options.preferences.obsConnection = connection
  })
}