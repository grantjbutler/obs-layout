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

<script lang="ts">
import type InsetComponent from '/@/layout/InsetComponent';
import { useStore } from '/@/store/app';
import { INSET_SET_INSETS } from '/@/store/mutation-types';
import type { PropType} from 'vue';
import { computed, defineComponent, toRefs } from 'vue';
import FormNumberInput from '/@/components/Form/FormNumberInput.vue';
import Controls from './Controls.vue';
export default defineComponent({
  name: 'InsetComponentControls',
  props: {
    component: {
      type: Object as PropType<InsetComponent>,
      required: true,
    },
  },
  components: {
    FormNumberInput,
    Controls,
  },
  setup(props) {
    const { component } = toRefs(props);
    const store = useStore();
    return {
      top: computed({
        get() { return component.value.insets.top; },
        set(newValue: number) {
          const insets = component.value.insets;
          insets.top = newValue;
          store.commit(INSET_SET_INSETS, insets);
        },
      }),
      left: computed({
        get() { return component.value.insets.left; },
        set(newValue: number) {
          const insets = component.value.insets;
          insets.left = newValue;
          store.commit(INSET_SET_INSETS, insets);
        },
      }),
      bottom: computed({
        get() { return component.value.insets.bottom; },
        set(newValue: number) {
          const insets = component.value.insets;
          insets.bottom = newValue;
          store.commit(INSET_SET_INSETS, insets);
        },
      }),
      right: computed({
        get() { return component.value.insets.right; },
        set(newValue: number) {
          const insets = component.value.insets;
          insets.right = newValue;
          store.commit(INSET_SET_INSETS, insets);
        },
      }),
    };
  },
});
</script>
