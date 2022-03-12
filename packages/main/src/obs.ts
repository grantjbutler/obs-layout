import ObsWebSocket from 'obs-websocket-js';
import onChange from 'on-change';
import sizeOf from 'image-size';
import dataUriToBuffer from 'data-uri-to-buffer';

import broadcast from './broadcast';
import type { OBSConnectionOptions, Source } from '../../shared/src/obs';
import { OBSConnectionState } from '../../shared/src/obs';
import type { Size } from '../../shared/src/layout';

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

export interface Node {
  sourceName: string,
  frame: {
    x: number,
    y: number,
    width: number,
    height: number
  }
}

export default class OBSSocket {
  _state = OBSConnectionState.Disconnected;
  _socket = new ObsWebSocket();

  _sourceFilter = '';
  _sceneFilter = '';

  _sources: Source[] = [];
  _scenes: string[] = [];

  _canvasSize: Size = { width: 1920, height: 1080 };

  constructor(options: OBSSocketOptions) {
    this._sourceFilter = options.sourceFilter;

    this.sources = [];
    this._socket.on('SourceCreated', (data) => this._sourceCreated(data));
    this._socket.on('SourceDestroyed', (data) => this._sourceDestroyed(data));
    this._socket.on('SourceRenamed', (data) => this._sourceRenamed(data));

    this._socket.on('ScenesChanged', (data) => this._scenesChanged(data));

    this._socket.on('ProfileChanged', () => this._profileChanged());
  }

  connect(options: OBSConnectionOptions): Promise<unknown> {
    this.state = OBSConnectionState.Connecting;

    return this._socket.connect({
      address: `${options.host}:${options.port}`,
      password: options.password,
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

  syncLayout(nodes: Node[], sceneName: string): Promise<void[]> {
    return this._socket.send('GetSceneItemList', { sceneName })
      .then(response => {
        return Promise.all(
          // This could probably use some optimization. I could be smart about only deleting the things that don't exist between the old layout and the new layout, rather
          // than deleting every single item and then adding them back in.
          response.sceneItems.map(item => {
            return this._socket.send('DeleteSceneItem', { scene: sceneName, item: { name: item.sourceName, id: item.itemId }});
          }),
        );
      })
      .then(() => {
        return Promise.all(
          nodes.map(node => {
            return this._socket.send('AddSceneItem', { sceneName, sourceName: node.sourceName })
              .then(response => {
                this._socket.send(
                  'SetSceneItemProperties',
                  {
                    'scene-name': sceneName,
                    item: { id: response.itemId },
                    position: { x: node.frame.x, y: node.frame.y },
                    scale: { x: node.frame.width, y: node.frame.height },
                    crop: {},
                    bounds: {},
                  });
              });
          }),
        );
      });
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

  get scenes(): string[] {
    return onChange.target(this._scenes);
  }

  set scenes(scenes: string[]) {
    this._scenes = onChange(scenes, function () { broadcast('obs-scenes', onChange.target(this)); });

    broadcast('obs-scenes', scenes);
  }

  get sourceFilter(): string {
    return this._sourceFilter;
  }

  set sourceFilter(filter: string) {
    this._sourceFilter = filter;

    this._fetchSources();
  }

  get sceneFilter(): string {
    return this._sceneFilter;
  }

  set sceneFilter(filter: string) {
    this._sceneFilter = filter;

    this._fetchScenes();
  }

  get canvasSize(): Size {
    return this._canvasSize;
  }

  set canvasSize(size: Size) {
    this._canvasSize = size;

    broadcast('obs-canvas-size', size);
  }

  refreshSettings() {
    this._fullUpdate();
  }

  _fullUpdate(): Promise<unknown> {
    return Promise.all([
      this._fetchCanvasSize(),
      this._fetchSources(),
      this._fetchScenes(),
    ]);
  }

  _fetchSources(): Promise<void> {
    return this._socket.send('GetSourcesList')
      .then((response) => {
        return response.sources
          .filter(source => source.type == 'input' && source.name.includes(this._sourceFilter))
          .map(source => source.name);
      })
      .then((sources) => {
        return Promise.allSettled(sources.map(sourceName => {
          return this._getSourceSize(sourceName)
            .then(size => ({
              name: sourceName,
              width: size.width,
              height: size.height,
            }));
        }));
      })
      .then(sources => {
        return (sources.filter(source => source.status == 'fulfilled') as PromiseFulfilledResult<Source>[])
          .map(source => source.value);
      })
      .then(sources => { this.sources = sources; });
  }

  _fetchScenes(): Promise<unknown> {
    return this._socket.send('GetSceneList')
      .then((response) => {
        return response.scenes
          .filter(scene => scene.name.includes(this._sceneFilter))
          .map(scene => scene.name);
      })
      .then(scenes => { this.scenes = scenes; });
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
          height: size.height,
        };
      });
  }

  _screenshotSource(sourceName: string, quality: ImageQuality = ImageQuality.Best): Promise<string> {
    const options: ScreenshotOptions = { sourceName };

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

  _fetchCanvasSize(): Promise<void> {
    return this._socket.send('GetVideoInfo')
      .then(info => { this.canvasSize = { width: info.baseWidth, height: info.baseHeight }; });
  }

  _sourceCreated({ sourceName, sourceType }: { sourceName: string, sourceType: string }): void {
    if (sourceType != 'input') { return; }
    this._getSourceSize(sourceName)
      .then(size => ({
        name: sourceName,
        width: size.width,
        height: size.height,
      }))
      .then(source => this._sources.push(source));
  }

  _sourceDestroyed({ sourceName }: { sourceName: string }): void {
    const sourceIndex = this.sources.findIndex(source => source.name == sourceName);
    if (sourceIndex < 0) { return; }
    this._sources.splice(sourceIndex, 1);
  }

  _sourceRenamed({ previousName, newName, sourceType }: { previousName: string, newName: string, sourceType: string }): void {
    if (sourceType != 'input') { return; }
    const sourceIndex = this.sources.findIndex(source => source.name == previousName);
    const newNameMatchesFilter = newName.includes(this._sourceFilter);

    if (sourceIndex < 0) {
      if (newNameMatchesFilter) {
        this._getSourceSize(newName)
          .then(size => ({
            name: newName,
            width: size.width,
            height: size.height,
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

  _scenesChanged({ scenes }: { scenes: { name: string }[]}): void {
    this.scenes = scenes
      .filter(scene => scene.name.includes(this._sceneFilter))
      .map(scene => scene.name);
  }

  _profileChanged() {
    this._fetchCanvasSize();
  }
}
