import { Component, FlexComponent, SourceComponent } from ".";

export default interface ComponentVisitor {
  visitComponent(component: Component): void
  visitFlexComponent(component: FlexComponent): void
  visitSourceComponent(component: SourceComponent): void
}