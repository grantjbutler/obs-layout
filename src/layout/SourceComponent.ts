import Component from "./Component"
import Size from './Size';
import LayoutNode from './LayoutNode';
import Frame from "./Frame";

export default class SourceComponent extends Component {
  source?: string = undefined // This may need to be a different type depending on what OBS returns.
  aspectRatio: Size = new Size(16, 9)

  static get displayName(): string {
    return 'Source Component'
  }

  exerciseLayout(size: Size): LayoutNode {
    let nodeSize: Size
    if (size.height > size.width) {
      const height = size.width * this.aspectRatio.height / this.aspectRatio.width
      nodeSize = new Size(size.width, height);
    } else {
      const width = size.height * this.aspectRatio.width / this.aspectRatio.height;
      nodeSize = new Size(width, size.height)
    }

    return new LayoutNode(this.id, new Frame(0, 0, nodeSize.width, nodeSize.height), false)
  }
}