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
  screenshot?: HTMLImageElement = undefined;
  scalingMode: 'aspect-fit' | 'aspect-fill' | 'none' = 'aspect-fit';

  static get displayName(): string {
    return 'Source Component';
  }

  exerciseLayout(size: Size): LayoutNode {
    if (!this.source) {
      return new LayoutNode(this.id, new Frame(0, 0, 0, 0));
    }

    const sourceSize = new Size(this.source.width, this.source.height).insetBy(this.crop);
    let scaleRatio = 1;

    switch (this.scalingMode) {
      case 'aspect-fit': {
        const widthScale = size.width / sourceSize.width;
        const heightScale = size.height / sourceSize.height;
        scaleRatio = Math.min(widthScale, heightScale);
        break;
      }

      case 'aspect-fill': {
        const widthScale = size.width / sourceSize.width;
        const heightScale = size.height / sourceSize.height;
        scaleRatio = Math.max(widthScale, heightScale);
        break;
      }

      case 'none':
        break;
    }

    return new SourceLayoutNode(this.id, new Frame(0, 0, sourceSize.width * scaleRatio, sourceSize.height * scaleRatio), this.source, this.screenshot);
  }

  clone(): Component {
    const clone = new SourceComponent();
    clone.source = this.source;
    clone.crop = this.crop.clone();
    clone.screenshot = this.screenshot;
    clone.scalingMode = this.scalingMode;
    return clone;
  }
}
