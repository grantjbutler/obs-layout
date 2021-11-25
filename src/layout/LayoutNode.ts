import Frame from "./Frame";

export default class LayoutNode {
  id: string
  frame: Frame
  children: LayoutNode[]

  constructor(id: string, frame: Frame, children: LayoutNode[] = []) {
    this.id = id
    this.frame = frame
    this.children = children
  }
}