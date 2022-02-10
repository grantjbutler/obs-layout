import ContainerLayoutNode from './ContainerLayoutNode';
import ContainerComponent from './ContainerComponent';
import Frame from './Frame';
import Size from './Size';
import type LayoutNode from './LayoutNode';

export default class FlexComponent extends ContainerComponent {
  direction: 'horizontal' | 'vertical' = 'horizontal';
  spacing = 0;
  distribution: 'leading' | 'center' | 'trailing' = 'center';

  static get displayName(): string {
    return 'Flex Component';
  }

  exerciseLayout(size: Size): LayoutNode {
    const totalSpacing = this.spacing * (this.children.length - 1);
    if ((this.direction == 'horizontal' && totalSpacing >= size.width) || (this.direction == 'vertical' && totalSpacing >= size.height)) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    if (!this.children.length) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    let childSize: Size;
    if (this.direction == 'vertical') {
      const availableHeight = size.height - totalSpacing;
      childSize = new Size(size.width, availableHeight / this.children.length);
    } else {
      const availableWidth = size.width - totalSpacing;
      childSize = new Size(availableWidth / this.children.length, size.height);
    }

    const childNodes = this.children.map((child) => {
      return child.exerciseLayout(childSize);
    });

    let nodeFrame: Frame;
    if (this.direction == 'vertical') {
      const maxWidth = childNodes.reduce((width, node) => {
        if (node.frame.width > width) {
          return node.frame.width;
        }

        return width;
      }, 0);
      nodeFrame = new Frame(0, 0, maxWidth, size.height);

      const totalHeight = childNodes.reduce((height, node) => {
        return height + node.frame.height;
      }, totalSpacing);

      childNodes.reduce((yOffset, node) => {
        node.frame.y = yOffset;
        return yOffset + node.frame.height + this.spacing;
      }, (size.height - totalHeight) / 2.0);
    } else {
      const maxHeight = childNodes.reduce((height, node) => {
        if (node.frame.height > height) {
          return node.frame.height;
        }

        return height;
      }, 0);
      nodeFrame = new Frame(0, 0, size.width, maxHeight);

      const totalWidth = childNodes.reduce((width, node) => {
        return width + node.frame.width;
      }, totalSpacing);

      childNodes.reduce((xOffset, node) => {
        node.frame.x = xOffset;
        return xOffset + node.frame.width + this.spacing;
      }, (size.width - totalWidth) / 2.0);
    }

    childNodes.forEach(node => {
      if (this.direction == 'vertical') {
        switch (this.distribution) {
          case 'leading':
            node.frame.x = 0;
            break;
          case 'center':
            node.frame.x = (nodeFrame.width - node.frame.width) / 2.0;
            break;
          case 'trailing':
            node.frame.x = (nodeFrame.width - node.frame.width);
            break;
        }
      } else {
        switch (this.distribution) {
          case 'leading':
            node.frame.y = 0;
            break;
          case 'center':
            node.frame.y = (nodeFrame.height - node.frame.height) / 2.0;
            break;
          case 'trailing':
            node.frame.y = (nodeFrame.height - node.frame.height);
            break;
        }
      }
    });

    return new ContainerLayoutNode(this.id, nodeFrame, childNodes);
  }
}
