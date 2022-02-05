import { Store, StoreOptions } from './store'
import { safeStorage } from 'electron'
import { OBSConnectionOptions, isOBSConnectionOptions } from '@/obs/connection';
import keytar from 'keytar';

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
      
      connection.password = undefined
    }

    return null;
  }

  async setObsConnection(value: OBSConnectionOptions | null): Promise<void> {
    if (value && value.password) {
      await keytar.setPassword('obs-websocket', 'obs', value.password);
      value.password = undefined
    }

    this.store.set('obsConnection', value);
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
}