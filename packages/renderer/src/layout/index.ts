import Component from './Component';
import FlexComponent from './FlexComponent';
import GridComponent from './GridComponent';
import InsetComponent from './InsetComponent';
import SourceComponent from './SourceComponent';
import StackComponent from './StackComponent';
import LayoutExerciser from './LayoutExerciser';
import Frame from './Frame';
import Size from './Size';
import LayoutNode from './LayoutNode';
import ContainerComponent from './ContainerComponent';
import ContainerLayoutNode from './ContainerLayoutNode';
import SourceLayoutNode from './SourceLayoutNode';
import Insets from './Insets';

export const components: { [index: string]: typeof Component } = {
  FlexComponent,
  GridComponent,
  InsetComponent,
  StackComponent,
  SourceComponent,
};

export const containerComponents: { [index: string]: typeof ContainerComponent } = {
  FlexComponent,
  GridComponent,
  InsetComponent,
  StackComponent,
};

export interface Layout {
  id: string
  name: string
  rootComponent: ContainerComponent
}

export {
  Component,
  ContainerComponent,
  FlexComponent,
  GridComponent,
  InsetComponent,
  SourceComponent,
  StackComponent,
  LayoutExerciser,
  Frame,
  Size,
  LayoutNode,
  ContainerLayoutNode,
  SourceLayoutNode,
  Insets,
};
