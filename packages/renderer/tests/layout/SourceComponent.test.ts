import { describe, it, expect } from 'vitest';
import { Frame, Size, SourceComponent, SourceLayoutNode } from '../../src/layout';

describe('SourceComponent', () => {
  it('should layout', () => {
    const component = new SourceComponent();
    component.source = {
      name: 'source',
      width: 1920,
      height: 1080,
    };

    const node = component.exerciseLayout(new Size(1920, 1080));
    expect(node.frame).to.eql(new Frame(0, 0, 1920, 1080));
    expect(node).to.be.an.instanceOf(SourceLayoutNode);
  });
});
