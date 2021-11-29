<template>
  <div>
    <p>Flex Component</p>
    <div>
      <label>Insets</label>
      <div>
        <label>Top</label>
        <input type="number" v-model="top">
      </div>
      <div>
        <label>Left</label>
        <input type="number" v-model="left">
      </div>
      <div>
        <label>Bottom</label>
        <input type="number" v-model="bottom">
      </div>
      <div>
        <label>Right</label>
        <input type="number" v-model="right">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InsetComponent from '@/layout/InsetComponent';
import { key } from '@/store/app'
import { INSET_SET_INSETS } from '@/store/mutation-types';
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'InsetComponentControls',
  props: {
    component: {
      type: Object as PropType<InsetComponent>,
      required: true
    }
  },
  setup(props) {
    const { component } = toRefs(props);
    const store = useStore(key);

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
