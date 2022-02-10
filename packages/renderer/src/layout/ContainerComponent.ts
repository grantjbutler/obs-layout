import Component from './Component';

export default abstract class ContainerComponent extends Component {
  _children: Component[] = [];

  get children(): Component[] {
    return this._children;
  }

  addChild(child: Component): void {
    this._children.push(child);
    child._parent = new WeakRef(this);
  }

  _removeChild(child: Component): void {
    let childIndex: number;
    if ((childIndex = this.children.indexOf(child)) === -1) {
      return;
    }

    this._children.splice(childIndex, 1);
    child._parent = undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canAddChild<T extends typeof Component>(child: T): boolean {
    return true;
  }

  childWithId(id: string): null | Component {
    if (this.id == id) {
      return this;
    }

    for (const child of this.children) {
      if (child instanceof ContainerComponent) {
        const found = child.childWithId(id);
        if (found) {
          return found;
        }
      } else {
        if (child.id == id) {
          return child;
        }
      }
    }

    return null;
  }
}
