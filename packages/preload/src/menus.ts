import { ipcRenderer } from 'electron';
import type { MenuItemDefinition } from '../../shared/src/menus';

export function showContextMenu(menu: MenuItemDefinition[]) {
  ipcRenderer.send('show-context-menu', JSON.parse(JSON.stringify(menu)));
}

export function onClick(id: string, handler: () => void) {
  ipcRenderer.on(`context-menu:click:${id}`, handler);
}
