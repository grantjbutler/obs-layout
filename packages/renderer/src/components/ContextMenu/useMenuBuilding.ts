import type { MenuItemDefinition } from '../../../../shared/src/menus';
import { ref, Fragment } from 'vue';

interface MenuBuilding {
  buildItem(): MenuItemDefinition[] | null
  buildMenu(children: any[]): void
}

export default function useMenuBuilding(): MenuBuilding {
  const buildNode = (node: any) => {
    const component = node.component;
      if (!component) {
        return null;
      }

      const buildChildItem = component.exposed?.buildItem;
      if (!buildChildItem) {
        throw new Error();
      }

      return buildChildItem();
  };

  const stashedChildren = ref<any[]>([]);
  const buildItem = (): MenuItemDefinition[] | null => {
    return stashedChildren.value.flatMap(node => {
      if (node.type == Fragment) {
        return node.children.map(buildNode);
      } else {
        return buildNode(node);
      }
    }).filter(element => !!element);
  };

  const buildMenu = (children: any[]) => {
    stashedChildren.value = children;
  };

  return {
    buildItem,
    buildMenu,
  };
}
