import Component from './Component'
import LayoutNode from './LayoutNode'
import Size from './Size'
import ContainerLayoutNode from './ContainerLayoutNode'
import Frame from './Frame'
import ContainerComponent from './ContainerComponent'
import Insets from './Insets'

export default class InsetComponent extends ContainerComponent {
  insets = new Insets(0, 0, 0, 0);

  static get displayName(): string {
    return 'Inset Component';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canAddChild<T extends typeof Component>(child: T): boolean {
    return this.children.length == 0;
  }

  exerciseLayout(size: Size): LayoutNode {
    if (!this.children.length) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    const constrainedSize = size.insetBy(this.insets);
    const childNode = this.children[0].exerciseLayout(constrainedSize);
    childNode.frame.x = this.insets.left;
    childNode.frame.y = this.insets.top;

    return new ContainerLayoutNode(this.id, new Frame(0, 0, childNode.frame.width + this.insets.left + this.insets.right, childNode.frame.height + this.insets.top + this.insets.bottom), [childNode]);
  }
}
