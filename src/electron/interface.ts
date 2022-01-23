import { OBSConnectionOptions } from "@/obs/connection";
import { useConnectionState, OBSConnectionState } from "@/obs/connection-state";
import { ipcMain } from "electron";
import ObsWebSocket from "obs-websocket-js";
import Preferences from "./preferences";

export interface InstallationOptions {
  preferences: Preferences,
  obsWebSocket: ObsWebSocket
}

export function install(options: InstallationOptions): void {
  const { getConnectionState, setConnectionState } = useConnectionState();

  ipcMain.handle('load-obs-connection', () => {
    return options.preferences.obsConnection
  });

  ipcMain.on('connect-to-obs', (_, connection: OBSConnectionOptions) => {
    options.preferences.obsConnection = connection

    setConnectionState(OBSConnectionState.Connecting);

    return options.obsWebSocket.connect({
      address: `${connection.host}:${connection.port}`,
      password: connection.password
    })
    .then(() => {
      setConnectionState(OBSConnectionState.Connected);
    })
    .catch((error) => {
      setConnectionState(OBSConnectionState.Error);
    });
  });

  ipcMain.on('disconnect-from-obs', () => {
    setConnectionState(OBSConnectionState.Disconnected);
    
    options.obsWebSocket.disconnect();
  })

  ipcMain.handle('get-obs-connection-status', () => {
    return getConnectionState();
  });
}