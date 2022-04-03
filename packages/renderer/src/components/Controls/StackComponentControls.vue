<template>
  <Controls title="Stack Component">
    <FormSelect
      v-model="horizontalAlignment"
      label="Horizontal Alignment"
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
    <FormSelect
      v-model="verticalAlignment"
      label="Vertical Alignment"
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
  </Controls>
</template>

<script lang="ts" setup>
import type { StackComponent } from '/@/layout';
import { computed } from 'vue';

import FormSelect from '/@/components/Form/FormSelect.vue';
import Controls from './Controls.vue';
import { setHorizontalAlignment, setVerticalAlignment } from '/@/store/components/stack';

const props = defineProps<{
  component: StackComponent
}>();

const horizontalAlignment = computed({
  get(): 'leading' | 'center' | 'trailing' { return props.component.horizontalAlignment; },
  set(alignment: 'leading' | 'center' | 'trailing') { setHorizontalAlignment(alignment); },
});

const verticalAlignment = computed({
  get(): 'leading' | 'center' | 'trailing' { return props.component.verticalAlignment; },
  set(alignment: 'leading' | 'center' | 'trailing') { setVerticalAlignment(alignment); },
});

</script>
