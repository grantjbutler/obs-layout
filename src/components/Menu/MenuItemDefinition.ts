interface MenuItem {
  id: string
  label: string
}

interface MenuSubmenu {
  label: string
  submenu: MenuItemDefinition[]
}

type MenuItemDefinition = MenuItem | MenuSubmenu | {
  type: 'separator'
}

export default MenuItemDefinition;