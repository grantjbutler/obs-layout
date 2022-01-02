import { Store, StoreOptions } from './store'
import { safeStorage } from 'electron'
import { OBSConnectionOptions, isOBSConnectionOptions } from '@/obs/connection';

export default class Preferences {
  store: Store

  constructor(options: StoreOptions) {
    this.store = new Store(options);
  }

  get obsConnection(): OBSConnectionOptions | null {
    const connection = this.store.get('obs-connection');
    if (isOBSConnectionOptions(connection)) {
      if (connection.password) {
        connection.password = safeStorage.decryptString(Buffer.from(connection.password, 'base64'))
      }
      
      return connection;
    }

    return null;
  }

  set obsConnection(value: OBSConnectionOptions | null) {
    if (value && value.password) {
      value.password = safeStorage.encryptString(value.password).toString('base64')
    }

    this.store.set('obs-connection', value)
  }
}