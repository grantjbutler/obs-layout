import Component from "./Component"

export default class SourceComponent extends Component {
  source?: string = undefined // This may need to be a different type depending on what OBS returns.

  get name(): string {
    return 'Source Component'
  }

  get viewComponent(): string {
    return 'SourceComponentView'
  }

  get controlsComponent(): string {
    return 'SourceComponentControls'
  }
}