import type { StoreOptions } from './store';
import { Store } from './store';
import type { OBSConnectionOptions} from '../../shared/src/obs';
import { isOBSConnectionOptions } from '../../shared/src/obs';
import { clone } from 'lodash';
import { safeStorage } from 'electron';

const ENCRYPTED_PREFIX = 'encrypted:';

export default class Preferences {
  store: Store;

  constructor(options: StoreOptions) {
    this.store = new Store(options);
  }

  get obsConnection(): OBSConnectionOptions | null {
    const connection = this.store.get('obsConnection');

    if (!isOBSConnectionOptions(connection)) { return null; }

    if (connection.password) {
      if (connection.password.startsWith(ENCRYPTED_PREFIX) && safeStorage.isEncryptionAvailable()) {
        connection.password = safeStorage.decryptString(Buffer.from(connection.password.slice(ENCRYPTED_PREFIX.length), 'base64'));
      } else if (connection.password.startsWith(ENCRYPTED_PREFIX) && !safeStorage.isEncryptionAvailable()) {
        throw new Error();
      }
    }

    return connection;
  }

  set obsConnection(value: OBSConnectionOptions | null) {
    const options = clone(value);

    if (options && options.password && safeStorage.isEncryptionAvailable()) {
      options.password = ENCRYPTED_PREFIX + safeStorage.encryptString(options.password).toString('base64');
    }

    this.store.set('obsConnection', options);
  }

  get sourceFilter(): string {
    const sourceFilter = this.store.get('sourceFilter');
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
    this.store.set('sceneFilter', value);
  }
}
