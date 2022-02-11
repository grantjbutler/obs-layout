interface MenuItem {
  id: string
  label: string
}

interface MenuSubmenu {
  label: string
  submenu: MenuItemDefinition[]
}

export type MenuItemDefinition = MenuItem | MenuSubmenu | {
  type: 'separator'
}
