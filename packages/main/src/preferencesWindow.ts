import {BrowserWindow} from 'electron';
import {join} from 'path';
import {URL} from 'url';
import { injectSystemColors } from './colors';

/**
 * URL for main window.
 * Vite dev server for development.
 * `file://../renderer/preferences.html` for production and test
 */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
   ? import.meta.env.VITE_DEV_SERVER_URL + 'preferences.html'
   : new URL('../renderer/dist/preferences.html', 'file://' + __dirname).toString();

async function createWindow() {
  const browserWindow = new BrowserWindow({
    useContentSize: true,
    width: 485,
    height: 330,
    show: false, // Use 'ready-to-show' event to show window
    fullscreenable: false,
    maximizable: false,
    resizable: false,
    title: 'Preferences',
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  injectSystemColors(browserWindow);

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed() && w.webContents.getURL() === pageUrl);

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}