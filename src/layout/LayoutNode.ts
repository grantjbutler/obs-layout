import Frame from "./Frame";

export default class LayoutNode {
  id: string
  frame: Frame
  isContainer: boolean
  children: LayoutNode[]

  constructor(id: string, frame: Frame, isContainer: boolean, children: LayoutNode[] = []) {
    this.id = id
    this.frame = frame
    this.isContainer = isContainer
    this.children = children
  }
}