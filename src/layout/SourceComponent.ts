import Component from "./Component"
import Size from './Size';
import LayoutNode from './LayoutNode';
import Frame from "./Frame";
import Insets from "./Insets";

export default class SourceComponent extends Component {
  source?: string = undefined // This may need to be a different type depending on what OBS returns.
  size: Size = new Size(1920, 1080);
  crop: Insets = new Insets(0, 0, 0, 0);

  static get displayName(): string {
    return 'Source Component'
  }

  exerciseLayout(size: Size): LayoutNode {
    const croppedSize = this.size.insetBy(this.crop);
    const widthScale = size.width / croppedSize.width
    const heightScale = size.height / croppedSize.height
    const scaleRatio = Math.min(widthScale, heightScale);

    return new LayoutNode(this.id, new Frame(0, 0, croppedSize.width * scaleRatio, croppedSize.height * scaleRatio), false)
  }
}