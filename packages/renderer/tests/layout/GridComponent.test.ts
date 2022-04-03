import { describe, it, expect } from 'vitest';
import { ContainerLayoutNode, GridComponent, Frame, Size, SourceComponent, SourceLayoutNode } from '../../src/layout';

describe('FlexComponent', () => {
  it('should lay out', () => {
    const component = new GridComponent();
    component.rowSpacing = 10;
    component.columnSpacing = 10;
    component.columnCount = 3;

    for (let i = 0; i < 9; i++) {
      component.addChild(newSource());
    }

    const node = component.exerciseLayout(new Size(170, 170));
    expect(node.frame).to.eql(new Frame(0, 0, 170, 104.375));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(9);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];
    const dNode = (node as ContainerLayoutNode).children[3];
    const eNode = (node as ContainerLayoutNode).children[4];
    const fNode = (node as ContainerLayoutNode).children[5];
    const gNode = (node as ContainerLayoutNode).children[6];
    const hNode = (node as ContainerLayoutNode).children[7];
    const iNode = (node as ContainerLayoutNode).children[8];

    expect(aNode.frame).to.eql(new Frame(0, 0, 50, 28.125));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(60, 0, 50, 28.125));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(120, 0, 50, 28.125));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(dNode.frame).to.eql(new Frame(0, 38.125, 50, 28.125));
    expect(dNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(eNode.frame).to.eql(new Frame(60, 38.125, 50, 28.125));
    expect(eNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(fNode.frame).to.eql(new Frame(120, 38.125, 50, 28.125));
    expect(fNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(gNode.frame).to.eql(new Frame(0, 76.25, 50, 28.125));
    expect(gNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(hNode.frame).to.eql(new Frame(60, 76.25, 50, 28.125));
    expect(hNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(iNode.frame).to.eql(new Frame(120, 76.25, 50, 28.125));
    expect(iNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('should lay out with leading distribution', () => {
    const component = new GridComponent();
    component.rowSpacing = 10;
    component.columnSpacing = 10;
    component.columnCount = 3;
    component.distribution = 'leading';

    component.addChild(newSource());
    component.addChild(newSource());

    const node = component.exerciseLayout(new Size(170, 170));
    expect(node.frame).to.eql(new Frame(0, 0, 170, 28.125));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(2);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];

    expect(aNode.frame).to.eql(new Frame(0, 0, 50, 28.125));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(60, 0, 50, 28.125));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('should lay out with center distribution', () => {
    const component = new GridComponent();
    component.rowSpacing = 10;
    component.columnSpacing = 10;
    component.columnCount = 3;
    component.distribution = 'center';

    component.addChild(newSource());
    component.addChild(newSource());

    const node = component.exerciseLayout(new Size(170, 170));
    expect(node.frame).to.eql(new Frame(0, 0, 170, 28.125));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(2);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];

    expect(aNode.frame).to.eql(new Frame(30, 0, 50, 28.125));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(90, 0, 50, 28.125));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('should lay out with trailing distribution', () => {
    const component = new GridComponent();
    component.rowSpacing = 10;
    component.columnSpacing = 10;
    component.columnCount = 3;
    component.distribution = 'trailing';

    component.addChild(newSource());
    component.addChild(newSource());

    const node = component.exerciseLayout(new Size(170, 170));
    expect(node.frame).to.eql(new Frame(0, 0, 170, 28.125));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(2);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];

    expect(aNode.frame).to.eql(new Frame(60, 0, 50, 28.125));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(120, 0, 50, 28.125));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('should lay out with justify-between distribution', () => {
    const component = new GridComponent();
    component.rowSpacing = 10;
    component.columnSpacing = 10;
    component.columnCount = 4;
    component.distribution = 'justify-between';

    component.addChild(newSource());
    component.addChild(newSource());
    component.addChild(newSource());

    const node = component.exerciseLayout(new Size(230, 230));
    expect(node.frame).to.eql(new Frame(0, 0, 230, 28.125));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(3);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];
    const cNode = (node as ContainerLayoutNode).children[2];

    expect(aNode.frame).to.eql(new Frame(0, 0, 50, 28.125));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(90, 0, 50, 28.125));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(cNode.frame).to.eql(new Frame(180, 0, 50, 28.125));
    expect(cNode).to.be.an.instanceOf(SourceLayoutNode);
  });

  it('should lay out when given more than enough space', () => {
    const component = new GridComponent();
    component.rowSpacing = 10;
    component.columnSpacing = 10;

    component.addChild(newSource(1280, 720));
    component.addChild(newSource(1280, 720));

    const node = component.exerciseLayout(new Size(1920, 1090));
    expect(node.frame).to.eql(new Frame(0, 0, 1920, 1090));
    expect(node).to.be.an.instanceOf(ContainerLayoutNode);
    expect((node as ContainerLayoutNode).children).to.have.lengthOf(2);

    const aNode = (node as ContainerLayoutNode).children[0];
    const bNode = (node as ContainerLayoutNode).children[1];

    expect(aNode.frame).to.eql(new Frame(480, 0, 960, 540));
    expect(aNode).to.be.an.instanceOf(SourceLayoutNode);

    expect(bNode.frame).to.eql(new Frame(480, 550, 960, 540));
    expect(bNode).to.be.an.instanceOf(SourceLayoutNode);
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
