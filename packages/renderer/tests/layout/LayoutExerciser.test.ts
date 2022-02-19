import { describe, it, expect } from 'vitest';
import { FlexComponent, Frame, InsetComponent, LayoutExerciser, Size, SourceComponent, Insets, ContainerLayoutNode, SourceLayoutNode } from '../../src/layout';

describe('LayoutExerciser', () => {
  it('should perform layout', () => {
    const component = new SourceComponent();
    component.source = {
      name: 'source',
      width: 160,
      height: 90,
    };

    const exerciser = new LayoutExerciser();
    const node = exerciser.execute(component, new Size(160, 100));

    expect(node.frame).to.eql(new Frame(0, 5, 160, 90));
    expect(node).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('should perform complex layout', () => {
    const rootComponent = new InsetComponent();
    rootComponent.insets = new Insets(50, 50, 50, 50);

    const verticalFlexComponent = new FlexComponent();
    verticalFlexComponent.direction = 'vertical';
    verticalFlexComponent.spacing = 50;
    rootComponent.addChild(verticalFlexComponent);

    const horizontalFlexComponent = new FlexComponent();
    horizontalFlexComponent.direction = 'horizontal';
    horizontalFlexComponent.spacing = 50;
    horizontalFlexComponent.addChild(newSource());
    horizontalFlexComponent.addChild(newSource());

    verticalFlexComponent.addChild(horizontalFlexComponent);
    verticalFlexComponent.addChild(newSource());

    const exerciser = new LayoutExerciser();
    const node = exerciser.execute(rootComponent, new Size(1920, 1080));

    expect(node.frame).to.eql(new Frame(0, 0, 1920, 1080));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(1);

    const verticalFlexNode = (node as ContainerLayoutNode).children[0];
    expect(verticalFlexNode.frame).to.eql(new Frame(50, 50, 1820, 980));
    expect(verticalFlexNode).to.be.an.instanceOf(ContainerLayoutNode);
    expect((verticalFlexNode as ContainerLayoutNode).children).to.have.lengthOf(2);

    const horizontalFlexNode = (verticalFlexNode as ContainerLayoutNode).children[0];
    expect(horizontalFlexNode.frame).to.eql(new Frame(0, 0, 1820, 465));
    expect(horizontalFlexNode).to.be.an.instanceOf(ContainerLayoutNode);
    expect((horizontalFlexNode as ContainerLayoutNode).children).to.have.lengthOf(2);

    const bottomSourceNode = (verticalFlexNode as ContainerLayoutNode).children[1];
    expect(bottomSourceNode.frame).to.eql(new Frame(496.66666666666663, 515, 826.6666666666667, 465));
    expect(bottomSourceNode).to.be.an.instanceOf(SourceLayoutNode);

    const topLeftSourceNode = (horizontalFlexNode as ContainerLayoutNode).children[0];
    expect(topLeftSourceNode.frame).to.eql(new Frame(58.33333333333326, 0, 826.6666666666667, 465));
    expect(topLeftSourceNode).to.be.an.instanceOf(SourceLayoutNode);

    const topRightSourceNode = (horizontalFlexNode as ContainerLayoutNode).children[1];
    expect(topRightSourceNode.frame).to.eql(new Frame(935, 0, 826.6666666666667, 465));
    expect(topRightSourceNode).to.be.an.instanceOf(SourceLayoutNode);
  });
});

function newSource(): SourceComponent {
  const component = new SourceComponent();
  component.source = {
    name: 'source',
    width: 1920,
    height: 1080,
  };
  return component;
}
