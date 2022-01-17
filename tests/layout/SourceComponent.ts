import { describe } from 'mocha';
import { expect } from 'chai';
import { Frame, Size, SourceComponent } from '@/layout';

describe('SourceComponent', () => {
  it('should layout', () => {
    const component = new SourceComponent();

    const node = component.exerciseLayout(new Size(1920, 1080));
    expect(node.frame).to.eql(new Frame(0, 0, 1920, 1080));
    expect(node.isContainer).to.equal(false);
    expect(node.children).to.eql([]);
  })
});