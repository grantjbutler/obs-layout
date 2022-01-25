'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { basename } from 'path';

import { installContextMenuHandling, configureApplicationMenu } from './electron/menus';
import emitter from './electron/events';
import { openPreferences } from './electron/preferences-window';
import { injectSystemColors } from './electron/colors';
import Preferences from './electron/preferences';
import { install as installInterface } from './electron/interface';
import OBSSocket from './electron/obs';

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const preferences = new Preferences({
  name: basename(process.argv0),
  defaults: {
    connection: null
  }
});

const obsSocket = new OBSSocket();

installInterface({
  preferences,
  obsSocket
});

if (preferences.obsConnection) {
  obsSocket.connect(preferences.obsConnection);
}

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1050,
    height: 600,
    minHeight: 600,
    minWidth: 1050,
    show: false,
    vibrancy: 'sidebar',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.webContents.on('dom-ready', () => {
    injectSystemColors(win);
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
  } else {
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => { mainWindow = null; });

  mainWindow = win;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!mainWindow) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error(`Vue Devtools failed to install: ${e}`)
    }
  }

  if (!process.env.WEBPACK_DEV_SEVER_URL) {
    createProtocol('app');
  }

  createWindow()

  installContextMenuHandling();
  configureApplicationMenu();
})

emitter.on('open-preferences', () => {
  openPreferences();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
