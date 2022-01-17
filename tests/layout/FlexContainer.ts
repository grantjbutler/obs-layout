import { describe } from 'mocha';
import { expect } from 'chai';
import { FlexComponent, Frame, Size, SourceComponent } from '@/layout';

describe('FlexContainer', () => {
  it('should layout vertically', () => {
    const component = new FlexComponent();
    component.direction = 'vertical';
    component.spacing = 10;

    const childA = new SourceComponent();
    childA.size = new Size(100, 100);
    component.addChild(childA);

    const childB = new SourceComponent();
    childB.size = new Size(100, 100);
    component.addChild(childB);

    const node = component.exerciseLayout(new Size(100, 210));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 210));
    expect(node.isContainer).to.equal(true);
    expect(node.children.length).to.equal(2);

    const aNode = node.children[0];
    const bNode = node.children[1];
    expect(aNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(aNode.isContainer).to.equal(false);
    expect(aNode.children).to.eql([]);

    expect(bNode.frame).to.eql(new Frame(0, 110, 100, 100));
    expect(bNode.isContainer).to.equal(false);
    expect(bNode.children).to.eql([]);
  });
})