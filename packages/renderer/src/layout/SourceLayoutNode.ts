import type { Source } from '../../../shared/src/obs';
import type Frame from './Frame';
import LayoutNode from './LayoutNode';

export default class SourceLayoutNode extends LayoutNode {
  source: Source;
  screenshot?: HTMLImageElement;

  constructor(id: string, frame: Frame, source: Source, screenshot?: HTMLImageElement) {
    super(id, frame);

    this.source = source;
    this.screenshot = screenshot;
  }
}
