import { describe, it, expect } from 'vitest';
import { Frame, InsetComponent, Size, SourceComponent, Insets, ContainerLayoutNode, SourceLayoutNode } from '../src/layout';

describe('InsetComponent', () => {
  it('should layout', () => {
    const component = new InsetComponent();
    component.insets = new Insets(10, 10, 10, 10);

    const sourceComponent = new SourceComponent();
    sourceComponent.source = {
      name: 'source',
      width: 1920,
      height: 1080,
    };
    component.addChild(sourceComponent);

    const node = component.exerciseLayout(new Size(1920, 1080));
    expect(node.frame).to.eql(new Frame(0, 0, 1904.4444444444446, 1080));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(1);

    const childNode = (node as ContainerLayoutNode).children[0];
    expect(childNode.frame).to.eql(new Frame(10, 10, 1884.4444444444446, 1060));
    expect(childNode).to.be.an.instanceOf(SourceLayoutNode);
  });
});
