import FlexComponentControls from './FlexComponentControls.vue';
import InsetComponentControls from './InsetComponentControls.vue';
import SourceComponentControls from './SourceComponentControls.vue';

import { FlexComponent, InsetComponent, SourceComponent } from '@/layout';

export default {
  components: {
    FlexComponentControls,
    InsetComponentControls,
    SourceComponentControls,
  },
  registry: new Map<any, any>([
    [FlexComponent, FlexComponentControls],
    [InsetComponent, InsetComponentControls],
    [SourceComponent, SourceComponentControls]
  ])
}