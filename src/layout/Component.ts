import { v4 as uuidv4 } from 'uuid';
import Size from './Size';
import LayoutNode from './LayoutNode';
import ContainerComponent from './ContainerComponent';

export default class Component {
  id: string = uuidv4()
  #parent: WeakRef<ContainerComponent> | undefined = undefined;
  customName: string | undefined

  get name(): string {
    return this.customName ?? Object.getPrototypeOf(this).constructor.displayName
  }

  get parent(): ContainerComponent | undefined {
    return this.#parent?.deref();
  }

  set _parent(parent: ContainerComponent | undefined) {
    if (parent) {
      this.#parent = new WeakRef(parent);
    } else {
      this.#parent = undefined;
    }
  }

  removeFromParent(): void {
    this.parent?._removeChild(this)
  }

  static get displayName(): string {
    throw new Error("Subclasses are expected to provide a display name.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exerciseLayout(size: Size): LayoutNode {
    throw new Error("Subclasses are expected to implement logic for exercising a layout.");
  }
}