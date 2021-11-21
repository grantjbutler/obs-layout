export default class Component {
  #_children: Component[] = []
  #_parent?: WeakRef<Component> = undefined

  get children(): Component[] {
    return this.children;
  }

  get parent(): Component | undefined {
    return this.#_parent?.deref();
  }

  addChild(child: Component): void {
    this.#_children.push(child);
    child.#_parent = new WeakRef(this);
  }

  removeFromParent(): void {
    const parent = this.parent;
    if (!parent) {
      return;
    }

    parent.#removeChild(this);
  }

  #removeChild(child: Component): void {
    let index;
    if ((index = this.#_children.indexOf(child)) === -1) {
      return;
    }

    this.#_children.splice(index, 1);
    child.#_parent = undefined;
  }
}