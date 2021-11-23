import Component from "./Component";

export default class FlexComponent extends Component {
  direction: 'horizontal' | 'vertical' = 'horizontal'

  get name(): string {
    return 'Flex Component'
  }

  get viewComponent(): string {
    return 'FlexComponentView'
  }

  get controlsComponent(): string {
    return 'FlexComponentControls'
  }
}