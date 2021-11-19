import { Store, StoreOptions } from './store'
import { safeStorage } from 'electron'

interface OBSConnection {
  host: string;
  port?: number;
  password?: string;
}

function isOBSConnection(obj: any): obj is OBSConnection {
  let hasRequiredFields = (obj as OBSConnection).host !== undefined
    && typeof (obj as OBSConnection).host === 'string';
  if (!hasRequiredFields) {
    return false;
  }

  if ((obj as OBSConnection).port !== undefined) {
    if (typeof (obj as OBSConnection).port !== 'number') {
      return false;
    }
  }

  if ((obj as OBSConnection).password !== undefined) {
    if (typeof (obj as OBSConnection).password !== 'string') {
      return false;
    }
  }

  return true;
}

export default class Preferences {
  store: Store;

  constructor(options: StoreOptions) {
    this.store = new Store(options);
  }

  get obsConnection(): OBSConnection | null {
    let connection = this.store.get('obs-connection');
    if (isOBSConnection(connection)) {
      if (connection.password) {
        connection.password = safeStorage.decryptString(Buffer.from(connection.password, 'base64'))
      }
      
      return connection;
    }

    return null;
  }

  set obsConnection(value: OBSConnection | null) {
    if (value && value.password) {
      value.password = safeStorage.encryptString(value.password).toString('base64')
    }

    this.store.set('obs-connection', value)
  }
}