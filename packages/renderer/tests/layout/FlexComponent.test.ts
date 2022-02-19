import { describe, it, expect } from 'vitest';
import { ContainerLayoutNode, FlexComponent, Frame, Size, SourceComponent, SourceLayoutNode } from '../../src/layout';

describe('FlexComponent', () => {
  it('should layout vertically', () => {
    const component = new FlexComponent();
    component.direction = 'vertical';
    component.spacing = 10;

    const childA = new SourceComponent();
    childA.source = {
      name: 'A',
      width: 100,
      height: 100,
    };
    component.addChild(childA);

    const childB = new SourceComponent();
    childB.source = {
      name: 'B',
      width: 100,
      height: 100,
    };
    component.addChild(childB);

    const node = component.exerciseLayout(new Size(100, 210));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 210));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(2);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    expect(aNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 110, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);
  });
});
