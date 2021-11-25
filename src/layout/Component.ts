import { v4 as uuidv4 } from 'uuid';
import Size from './Size';
import LayoutNode from './LayoutNode';

export default abstract class Component {
  id: string = uuidv4()
  children: Component[] = []

  abstract get name(): string
  abstract get controlsComponent(): string
  abstract exerciseLayout(size: Size): LayoutNode

  childWithId(id: string): null | Component {
    if (this.id == id) {
      return this
    }

    for (const child of this.children) {
      const found = child.childWithId(id)
      if (found) {
        return found
      }
    }

    return null
  }
}