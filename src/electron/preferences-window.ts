'use strict'

import { BrowserWindow } from 'electron'
import { injectSystemColors } from './colors';

let preferencesWindow: BrowserWindow | undefined

async function createPreferencesWindow() {
  preferencesWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    fullscreenable: false,
    maximizable: false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  preferencesWindow.once('ready-to-show', () => {
    if(!preferencesWindow) { return }

    injectSystemColors(preferencesWindow)

    preferencesWindow.show();
  });

  preferencesWindow.on('closed', () => { preferencesWindow = undefined; })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await preferencesWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + 'preferences.html')
  } else {
    // Load the index.html when not in development
    preferencesWindow.loadURL('app://./preferences.html')
  }
}

export async function openPreferences(): Promise<void> {
  if (!preferencesWindow) {
    await createPreferencesWindow();
    return;
  }

  preferencesWindow.show();
}