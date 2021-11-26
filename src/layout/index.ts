import Component from './Component'
import FlexComponent from './FlexComponent'
import InsetComponent from './InsetComponent';
import SourceComponent from './SourceComponent'
import LayoutExerciser from './LayoutExerciser'
import Frame from './Frame'
import Size from './Size'
import LayoutNode from './LayoutNode'

export const components: { [index: string]: typeof Component } = {
  FlexComponent,
  InsetComponent,
  SourceComponent
}

export {
  Component,
  FlexComponent,
  InsetComponent,
  SourceComponent,
  LayoutExerciser,
  Frame,
  Size,
  LayoutNode,
}