import { Source } from "@/obs/source";
import { Frame, LayoutNode } from ".";

export default class SourceLayoutNode extends LayoutNode {
  source: Source

  constructor(id: string, frame: Frame, source: Source) {
    super(id, frame)

    this.source = source
  }
}