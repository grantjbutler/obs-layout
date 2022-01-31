import { BrowserWindow, ipcMain, Menu, IpcMainEvent, MenuItemConstructorOptions, MenuItem, app } from 'electron';
import emitter from './events';

function installClickHandler<Item extends MenuItemConstructorOptions | MenuItem>(template: Item[], event: IpcMainEvent): Item[] {
  return template.map(item => {
    if (item.submenu) {
      if (Array.isArray(item.submenu)) {
        item.submenu = installClickHandler(item.submenu, event)
      } else {
        item.submenu.items = installClickHandler(item.submenu.items, event)
      }
    }

    if (!item.id) { return item; }

    item.click = () => { event.reply(`context-menu:click:${item.id}`) }

    return item;
  })
}

export function installContextMenuHandling(): void {
  ipcMain.on('show-context-menu', (event, template: MenuItemConstructorOptions[]) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) {
      return;
    }

    const menu = Menu.buildFromTemplate(installClickHandler(template, event));
    menu.popup({ window })
  });
}

export function showsApplicationMenu(): boolean {
  return process.platform == 'darwin'
}

export function configureApplicationMenu(): void {
  if (showsApplicationMenu()) {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(
        [
          {
            role: 'appMenu',
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              {
                label: 'Preferences...',
                accelerator: 'CmdOrCtrl+,',
                click: () => { emitter.emit('open-preferences') }
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator'},
              { role: 'quit' }
            ]
          },
          {
            role: 'windowMenu',
            submenu: [
              { role: 'minimize' },
              { role: 'zoom' },
              { type: 'separator' },
              { role: 'toggleDevTools' }
            ]
          }
        ]
      )
    )
  } else {
    // Remove the menu on Windows, since we'll use the command bar for similar purposes.
    Menu.setApplicationMenu(null)
  }
}