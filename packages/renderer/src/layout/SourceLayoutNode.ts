import type { Source } from '../../../shared/src/obs';
import type Frame from './Frame';
import LayoutNode from './LayoutNode';

export default class SourceLayoutNode extends LayoutNode {
  source: Source;

  constructor(id: string, frame: Frame, source: Source) {
    super(id, frame);

    this.source = source;
  }
}
