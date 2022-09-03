<template>
  <ControlsGroup title="Flex Component">
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
    <FormControl label="Weights">
      <table class="macos:text-system-text-control macos:bg-system-background-control macos:w-full">
        <tbody class="block h-24 overflow-scroll border border-gray-500">
          <template v-if="component.children.length > 0">
            <WeightRow
              v-for="(child, index) in component.children"
              :key="child.id"
              :model-value="component.weights.get(child.id) || 1"
              :class="{'bg-transparent': index % 2 == 0, 'bg-gray-800': index % 2 == 1}"
              :name="child.name"
              @update:model-value="weight => setWeight(child.id, weight)"
            />
          </template>
          <tr v-else>
            <!-- We use a non-breaking space here so that we have some text for first baseline alignment to work. -->
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </FormControl>
  </ControlsGroup>
</template>

<script lang="ts" setup>
import type { FlexComponent } from '/@/layout';
import { setDirection, setDistribution, setSpacing, setWeight } from '/@/store/components/flex';
import { useIsWindows } from '/@/integration/platform';
import { computed } from 'vue';

import FormSelect from '/@/components/Form/FormSelect.vue';
import FormNumberInput from '/@/components/Form/FormNumberInput.vue';
import FormControl from '/@/components/Form/FormControl.vue';
import ControlsGroup from './ControlsGroup.vue';
import WeightRow from './WeightRow.vue';

const props = defineProps<{
  component: FlexComponent
}>();

const isWindows = useIsWindows();

const direction = computed({
  get(): 'horizontal' | 'vertical' { return props.component.direction; },
  set(direction: 'horizontal' | 'vertical') { setDirection(direction); },
});
const distribution = computed({
  get(): 'leading' | 'center' | 'trailing' { return props.component.distribution; },
  set(distribution: 'leading' | 'center' | 'trailing') { setDistribution(distribution); },
});
const spacing = computed({
  get() { return props.component.spacing; },
  set(spacing: number) { setSpacing(spacing); },
});
</script>
