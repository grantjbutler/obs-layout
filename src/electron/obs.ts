import ObsWebSocket from "obs-websocket-js";
import onChange from 'on-change';

import broadcast from "./broadcast";
import { OBSConnectionState } from "@/obs/connection-state";
import { OBSConnectionOptions } from "@/obs/connection";

interface OBSSocketOptions {
  sourceFilter: string
}

export default class OBSSocket {
  _state = OBSConnectionState.Disconnected;
  _socket = new ObsWebSocket();

  _filter = '';

  _sources: string[] = [];

  constructor(options: OBSSocketOptions) {
    this._filter = options.sourceFilter;

    this.sources = [];
    this._socket.on('SourceCreated', (data) => this._sourceCreated(data));
    this._socket.on('SourceDestroyed', (data) => this._sourceDestroyed(data));
    this._socket.on('SourceRenamed', (data) => this._sourceRenamed(data));
  }

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
    })
    .then(() => {
      return this._fullUpdate();
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

    broadcast('obs-connection-state', state);
  }

  get sources(): string[] {
    return onChange.target(this._sources);
  }

  set sources(sources: string[]) {
    this._sources = onChange(sources, function () { broadcast('obs-sources', onChange.target(this)); });

    broadcast('obs-sources', sources);
  }

  get sourceFilter(): string {
    return this._filter;
  }

  set sourceFilter(filter: string) {
    this._filter = filter;

    this._fullUpdate();
  }

  _fullUpdate(): Promise<unknown> {
    return Promise.all([
      this._fetchSources()
    ])
  }

  _fetchSources(): Promise<unknown> {
    return this._socket.send('GetSourcesList')
      .then((response) => {
        this.sources = response.sources
          .filter(source => source.type == 'input' && source.name.includes(this._filter))
          .map(source => source.name);
      })
  }

  _sourceCreated({ sourceName, sourceType }: { sourceName: string, sourceType: string }): void {
    if (sourceType != 'input') { return }
    this._sources.push(sourceName);
  }

  _sourceDestroyed({ sourceName }: { sourceName: string }): void {
    const sourceIndex = this.sources.indexOf(sourceName);
    if (sourceIndex < 0) { return }
    this._sources.splice(sourceIndex, 1);
  }

  _sourceRenamed({ previousName, newName, sourceType }: { previousName: string, newName: string, sourceType: string }): void {
    if (sourceType != 'input') { return }
    const sourceIndex = this.sources.indexOf(previousName);
    const newNameMatchesFilter = newName.includes(this._filter);

    if (sourceIndex < 0) {
      if (newNameMatchesFilter) {
        this._sources.push(newName);
      }
    } else {
      if (newNameMatchesFilter) {
        this._sources[sourceIndex] = newName;
      } else {
        this._sources.splice(sourceIndex, 1);
      }
    }
  }
}