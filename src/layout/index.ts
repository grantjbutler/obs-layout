import Component from './Component'
import FlexComponent from './FlexComponent'
import InsetComponent from './InsetComponent';
import SourceComponent from './SourceComponent'
import LayoutExerciser from './LayoutExerciser'
import Frame from './Frame'
import Size from './Size'
import LayoutNode from './LayoutNode'
import ContainerComponent from './ContainerComponent';
import ContainerLayoutNode from './ContainerLayoutNode';
import SourceLayoutNode from './SourceLayoutNode';

export const components: { [index: string]: typeof Component } = {
  FlexComponent,
  InsetComponent,
  SourceComponent
}

export const containerComponents: { [index: string]: typeof ContainerComponent } = {
  FlexComponent,
  InsetComponent
}

export {
  Component,
  ContainerComponent,
  FlexComponent,
  InsetComponent,
  SourceComponent,
  LayoutExerciser,
  Frame,
  Size,
  LayoutNode,
  ContainerLayoutNode,
  SourceLayoutNode
}