import MenuItemDefinition from './MenuItemDefinition'
import { ref } from 'vue'

interface MenuBuilding {
  buildItem(): MenuItemDefinition[] | null
  buildMenu(children: any[]): void
}

export default function useMenuBuilding(): MenuBuilding {
  const stashedChildren = ref<any[]>([]);
  const buildItem = (): MenuItemDefinition[] | null => {
    return stashedChildren.value.map(node => {
      const component = node.component
      if (!component) {
        return null;
      }

      const buildChildItem = component.exposed?.buildItem
      if (!buildChildItem) {
        throw new Error()
      }

      return buildChildItem();
    }).filter(element => !!element)
  }

  const buildMenu = (children: any[]) => {
    stashedChildren.value = children
  };

  return {
    buildItem,
    buildMenu
  }
}