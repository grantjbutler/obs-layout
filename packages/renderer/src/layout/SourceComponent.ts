import Component from './Component';
import Size from './Size';
import LayoutNode from './LayoutNode';
import Frame from './Frame';
import Insets from './Insets';
import SourceLayoutNode from './SourceLayoutNode';
import type { Source } from '../../../shared/src/obs';

export default class SourceComponent extends Component {
  source?: Source = undefined;
  crop: Insets = new Insets(0, 0, 0, 0);

  static get displayName(): string {
    return 'Source Component';
  }

  exerciseLayout(size: Size): LayoutNode {
    if (!this.source) {
      return new LayoutNode(this.id, new Frame(0, 0, 0, 0));
    }

    const sourceSize = new Size(this.source.width, this.source.height);

    const croppedSize = sourceSize.insetBy(this.crop);
    const widthScale = size.width / croppedSize.width;
    const heightScale = size.height / croppedSize.height;
    const scaleRatio = Math.min(widthScale, heightScale);

    return new SourceLayoutNode(this.id, new Frame(0, 0, croppedSize.width * scaleRatio, croppedSize.height * scaleRatio), this.source);
  }

  clone(): Component {
    const clone = new SourceComponent();
    clone.source = this.source;
    clone.crop = this.crop.clone();
    return clone;
  }
}
