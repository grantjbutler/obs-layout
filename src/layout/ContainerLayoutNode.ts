import { Frame, LayoutNode } from ".";

export default class ContainerLayoutNode extends LayoutNode {
  children: LayoutNode[]
  
  constructor(id: string, frame: Frame, children: LayoutNode[] = []) {
    super(id, frame);
    
    this.children = children
  }
}