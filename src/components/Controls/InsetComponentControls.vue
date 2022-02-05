<template>
  <div class="m-5 space-y-4">
    <h3 class="text-lg">Inset Component</h3>
    <label>Insets</label>
    <FormNumberInput label="Top" v-model="top"></FormNumberInput>
    <FormNumberInput label="Left" v-model="left"></FormNumberInput>
    <FormNumberInput label="Bottom" v-model="bottom"></FormNumberInput>
    <FormNumberInput label="Right" v-model="right"></FormNumberInput>
  </div>
</template>

<script lang="ts">
import InsetComponent from '@/layout/InsetComponent';
import { useStore } from '@/store/app'
import { INSET_SET_INSETS } from '@/store/mutation-types';
import { computed, defineComponent, PropType, toRefs } from 'vue'
import FormNumberInput from '@/components/Form/FormNumberInput.vue';

export default defineComponent({
  name: 'InsetComponentControls',
  props: {
    component: {
      type: Object as PropType<InsetComponent>,
      required: true
    }
  },
  components: {
    FormNumberInput
  },
  setup(props) {
    const { component } = toRefs(props);
    const store = useStore();

    return {
      top: computed({
        get() { return component.value.insets.top },
        set(newValue: number) {
          const insets = component.value.insets
          insets.top = newValue
          store.commit(INSET_SET_INSETS, insets)
        }
      }),
      left: computed({
        get() { return component.value.insets.left },
        set(newValue: number) {
          const insets = component.value.insets
          insets.left = newValue
          store.commit(INSET_SET_INSETS, insets)
        }
      }),
      bottom: computed({
        get() { return component.value.insets.bottom },
        set(newValue: number) {
          const insets = component.value.insets
          insets.bottom = newValue
          store.commit(INSET_SET_INSETS, insets)
        }
      }),
      right: computed({
        get() { return component.value.insets.right },
        set(newValue: number) {
          const insets = component.value.insets
          insets.right = newValue
          store.commit(INSET_SET_INSETS, insets)
        }
      })
    }
  },
})
</script>
