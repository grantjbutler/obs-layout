<template>
  <ControlsGroup title="Grid Component">
    <FormNumberInput
      v-model="columnCount"
      label="Column Count"
      :shows-slider="isWindows"
    />
    <FormNumberInput
      v-model="columnSpacing"
      label="Column Spacing"
      :shows-slider="isWindows"
    />
    <FormNumberInput
      v-model="rowSpacing"
      label="Row Spacing"
      :shows-slider="isWindows"
    />
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
      <option value="justify-between">
        Justify Between
      </option>
    </FormSelect>
  </ControlsGroup>
</template>

<script lang="ts" setup>
import type { GridComponent } from '/@/layout';
import { useIsWindows } from '/@/integration/platform';
import { computed } from 'vue';

import FormSelect from '/@/components/Form/FormSelect.vue';
import FormNumberInput from '/@/components/Form/FormNumberInput.vue';
import ControlsGroup from './ControlsGroup.vue';
import { setColumnCount, setColumnSpacing, setDistribution, setRowSpacing } from '/@/store/components/grid';

const props = defineProps<{
  component: GridComponent
}>();

const isWindows = useIsWindows();

const distribution = computed({
  get(): 'leading' | 'center' | 'trailing' | 'justify-between' { return props.component.distribution; },
  set(distribution: 'leading' | 'center' | 'trailing' | 'justify-between') { setDistribution(distribution); },
});
const columnSpacing = computed({
  get() { return props.component.columnSpacing; },
  set(spacing: number) { setColumnSpacing(spacing); },
});
const rowSpacing = computed({
  get() { return props.component.rowSpacing; },
  set(spacing: number) { setRowSpacing(spacing); },
});
const columnCount = computed({
  get() { return props.component.columnCount; },
  set(count: number) { setColumnCount(count); },
});
</script>
