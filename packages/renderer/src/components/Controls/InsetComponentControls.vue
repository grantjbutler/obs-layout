<template>
  <Controls title="Inset Component">
    <label class="macos:px-2 macos:pb-2 macos:-mt-2 macos:border-b macos:border-system-separator macos:text-system-text-secondary macos:font-semibold">Insets</label>
    <FormNumberInput
      v-model="top"
      label="Top"
    />
    <FormNumberInput
      v-model="left"
      label="Left"
    />
    <FormNumberInput
      v-model="bottom"
      label="Bottom"
    />
    <FormNumberInput
      v-model="right"
      label="Right"
    />
  </Controls>
</template>

<script lang="ts" setup>
import type InsetComponent from '/@/layout/InsetComponent';
import { useStore } from '/@/store/app';
import { INSET_SET_INSETS } from '/@/store/mutation-types';
import { computed } from 'vue';
import FormNumberInput from '/@/components/Form/FormNumberInput.vue';
import Controls from './Controls.vue';

const props = defineProps<{
  component: InsetComponent
}>();

const store = useStore();

const top = computed({
  get() { return props.component.insets.top; },
  set(newValue: number) {
    const insets = props.component.insets;
    insets.top = newValue;
    store.commit(INSET_SET_INSETS, insets);
  },
});

const left = computed({
  get() { return props.component.insets.left; },
  set(newValue: number) {
    const insets = props.component.insets;
    insets.left = newValue;
    store.commit(INSET_SET_INSETS, insets);
  },
});

const bottom = computed({
  get() { return props.component.insets.bottom; },
  set(newValue: number) {
    const insets = props.component.insets;
    insets.bottom = newValue;
    store.commit(INSET_SET_INSETS, insets);
  },
});

const right = computed({
  get() { return props.component.insets.right; },
  set(newValue: number) {
    const insets = props.component.insets;
    insets.right = newValue;
    store.commit(INSET_SET_INSETS, insets);
  },
});
</script>
