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

    const strategy = Strategies[this.direction];

    const totalWeight = Array.from(this.weights.values()).reduce((total, weight) => total + weight, 0);
    const availableDimension = strategy.availableDimension(size, totalSpacing);

    const childNodes = this.children.map((child) => {
      const childWeight = this.weights.get(child.id) || 1;
      const proportion = childWeight / totalWeight;

      return child.exerciseLayout(strategy.childSize(size, availableDimension, proportion));
    });

    strategy.positionNodes(childNodes, size, this.spacing);

    const containerFrame = strategy.containerFrame(childNodes, size);

    childNodes.forEach(node => {
      strategy.distribute(this.distribution, node, containerFrame);
    });

    return new ContainerLayoutNode(this.id, containerFrame, childNodes);
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

interface Strategy {
  availableDimension: (size: Size, spacing: number) => number;
  childSize: (containerSize: Size, availableDimension: number, proportion: number) => Size;
  containerFrame: (nodes: LayoutNode[], containerSize: Size) => Frame;
  distribute: (distribution: 'leading' | 'center' | 'trailing', node: LayoutNode, containerFrame: Frame) => void;
  positionNodes: (nodes: LayoutNode[], containerSize: Size, spacing: number) => void;
}

const Strategies = {
  vertical: {
    availableDimension(size: Size, spacing: number): number {
      return size.height - spacing;
    },
    childSize(containerSize: Size, availableDimension: number, proportion: number): Size {
      return new Size(containerSize.width, availableDimension * proportion);
    },
    containerFrame(nodes: LayoutNode[], containerSize: Size) {
      const maxWidth = nodes.reduce((width, node) => {
        return Math.max(node.frame.width, width);
      }, 0);
      return new Frame(0, 0, maxWidth, containerSize.height);
    },
    distribute(distribution: 'leading' | 'center' | 'trailing', node: LayoutNode, containerFrame: Frame) {
      switch (distribution) {
        case 'leading':
          node.frame.x = 0;
          break;
        case 'center':
          node.frame.x = (containerFrame.width - node.frame.width) / 2.0;
          break;
        case 'trailing':
          node.frame.x = (containerFrame.width - node.frame.width);
          break;
      }
    },
    positionNodes(nodes: LayoutNode[], containerSize: Size, spacing: number) {
      const totalSpacing = spacing * (nodes.length - 1);
      const totalHeight = nodes.reduce((height, node) => {
        return height + node.frame.height;
      }, totalSpacing);

      nodes.reduce((yOffset, node) => {
        node.frame.y = yOffset;
        return yOffset + node.frame.height + spacing;
      }, (containerSize.height - totalHeight) / 2.0);
    },
  } as Strategy,
  horizontal: {
    availableDimension(size: Size, spacing: number): number {
      return size.width - spacing;
    },
    childSize(containerSize: Size, availableDimension: number, proportion: number): Size {
      return new Size(availableDimension * proportion, containerSize.height);
    },
    containerFrame(nodes: LayoutNode[], containerSize: Size) {
      const maxHeight = nodes.reduce((height, node) => {
        return Math.max(node.frame.height, height);
      }, 0);
      return new Frame(0, 0, containerSize.width, maxHeight);
    },
    distribute(distribution: 'leading' | 'center' | 'trailing', node: LayoutNode, containerFrame: Frame) {
      switch (distribution) {
        case 'leading':
          node.frame.y = 0;
          break;
        case 'center':
          node.frame.y = (containerFrame.height - node.frame.height) / 2.0;
          break;
        case 'trailing':
          node.frame.y = (containerFrame.height - node.frame.height);
          break;
      }
    },
    positionNodes(nodes: LayoutNode[], containerSize: Size, spacing: number) {
      const totalSpacing = spacing * (nodes.length - 1);
      const totalWidth = nodes.reduce((width, node) => {
        return width + node.frame.width;
      }, totalSpacing);

      nodes.reduce((xOffset, node) => {
        node.frame.x = xOffset;
        return xOffset + node.frame.width + spacing;
      }, (containerSize.width - totalWidth) / 2.0);
    },
  } as Strategy,
};
