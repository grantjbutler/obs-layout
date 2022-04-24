interface MenuItem {
  id: string
  label: string
  enabled: boolean
}

interface MenuSubmenu {
  label: string
  submenu: MenuItemDefinition[]
  enabled: boolean
}

export type MenuItemDefinition = MenuItem | MenuSubmenu | {
  type: 'separator'
}
