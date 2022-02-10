import { v4 as uuidv4 } from 'uuid';
import type Size from './Size';
import type LayoutNode from './LayoutNode';
import type ContainerComponent from './ContainerComponent';

export default class Component {
  id: string = uuidv4();
  _parent: WeakRef<ContainerComponent> | undefined = undefined;
  customName: string | undefined;

  get name(): string {
    return this.customName ?? Object.getPrototypeOf(this).constructor.displayName;
  }

  get parent(): ContainerComponent | undefined {
    return this._parent?.deref();
  }

  removeFromParent(): void {
    this.parent?._removeChild(this);
  }

  static get displayName(): string {
    throw new Error('Subclasses are expected to provide a display name.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exerciseLayout(size: Size): LayoutNode {
    throw new Error('Subclasses are expected to implement logic for exercising a layout.');
  }
}
