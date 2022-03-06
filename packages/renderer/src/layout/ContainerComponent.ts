import Component from './Component';

export default abstract class ContainerComponent extends Component {
  _children: Component[] = [];

  get children(): Component[] {
    return this._children;
  }

  addChild(child: Component): void {
    child.removeFromParent();

    this._children.push(child);
    child._parent = new WeakRef(this);

    this.didAddChild(child);
  }

  insertChildAtIndex(child: Component, index: number): void {
    child.removeFromParent();

    this._children.splice(index, 0, child);
    child._parent = new WeakRef(this);

    this.didAddChild(child);
  }

  insertChildAfter(child: Component, sibling: Component): void {
    if (!child.parent || !sibling.parent) { return; }
    if (sibling.parent.id != this.id) { return; }

    const siblingIndex = this.children.indexOf(sibling);
    if (siblingIndex === -1) { return; }

    child.removeFromParent();

    this._children.splice(siblingIndex + 1, 0, child);
    child._parent = new WeakRef(this);

    this.didAddChild(child);
  }

  insertChildBefore(child: Component, sibling: Component): void {
    if (!child.parent || !sibling.parent) { return; }
    if (sibling.parent.id != this.id) { return; }

    const siblingIndex = this.children.indexOf(sibling);
    if (siblingIndex === -1) { return; }

    child.removeFromParent();

    this._children.splice(siblingIndex, 0, child);
    child._parent = new WeakRef(this);

    this.didAddChild(child);
  }

  _removeChild(child: Component): void {
    let childIndex: number;
    if ((childIndex = this.children.indexOf(child)) === -1) {
      return;
    }

    this._children.splice(childIndex, 1);
    child._parent = undefined;

    this.didRemoveChild(child);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canAddChild<T extends typeof Component>(child: T): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  didAddChild(child: Component): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  didRemoveChild(child: Component): void {}

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
