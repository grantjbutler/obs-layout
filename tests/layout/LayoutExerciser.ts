import { describe } from 'mocha';
import { expect } from 'chai';
import { FlexComponent, Frame, InsetComponent, LayoutExerciser, Size, SourceComponent } from '@/layout';
import Insets from '@/layout/Insets';

describe('LayoutExerciser', () => {
  it('should perform layout', () => {
    const component = new SourceComponent()
    
    const exerciser = new LayoutExerciser()
    const node = exerciser.execute(component, new Size(160, 100));

    expect(node.frame).to.eql(new Frame(0, 5, 160, 90));
    expect(node.isContainer).to.equal(false);
    expect(node.children).to.eql([]);
  })

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
    horizontalFlexComponent.addChild(new SourceComponent())
    horizontalFlexComponent.addChild(new SourceComponent())

    verticalFlexComponent.addChild(horizontalFlexComponent);
    verticalFlexComponent.addChild(new SourceComponent())

    const exerciser = new LayoutExerciser()
    const node = exerciser.execute(rootComponent, new Size(1920, 1080));

    expect(node.frame).to.eql(new Frame(0, 0, 1920, 1080));
    expect(node.isContainer).to.equal(true);
    expect(node.children.length).to.equal(1);

    const verticalFlexNode = node.children[0];
    expect(verticalFlexNode.frame).to.eql(new Frame(50, 50, 1820, 980));
    expect(verticalFlexNode.isContainer).to.equal(true);
    expect(verticalFlexNode.children.length).to.equal(2);

    const horizontalFlexNode = verticalFlexNode.children[0];
    expect(horizontalFlexNode.frame).to.eql(new Frame(0, 0, 1820, 465));
    expect(horizontalFlexNode.isContainer).to.equal(true);
    expect(horizontalFlexNode.children.length).to.equal(2);

    const bottomSourceNode = verticalFlexNode.children[1];
    expect(bottomSourceNode.frame).to.eql(new Frame(496.66666666666663, 515, 826.6666666666667, 465));
    expect(bottomSourceNode.isContainer).to.equal(false);
    expect(bottomSourceNode.children).to.eql([]);

    const topLeftSourceNode = horizontalFlexNode.children[0];
    expect(topLeftSourceNode.frame).to.eql(new Frame(58.33333333333326, 0, 826.6666666666667, 465));
    expect(topLeftSourceNode.isContainer).to.equal(false);
    expect(topLeftSourceNode.children).to.eql([]);

    const topRightSourceNode = horizontalFlexNode.children[1];
    expect(topRightSourceNode.frame).to.eql(new Frame(935, 0, 826.6666666666667, 465));
    expect(topRightSourceNode.isContainer).to.equal(false);
    expect(topRightSourceNode.children).to.eql([]);
  });
});