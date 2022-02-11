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
