import FlexComponentControls from './FlexComponentControls.vue';
import GridComponentControls from './GridComponentControls.vue';
import InsetComponentControls from './InsetComponentControls.vue';
import SourceComponentControls from './SourceComponentControls.vue';
import StackComponentControls from './StackComponentControls.vue';

import { FlexComponent, GridComponent, InsetComponent, SourceComponent, StackComponent } from '/@/layout';

export default {
  components: {
    FlexComponentControls,
    GridComponentControls,
    InsetComponentControls,
    SourceComponentControls,
    StackComponentControls,
  },
  registry: new Map<any, any>([
    [FlexComponent, FlexComponentControls],
    [GridComponent, GridComponentControls],
    [InsetComponent, InsetComponentControls],
    [SourceComponent, SourceComponentControls],
    [StackComponent, StackComponentControls],
  ]),
};
