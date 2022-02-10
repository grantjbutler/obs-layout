<template>
  <Controls title="Flex Component">
    <FormSelect
      v-model="direction"
      label="Direction"
    >
      <option value="horizontal">
        Horizontal
      </option>
      <option value="vertical">
        Vertical
      </option>
    </FormSelect>
    <FormSelect
      v-model="distribution"
      label="Distribution"
    >
      <option value="leading">
        Leading
      </option>
      <option value="center">
        Center
      </option>
      <option value="trailing">
        Trailing
      </option>
    </FormSelect>
    <FormNumberInput
      v-model="spacing"
      label="Spacing"
      :shows-slider="isWindows"
    />
  </Controls>
</template>

<script lang="ts" setup>
import type { FlexComponent } from '/@/layout';
import { useStore } from '/@/store/app';
import { FLEX_SET_DIRECTION, FLEX_SET_DISTRIBUTION, FLEX_SET_SPACING } from '/@/store/mutation-types';
import { useIsWindows } from '/@/integration/platform';
import { computed } from 'vue';

import FormSelect from '/@/components/Form/FormSelect.vue';
import FormNumberInput from '/@/components/Form/FormNumberInput.vue';
import Controls from './Controls.vue';

const props = defineProps<{
  component: FlexComponent
}>();

const store = useStore();
const isWindows = useIsWindows();

const direction = computed({
  get(): 'horizontal' | 'vertical' { return props.component.direction; },
  set(direction: 'horizontal' | 'vertical') { store.commit(FLEX_SET_DIRECTION, direction); },
});
const distribution = computed({
  get(): 'leading' | 'center' | 'trailing' { return props.component.distribution; },
  set(distribution: 'leading' | 'center' | 'trailing') { store.commit(FLEX_SET_DISTRIBUTION, distribution); },
});
const spacing = computed({
  get() { return props.component.spacing; },
  set(spacing: number) { store.commit(FLEX_SET_SPACING, spacing); },
});
</script>