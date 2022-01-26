import Frame from "./Frame";

export default class LayoutNode {
  id: string
  frame: Frame
  
  constructor(id: string, frame: Frame) {
    this.id = id
    this.frame = frame
  }
}