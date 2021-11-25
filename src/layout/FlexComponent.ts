import Component from "./Component";
import Frame from "./Frame";
import LayoutNode from "./LayoutNode";
import Size from "./Size";

export default class FlexComponent extends Component {
  direction: 'horizontal' | 'vertical' = 'horizontal'
  spacing = 0
  distribution: 'leading' | 'center' | 'trailing' = 'center'

  get name(): string {
    return 'Flex Component'
  }

  get controlsComponent(): string {
    return 'FlexComponentControls'
  }

  exerciseLayout(size: Size): LayoutNode {
    const totalSpacing = this.spacing * (this.children.length - 1)
    if ((this.direction == 'horizontal' && totalSpacing >= size.width) || (this.direction == 'vertical' && totalSpacing >= size.height)) {
      return new LayoutNode(this.id, new Frame(0, 0, 0, 0))
    }

    let childSize: Size
    if (this.direction == 'vertical') {
      const availableHeight = size.height - totalSpacing
      childSize = new Size(size.width, availableHeight / this.children.length)
    } else {
      const availableWidth = size.width - totalSpacing
      childSize = new Size(availableWidth / this.children.length, size.height)        
    }

    const childNodes = this.children.map((child, index) => {
      const childNode = child.exerciseLayout(childSize)

      if (this.direction == 'vertical') {
        childNode.frame.y = index * (childSize.height + this.spacing)
      } else {
        childNode.frame.x = index * (childSize.width + this.spacing)
      }

      return childNode;
    });

    let nodeFrame: Frame
    if (this.direction == 'vertical') {
      const maxWidth = childNodes.reduce((width, node) => {
        if (node.frame.width > width) {
          return node.frame.width
        }

        return width;
      }, 0);
      nodeFrame = new Frame(0, 0, maxWidth, size.height)
    } else {
      const maxHeight = childNodes.reduce((height, node) => {
        if (node.frame.height > height) {
          return node.frame.height
        }

        return height;
      }, 0);
      nodeFrame = new Frame(0, 0, size.width, maxHeight)
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
            node.frame.x = (nodeFrame.width - node.frame.width)
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
    })

    return new LayoutNode(this.id, nodeFrame, childNodes)
  }
}