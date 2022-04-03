import ContainerLayoutNode from './ContainerLayoutNode';
import ContainerComponent from './ContainerComponent';
import Frame from './Frame';
import Size from './Size';
import type LayoutNode from './LayoutNode';
import type Component from './Component';

export default class StackComponent extends ContainerComponent {
  verticalAlignment: 'leading' | 'center' | 'trailing' = 'center';
  horizontalAlignment: 'leading' | 'center' | 'trailing' = 'center';

  static get displayName(): string {
    return 'Stack Component';
  }

  exerciseLayout(size: Size): LayoutNode {
    if (!this.children.length) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    const childNodes = this.children.map(child => child.exerciseLayout(size));

    const containerSize = childNodes.reduce((size, node) => {
      size.width = Math.max(size.width, node.frame.width);
      size.height = Math.max(size.height, node.frame.height);

      return size;
    }, new Size(0, 0));

    childNodes.forEach(node => {
      switch (this.verticalAlignment) {
        case 'leading':
          node.frame.y = 0;
          break;
        case 'center':
          node.frame.y = (containerSize.height - node.frame.height) / 2.0;
          break;
        case 'trailing':
          node.frame.y = containerSize.height - node.frame.height;
          break;
      }

      switch (this.horizontalAlignment) {
        case 'leading':
          node.frame.x = 0;
          break;
        case 'center':
          node.frame.x = (containerSize.width - node.frame.width) / 2.0;
          break;
        case 'trailing':
          node.frame.x = containerSize.width - node.frame.width;
          break;
      }
    });

    return new ContainerLayoutNode(this.id, new Frame(0, 0, containerSize.width, containerSize.height), childNodes);
  }

  clone(): Component {
    const clone = new StackComponent();
    clone.horizontalAlignment = this.horizontalAlignment;
    clone.verticalAlignment = this.verticalAlignment;
    this.children.forEach(child => clone.addChild(child.clone()));
    return clone;
  }
}
