import ContainerLayoutNode from './ContainerLayoutNode';
import ContainerComponent from './ContainerComponent';
import Frame from './Frame';
import Size from './Size';
import type LayoutNode from './LayoutNode';
import type Component from './Component';

export default class FlexComponent extends ContainerComponent {
  direction: 'horizontal' | 'vertical' = 'horizontal';
  spacing = 0;
  distribution: 'leading' | 'center' | 'trailing' = 'center';
  weights: Map<string, number> = new Map();

  static get displayName(): string {
    return 'Flex Component';
  }

  didAddChild(child: Component): void {
    this.weights.set(child.id, 1);
  }

  didRemoveChild(child: Component): void {
    this.weights.delete(child.id);
  }

  exerciseLayout(size: Size): LayoutNode {
    const totalSpacing = this.spacing * (this.children.length - 1);
    if ((this.direction == 'horizontal' && totalSpacing >= size.width) || (this.direction == 'vertical' && totalSpacing >= size.height)) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    if (!this.children.length) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    const totalWeight = Array.from(this.weights.values()).reduce((total, weight) => total + weight, 0);
    let availableDimension: number;
    if (this.direction == 'vertical') {
      availableDimension = size.height - totalSpacing;
    } else {
      availableDimension = size.width - totalSpacing;
    }

    const childNodes = this.children.map((child) => {
      const childWeight = this.weights.get(child.id) || 1;
      const proportion = childWeight / totalWeight;

      let childSize: Size;
      if (this.direction == 'vertical') {
        childSize = new Size(size.width, availableDimension * proportion);
      } else {
        childSize = new Size(availableDimension * proportion, size.height);
      }

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

  clone(): Component {
    const clone = new FlexComponent();
    clone.direction = this.direction;
    clone.spacing = this.spacing;
    clone.distribution = this.distribution;
    this.children.forEach(child => clone.addChild(child.clone()));
    return clone;
  }
}
