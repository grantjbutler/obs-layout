import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { ContainerComponent, Layout } from '/@/layout';
import { FlexComponent } from '/@/layout';

interface State {
  layouts: Layout[]
  selectedLayout: Layout
}

export const useLayoutsStore = defineStore('layouts', {
  state: (): State => {
    const initialLayout: Layout = {
      id: uuidv4(),
      name: 'Untitled Layout',
      rootComponent: new FlexComponent(),
    };

    return {
      layouts: [initialLayout],
      selectedLayout: initialLayout,
    };
  },
  actions: {
    selectLayout(id: string) {
      const layout = this.layouts.find(layout => layout.id === id);
      if (!layout) { return; }
      this.selectedLayout = layout;
    },
    setRootComponent(component: ContainerComponent) {
      this.selectedLayout.rootComponent = component;
    },
    createLayout(name: string, rootComponent: ContainerComponent) {
      const layout = {
        id: uuidv4(),
        name,
        rootComponent,
      };

      this.layouts.push(layout);
      this.selectedLayout = layout;
    },
    renameLayout(id: string, newName: string) {
      const index = this.layouts.findIndex(layout => layout.id === id);
      if (index < 0) { return; }
      this.layouts[index].name = newName;
    },
    duplicateLayout(id: string) {
      const layout = this.layouts.find(layout => layout.id === id);
      if (!layout) { return; }
      const baseName = layout.name + ' copy';
      let possibleName = baseName;
      let iterator = 1;

      while (this.layouts.find(layout => layout.name == possibleName)) {
        possibleName = baseName + ` ${++iterator}`;
      }

      this.createLayout(possibleName, layout.rootComponent.clone() as ContainerComponent);
    },
    deleteLayout(id: string) {
      if (this.layouts.length == 1) { return; }
      const index = this.layouts.findIndex(layout => layout.id === id);
      if (index < 0) { return; }
      this.layouts.splice(index, 1);
    },
  },
});
