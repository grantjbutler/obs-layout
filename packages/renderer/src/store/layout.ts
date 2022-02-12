import { defineStore } from 'pinia';
import type { LayoutNode, Component } from '/@/layout';
import { FlexComponent, LayoutExerciser, Size , ContainerComponent } from '/@/layout';

interface State {
  rootComponent: ContainerComponent
  rootNode?: LayoutNode
  selectedComponent?: Component,
}

export const useLayoutStore = defineStore('layout', {
  state: (): State => {
    return {
      rootComponent: new FlexComponent(),
      rootNode: undefined,
      selectedComponent: undefined,
    };
  },
  actions: {
    selectComponent(component: Component) {
      this.selectedComponent = component;
    },
    exerciseLayout() {
      this.rootNode = new LayoutExerciser().execute(this.rootComponent, new Size(1920, 1080));
    },
    addChild(component: Component, parentId: string) {
      const parent = this.rootComponent.childWithId(parentId);
      if (!parent || !(parent instanceof ContainerComponent)) { return; }
      parent.addChild(component);

      this.exerciseLayout();
    },
    deleteComponent(id: string) {
      const component = this.rootComponent.childWithId(id);
      if (!component || !component.parent) { return; }
      component.removeFromParent();

      if (this.selectedComponent == component) {
        this.selectedComponent = undefined;
      }

      this.exerciseLayout();
    },
    embedInComponent(id: string, container: ContainerComponent) {
      if (this.rootComponent.id == id) {
        container.addChild(this.rootComponent);
        this.rootComponent = container;
      } else {
        const child = this.rootComponent.childWithId(id);
        if (!child) { return; }
        const parent = child.parent;
        if (!parent) { return; }

        child.removeFromParent();
        parent.addChild(container);
        container.addChild(child);
      }

      this.exerciseLayout();
    },
  },
});
