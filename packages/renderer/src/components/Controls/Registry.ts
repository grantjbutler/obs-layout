import FlexComponentControls from './FlexComponentControls.vue';
import GridComponentControls from './GridComponentControls.vue';
import InsetComponentControls from './InsetComponentControls.vue';
import SourceComponentControls from './SourceComponentControls.vue';

import { FlexComponent, GridComponent, InsetComponent, SourceComponent } from '/@/layout';

export default {
  components: {
    FlexComponentControls,
    GridComponentControls,
    InsetComponentControls,
    SourceComponentControls,
  },
  registry: new Map<any, any>([
    [FlexComponent, FlexComponentControls],
    [GridComponent, GridComponentControls],
    [InsetComponent, InsetComponentControls],
    [SourceComponent, SourceComponentControls],
  ]),
};
