<template>
  <div class="m-5 space-y-4">
    <h3 class="text-lg">Flex Component</h3>
    <FormSelect label="Direction" v-model="direction">
      <option value="horizontal">Horizontal</option>
      <option value="vertical">Vertical</option>
    </FormSelect>
    <FormSelect label="Distribution" v-model="distribution">
        <option value="leading">Leading</option>
        <option value="center">Center</option>
        <option value="trailing">Trailing</option>
    </FormSelect>
    <FormNumberInput label="Spacing" v-model="spacing" :shows-slider="isWindows"></FormNumberInput>
  </div>
</template>

<script lang="ts">
import { FlexComponent } from '@/layout'
import { useStore } from '@/store/app'
import { FLEX_SET_DIRECTION, FLEX_SET_DISTRIBUTION, FLEX_SET_SPACING } from '@/store/mutation-types'
import { useIsWindows } from '@/integration/platform';
import { computed, defineComponent, PropType, toRefs } from 'vue'
import FormSelect from '@/components/Form/FormSelect.vue';
import FormNumberInput from '@/components/Form/FormNumberInput.vue';

export default defineComponent({
  name: 'FlexComponentControls',
  props: {
    component: {
      type: Object as PropType<FlexComponent>,
      required: true
    }
  },
  components: {
    FormSelect,
    FormNumberInput
  },
  setup(props) {
    const store = useStore()
    const { component } = toRefs(props)
    const isWindows = useIsWindows();
    
    return {
      direction: computed({
        get() { return component.value.direction },
        set(direction) { store.commit(FLEX_SET_DIRECTION, direction) }
      }),
      distribution: computed({
        get() { return component.value.distribution },
        set(distribution) { store.commit(FLEX_SET_DISTRIBUTION, distribution) }
      }),
      spacing: computed({
        get() { return component.value.spacing },
        set(spacing: number) { store.commit(FLEX_SET_SPACING, spacing) }
      }),
      isWindows
    }
  }
})
</script>
