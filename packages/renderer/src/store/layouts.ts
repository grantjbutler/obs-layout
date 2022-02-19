import { defineStore } from 'pinia';
import type { ContainerComponent, Layout } from '/@/layout';
import { FlexComponent } from '/@/layout';

interface State {
  layouts: Layout[]
  selectedLayout: Layout
}

export const useLayoutsStore = defineStore('layouts', {
  state: (): State => {
    const initialLayout: Layout = {
      name: 'Untitled Layout',
      rootComponent: new FlexComponent(),
    };

    return {
      layouts: [initialLayout],
      selectedLayout: initialLayout,
    };
  },
  actions: {
    selectLayout(layout: Layout) {
      this.selectedLayout = layout;
    },
    setRootComponent(component: ContainerComponent) {
      this.selectedLayout.rootComponent = component;
    },
    createLayout(name: string, rootComponent: ContainerComponent) {
      // TODO: Show an alert that there's already a layout with a given name.
      if (this.layouts.find(layout => layout.name === name)) { return; }

      const layout = {
        name,
        rootComponent,
      };

      this.layouts.push(layout);
      this.selectedLayout = layout;
    },
    renameLayout(existing: string, newName: string) {
      // TODO: Show an alert that there's already a layout with a given name.
      if (this.layouts.find(layout => layout.name === newName)) { return; }

      const index = this.layouts.findIndex(layout => layout.name === existing);
      if (index < 0) { return; }
      this.layouts[index].name = newName;
    },
  },
});
