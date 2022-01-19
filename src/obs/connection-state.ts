import { BrowserWindow } from "electron"

export enum OBSConnectionState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connnected',
  Error = 'error'
}

interface ConnectionStateInterface {
  getConnectionState(): OBSConnectionState;
  setConnectionState(state: OBSConnectionState): void;
}

export function useConnectionState(): ConnectionStateInterface {
  let connectionState = OBSConnectionState.Disconnected

  return {
    getConnectionState() {
      return connectionState
    },
    setConnectionState(state: OBSConnectionState) {
      connectionState = state

      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('obs-connection-state', state);
      })
    }
  }
}