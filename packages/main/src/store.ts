import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export interface StoreOptions {
  defaults: { [index: string]: unknown }
}

export class Store {
  path: string;
  data: { [index: string]: unknown };

  constructor(options: StoreOptions) {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, 'config.json');
    this.data = parseDataFile(this.path, options.defaults);
  }

  get(key: string): unknown {
    return this.data[key];
  }

  set(key: string, value: unknown): void {
    this.data[key] = value;

    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
    } catch (e) {
      console.error(`Error saving preferences: ${e}`);
    }
  }
}

function parseDataFile(path: string, defaults: unknown) {
  try {
    return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
  } catch {
    return defaults;
  }
}
