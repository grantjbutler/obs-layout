import { defineStore } from 'pinia';
import { useLayoutsStore } from './layouts';
import { useObsStore } from './obs';
import type { LayoutNode, Component } from '/@/layout';
import { LayoutExerciser, Size, ContainerComponent } from '/@/layout';

interface State {
  rootNode?: LayoutNode
  selectedComponent?: Component,
}

export const useLayoutStore = defineStore('layout', {
  state: (): State => {
    return {
      rootNode: undefined,
      selectedComponent: undefined,
    };
  },
  getters: {
    layout() {
      const layoutsStore = useLayoutsStore();
      return layoutsStore.selectedLayout;
    },
    rootComponent(): ContainerComponent {
      return this.layout.rootComponent;
    },
  },
  actions: {
    selectComponent(component: Component) {
      this.selectedComponent = component;
    },
    exerciseLayout() {
      if (!this.rootComponent) { return; }
      const obsStore = useObsStore();
      this.rootNode = new LayoutExerciser().execute(this.rootComponent, new Size(obsStore.canvasSize.width, obsStore.canvasSize.height));
    },
    addChild(component: Component, parentId: string) {
      if (!this.rootComponent) { return; }
      const parent = this.rootComponent.childWithId(parentId);
      if (!parent || !(parent instanceof ContainerComponent)) { return; }
      parent.addChild(component);

      this.exerciseLayout();
    },
    renameComponent(component: Component, name?: string) {
      if (name?.trim() == '') {
        component.customName = undefined;
      } else {
        component.customName = name;
      }
    },
    insertChildAtBeginning(component: Component, parentId: string) {
      if (!this.rootComponent) { return; }
      const parent = this.rootComponent.childWithId(parentId);
      if (!parent || !(parent instanceof ContainerComponent)) { return; }
      parent.insertChildAtIndex(component, 0);

      this.exerciseLayout();
    },
    deleteComponent(id: string) {
      if (!this.rootComponent) { return; }
      const component = this.rootComponent.childWithId(id);
      if (!component || !component.parent) { return; }
      component.removeFromParent();

      if (this.selectedComponent == component) {
        this.selectedComponent = undefined;
      }

      this.exerciseLayout();
    },
    embedInComponent(id: string, container: ContainerComponent) {
      if (!this.rootComponent) { return; }

      const layoutsStore = useLayoutsStore();

      if (this.rootComponent.id == id) {
        container.addChild(this.rootComponent);
        layoutsStore.setRootComponent(container);
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
    moveBefore(component: Component, sibling: Component) {
      if (!sibling.parent) { return; }
      sibling.parent.insertChildBefore(component, sibling);

      this.exerciseLayout();
    },
    moveAfter(component: Component, sibling: Component) {
      if (!sibling.parent) { return; }
      sibling.parent.insertChildAfter(component, sibling);

      this.exerciseLayout();
    },
  },
});
