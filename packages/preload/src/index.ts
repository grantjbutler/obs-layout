/**
 * @module preload
 */

import {contextBridge} from 'electron';
import {showContextMenu, onClick} from '/@/menus';
import * as obs from '/@/obs';
import * as preferences from '/@/preferences';

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * Expose Environment versions.
 * @example
 * console.log( window.versions )
 */
contextBridge.exposeInMainWorld('versions', process.versions);

contextBridge.exposeInMainWorld('platform', process.platform);

contextBridge.exposeInMainWorld('page', (() => {
  const PAGE_ARG_REGEX = /--page=([a-z]+)/;
  const pageArg = process.argv.find((value) => PAGE_ARG_REGEX.test(value));
  if (pageArg) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return PAGE_ARG_REGEX.exec(pageArg)![1];
  }

  return 'app';
})());

/**
 * Expose context menu API
 * @example
 * window.showContextMenu(...)
 */
contextBridge.exposeInMainWorld('contextMenu', {
  show: showContextMenu,
  onClick,
});

contextBridge.exposeInMainWorld('obs', obs);

contextBridge.exposeInMainWorld('preferences', preferences);
