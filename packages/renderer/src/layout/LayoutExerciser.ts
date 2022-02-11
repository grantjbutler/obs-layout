import type Component from './Component';
import type LayoutNode from './LayoutNode';
import type Size from './Size';

export default class LayoutExerciser {
  execute(component: Component, size: Size): LayoutNode {
    const node = component.exerciseLayout(size);
    node.frame.x = (size.width - node.frame.width) / 2.0;
    node.frame.y = (size.height - node.frame.height) / 2.0;
    return node;
  }
}
