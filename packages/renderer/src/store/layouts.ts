import { defineStore } from 'pinia';
import type { ContainerComponent } from '/@/layout';
import { FlexComponent } from '/@/layout';

interface Layout {
  name: string
  rootComponent: ContainerComponent
}

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
      const layout = {
        name,
        rootComponent,
      };

      this.layouts.push(layout);
      this.selectedLayout = layout;
    },
  },
});
