import { describe } from 'mocha';
import { expect } from 'chai';
import { Frame, InsetComponent, Size, SourceComponent } from '@/layout';
import Insets from '@/layout/Insets';

describe('InsetComponent', () => {
  it('should layout', () => {
    const component = new InsetComponent()
    component.insets = new Insets(10, 10, 10, 10);

    component.addChild(new SourceComponent())

    const node = component.exerciseLayout(new Size(1920, 1080));
    expect(node.frame).to.eql(new Frame(0, 0, 1904.4444444444446, 1080))
    expect(node.isContainer).to.equal(true);
    expect(node.children.length).to.equal(1);

    const childNode = node.children[0];
    expect(childNode.frame).to.eql(new Frame(10, 10, 1884.4444444444446, 1060));
    expect(childNode.isContainer).to.equal(false);
    expect(childNode.children).to.eql([]);
  });
});