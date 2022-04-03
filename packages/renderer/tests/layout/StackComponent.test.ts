import { describe, it, expect } from 'vitest';
import { ContainerLayoutNode, StackComponent, Frame, Size, SourceComponent, SourceLayoutNode } from '../../src/layout';

describe('StackComponent', () => {
  it('lays out leading vertically, leading horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'leading';
    component.horizontalAlignment = 'leading';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 0, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(0, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out leading vertically, center horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'leading';
    component.horizontalAlignment = 'center';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 0, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(25, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out leading vertically, trailing horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'leading';
    component.horizontalAlignment = 'trailing';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 0, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(50, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out center vertically, leading horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'center';
    component.horizontalAlignment = 'leading';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 25, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(0, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out center vertically, center horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'center';
    component.horizontalAlignment = 'center';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 25, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(25, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out center vertically, trailing horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'center';
    component.horizontalAlignment = 'trailing';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 25, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(50, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out trailing vertically, leading horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'trailing';
    component.horizontalAlignment = 'leading';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 50, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(0, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out trailing vertically, center horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'trailing';
    component.horizontalAlignment = 'center';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 50, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(25, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('lays out trailing vertically, trailing horizontally', () => {
    const component = new StackComponent();
    component.verticalAlignment = 'trailing';
    component.horizontalAlignment = 'trailing';

    component.addChild(newSource(100, 50));
    component.addChild(newSource(50, 50));
    component.addChild(newSource(50, 100));

    const node = component.exerciseLayout(new Size(100, 100));
    expect(node.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 50, 100, 50));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(0, 0, 100, 100));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(50, 0, 50, 100));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });
});

function newSource(width = 1920, height = 1080): SourceComponent {
  const component = new SourceComponent();
  component.source = {
    name: 'source',
    width,
    height,
  };
  return component;
}
