import ObsWebSocket from "obs-websocket-js";
import onChange from 'on-change';
import sizeOf from 'image-size';
import dataUriToBuffer from 'data-uri-to-buffer';

import broadcast from "./broadcast";
import { OBSConnectionState } from "@/obs/connection-state";
import { OBSConnectionOptions } from "@/obs/connection";
import { Source } from '@/obs/source';

interface OBSSocketOptions {
  sourceFilter: string
}

enum ImageQuality {
  Worst = 1,
  Best = 2
}

interface ScreenshotOptions {
  sourceName: string;
  embedPictureFormat?: string | undefined;
  compressionQuality?: number | undefined;
}

export default class OBSSocket {
  _state = OBSConnectionState.Disconnected;
  _socket = new ObsWebSocket();

  _filter = '';

  _sources: Source[] = [];

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

  get sources(): Source[] {
    return onChange.target(this._sources);
  }

  set sources(sources: Source[]) {
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
        return response.sources
          .filter(source => source.type == 'input' && source.name.includes(this._filter))
          .map(source => source.name);
      })
      .then((sources) => {
        return Promise.all(sources.map(sourceName => {
          return this._getSourceSize(sourceName)
            .then(size => ({
              name: sourceName,
              width: size.width,
              height: size.height
            }))
        }))
      })
      .then(sources => this.sources = sources);
  }

  _getSourceSize(sourceName: string): Promise<{width: number, height: number}> {
    // There's got to be a better way to determine the size of a source without screenshot it.
    return this._screenshotSource(sourceName, ImageQuality.Worst)
      .then(image => {
        const size = sizeOf(dataUriToBuffer(image));
        if (!size.width || !size.height) {
          throw new Error();
        }
        return {
          width: size.width,
          height: size.height
        };
      });
  }

  _screenshotSource(sourceName: string, quality: ImageQuality = ImageQuality.Best): Promise<string> {
    const options: ScreenshotOptions = { sourceName }

    switch (quality) {
      case ImageQuality.Worst:
        options.embedPictureFormat = 'jpeg';
        options.compressionQuality = 1;
        break;
      case ImageQuality.Best:
        options.embedPictureFormat = 'png';
        break;
    }

    return this._socket.send('TakeSourceScreenshot', options)
      .then(screenshot => screenshot.img);
  }

  _sourceCreated({ sourceName, sourceType }: { sourceName: string, sourceType: string }): void {
    if (sourceType != 'input') { return }
    this._getSourceSize(sourceName)
      .then(size => ({
        name: sourceName,
        width: size.width,
        height: size.height
      }))
      .then(source => this._sources.push(source));
  }

  _sourceDestroyed({ sourceName }: { sourceName: string }): void {
    const sourceIndex = this.sources.findIndex(source => source.name == sourceName);
    if (sourceIndex < 0) { return }
    this._sources.splice(sourceIndex, 1);
  }

  _sourceRenamed({ previousName, newName, sourceType }: { previousName: string, newName: string, sourceType: string }): void {
    if (sourceType != 'input') { return }
    const sourceIndex = this.sources.findIndex(source => source.name == previousName);
    const newNameMatchesFilter = newName.includes(this._filter);

    if (sourceIndex < 0) {
      if (newNameMatchesFilter) {
        this._getSourceSize(newName)
          .then(size => ({
            name: newName,
            width: size.width,
            height: size.height
          }))
          .then(source => this._sources.push(source));
      }
    } else {
      if (newNameMatchesFilter) {
        this._sources[sourceIndex].name = newName;
      } else {
        this._sources.splice(sourceIndex, 1);
      }
    }
  }
}