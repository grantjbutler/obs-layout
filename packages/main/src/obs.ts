import ObsWebSocket from 'obs-websocket-js';
import onChange from 'on-change';
import sizeOf from 'image-size';
import dataUriToBuffer from 'data-uri-to-buffer';

import broadcast from './broadcast';
import type { OBSConnectionOptions, Source } from '../../shared/src/obs';
import { OBSConnectionState } from '../../shared/src/obs';
import type { Size } from '../../shared/src/layout';
import { zip } from 'lodash';
import assert from 'assert';

interface OBSSocketOptions {
  sourceFilter: string;
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

  _lastConnectionOptions: OBSConnectionOptions | null = null;
  _reconnectInterval: NodeJS.Timer | null = null;

  constructor(options: OBSSocketOptions) {
    this._sourceFilter = options.sourceFilter;

    this.sources = [];
    this._socket.on('SourceCreated', (data) => this._sourceCreated(data));
    this._socket.on('SourceDestroyed', (data) => this._sourceDestroyed(data));
    this._socket.on('SourceRenamed', (data) => this._sourceRenamed(data));

    this._socket.on('ScenesChanged', (data) => this._scenesChanged(data));

    this._socket.on('ProfileChanged', () => this._profileChanged());

    this._socket.on('error', () => this._reconnect());
    this._socket.on('ConnectionClosed', () => this._connectionClosed());
  }

  connect(options: OBSConnectionOptions): Promise<unknown> {
    return this._connect(options)
      .catch(() => {
        this.state = OBSConnectionState.Error;
      });
  }

  disconnect(): void {
    if (this._reconnectInterval) {
      clearTimeout(this._reconnectInterval);
      this._reconnectInterval = null;
    }

    this.state = OBSConnectionState.Disconnected;

    this._socket.disconnect();
  }

  _connect(options: OBSConnectionOptions): Promise<unknown> {
    this.state = OBSConnectionState.Connecting;

    return this._socket.connect({
      address: `${options.host}:${options.port}`,
      password: options.password,
    })
    .then(() => {
      this._lastConnectionOptions = options;
      this.state = OBSConnectionState.Connected;

      if (this._reconnectInterval) {
        clearTimeout(this._reconnectInterval);
        this._reconnectInterval = null;
      }
    })
    .then(() => {
      return this._fullUpdate();
    });
  }

  _reconnect(): void {
    if (this._reconnectInterval) { return; }

    const connectionOptions = this._lastConnectionOptions;
    if (!connectionOptions) { return; }

    this.state = OBSConnectionState.Reconnecting;

    this._reconnectInterval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this._connect(connectionOptions).catch(() => {});
    }, 5000);
  }

  syncLayout(nodes: Node[], sceneName: string): Promise<void> {
    return this._socket.send('GetSceneItemList', { sceneName })
      .then(response => {
        const includedSources = nodes.map(node => node.sourceName);
        const itemsToDelete = response.sceneItems.filter(item => !includedSources.includes(item.sourceName));

        return this._deleteSources(sceneName, itemsToDelete)
          .then(() => {
            const existingSources = filterMap(response.sceneItems, item => {
              const node = nodes.find(node => node.sourceName === item.sourceName);
              if (!node) { return undefined; }
              return {...item, node};
            });
            return existingSources;
          });
      })
      .then(existingSources => {
        const existingSourceNames = existingSources.map(item => item.sourceName);
        const itemsToAdd = nodes.filter(node => !existingSourceNames.includes(node.sourceName));

        return this._addSources(sceneName, itemsToAdd.map(node => node.sourceName))
          .then(itemIds => {
            assert(itemIds.length == itemsToAdd.length, 'Expected to have the same number of successful items added as the number of items that we requested to add.');

            return zip(itemIds, itemsToAdd)
              .map(arg => ({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                itemId: arg[0]!,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                node: arg[1]!,
              }));
          })
          .then(addedSources => {
            return addedSources.concat(existingSources);
          });
      })
      .then(allSources => this._positionSources(sceneName, allSources));
  }

  _deleteSources(sceneName: string, items: { sourceName: string, itemId: number }[]): Promise<void> {
    return this._socket.send('ExecuteBatch', {
      requests: items.map(item => ({
          'request-type': 'DeleteSceneItem',
          scene: sceneName,
          item: {
            id: item.itemId,
            name: item.sourceName,
          },
          'message-id': `delete-${item.sourceName}`,
      })),
    })
    .then(value => {
      const undeleted: string[] = [];
      value.results.forEach(result => {
        if (result.error && result['message-id'].startsWith('delete-')) {
          undeleted.push(removePrefix(result['message-id'], 'delete-'));
        }
      });
      if (undeleted.length) {
        throw `Unable to delete the following sources: ${undeleted.join(', ')}`;
      }
    });
  }

  _addSources(sceneName: string, sources: string[]): Promise<number[]> {
    return this._socket.send('ExecuteBatch', {
      requests: sources.map(source => ({
        'request-type': 'AddSceneItem',
        sceneName,
        sourceName: source,
        'message-id': `create-${source}`,
      })),
    })
    .then(value => {
      const uncreated: string[] = [];
      value.results.forEach(result => {
        if (result.error && result['message-id'].startsWith('create-')) {
          uncreated.push(removePrefix(result['message-id'], 'create-'));
        }
      });
      if (uncreated.length) {
        throw `Unable to create the following sources: ${uncreated.join(', ')}`;
      } else {
        return value.results.map(result => result.itemId as number);
      }
    });
  }

  _positionSources(sceneName: string, items: { itemId: number, node: Node }[]): Promise<void> {
    return this._socket.send('ExecuteBatch', {
      requests: items.map(({ itemId, node }) => ({
        'request-type': 'SetSceneItemProperties',
        'scene-name': sceneName,
        item: { id: itemId },
        position: { x: node.frame.x, y: node.frame.y },
        scale: { x: node.frame.width, y: node.frame.height },
        crop: {},
        bounds: {},
        'message-id': `position-${node.sourceName}`,
      })),
    })
    .then(value => {
      const unpositioned: string[] = [];
      value.results.forEach(result => {
        if (result.error && result['message-id'].startsWith('position-')) {
          unpositioned.push(removePrefix(result['message-id'], 'position-'));
        }
      });
      if (unpositioned.length) {
        throw `Unable to position the following sources: ${unpositioned.join(', ')}`;
      }
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

  screenshotSource(sourceName: string): Promise<string> {
    return this._screenshotSource(sourceName, ImageQuality.Best);
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
      .then((sources) => this._getSizesOfSources(sources))
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

  _getSizesOfSources(sourceNames: string[]): Promise<{name: string, width: number, height: number}[]> {
    return Promise.allSettled(sourceNames.map(sourceName => {
      return this._getSourceSize(sourceName)
        .then(size => ({
          name: sourceName,
          width: size.width,
          height: size.height,
        }));
    }))
    .then(sources => {
      return (sources.filter(source => source.status == 'fulfilled') as PromiseFulfilledResult<Source>[])
        .map(source => source.value);
    });
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
    return this._screenshotSources([sourceName], quality)
      .then(results => results[sourceName]);
  }

  _screenshotSources(sourceNames: string[], quality: ImageQuality = ImageQuality.Best): Promise<{ [index: string]: string }> {
    const requests = sourceNames.map(sourceName => {
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

      return {
        ...options,
        'request-type': 'TakeSourceScreenshot',
        'message-id': `${sourceName}-screenshot`,
      };
    });

    return this._socket.send('ExecuteBatch', { requests, abortOnFail: false })
      .then(({ results }) => {
        return results.reduce((images, result) => {
          let sourceName: string;
          if (result['message-id'] && result['message-id'].endsWith('-screenshot')) {
            sourceName = result['message-id'].substring(0, result['message-id'].length - '-screenshot'.length);
          } else {
            return images;
          }

          images[sourceName] = result.img;

          return images;
        }, {} as { [index: string]: string });
      });
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

  _connectionClosed() {
    if (this.state != OBSConnectionState.Disconnected) {
      this._reconnect();
    }
  }
}

function filterMap<T, N>(items: T[], callback: (item: T) => N | undefined): N[] {
  const newItems: N[] = [];
  for (const item of items) {
    const newItem = callback(item);
    if (!newItem) { continue; }
    newItems.push(newItem);
  }
  return newItems;
}

function removePrefix(string: string, prefix: string): string {
  if (!string.startsWith(prefix)) { return string; }
  return string.substring(prefix.length);
}
