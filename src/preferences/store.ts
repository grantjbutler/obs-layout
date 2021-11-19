import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

export interface StoreOptions {
  name: string;
  defaults: { [index: string]: any};
};

export class Store {
  path: string;
  data: { [index: string]: any};

  constructor(options: StoreOptions) {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, options.name + '.json');
    this.data = parseDataFile(this.path, options.defaults);
  }

  get(key: string): any {
    return this.data[key]
  }

  set(key: string, value: any) {
    this.data[key] = value

    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    } catch {}
  }
}

function parseDataFile(path: string, defaults: any) {
  try {
    return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
  } catch {
    return defaults;
  }
}