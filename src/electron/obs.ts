import ObsWebSocket from "obs-websocket-js";
import { BrowserWindow } from "electron"

import { OBSConnectionState } from "@/obs/connection-state";
import { OBSConnectionOptions } from "@/obs/connection";

export default class OBSSocket {
  _state = OBSConnectionState.Disconnected;
  _socket = new ObsWebSocket();

  connect(options: OBSConnectionOptions): Promise<unknown> {
    this.state = OBSConnectionState.Connecting;

    return this._socket.connect({
      address: `${options.host}:${options.port}`,
      password: options.password
    })
    .then(() => {
      this.state = OBSConnectionState.Connected;
    })
    .catch(() => {
      this.state = OBSConnectionState.Error;
    });
  }

  disconnect(): void {
    this.state = OBSConnectionState.Disconnected;
    
    this._socket.disconnect();
  }

  get state(): OBSConnectionState {
    return this._state;
  }

  set state(state: OBSConnectionState) {
    this._state = state;

    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('obs-connection-state', state);
    })
  }
}