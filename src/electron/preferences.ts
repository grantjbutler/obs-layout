import { Store, StoreOptions } from './store'
import { OBSConnectionOptions, isOBSConnectionOptions } from '@/obs/connection';
import keytar from 'keytar';
import { clone } from 'lodash';

export default class Preferences {
  store: Store

  constructor(options: StoreOptions) {
    this.store = new Store(options);
  }

  async getObsConnection(): Promise<OBSConnectionOptions | null> {
    const connection = this.store.get('obsConnection');

    if (!isOBSConnectionOptions(connection)) { return null }

    try {
      connection.password = await keytar.getPassword('obs-websocket', 'obs') ?? undefined
    } catch {
      console.error('Could not fetch password from secure storage');
    }

    return connection;
  }

  async setObsConnection(value: OBSConnectionOptions | null): Promise<void> {
    const options = clone(value)

    if (options && options.password) {
      await keytar.setPassword('obs-websocket', 'obs', options.password);
      options.password = undefined
    }

    this.store.set('obsConnection', options);
  }

  get sourceFilter(): string {
    const sourceFilter = this.store.get('sourceFilter')
    if (typeof sourceFilter !== 'string') {
      return '';
    }

    return sourceFilter;
  }

  set sourceFilter(value: string) {
    this.store.set('sourceFilter', value);
  }

  get sceneFilter(): string {
    const sceneFilter = this.store.get('sceneFilter');
    if (typeof sceneFilter !== 'string') {
      return '';
    }

    return sceneFilter;
  }

  set sceneFilter(value: string) {
    this.store.set('sceneFilter', value)
  }
}