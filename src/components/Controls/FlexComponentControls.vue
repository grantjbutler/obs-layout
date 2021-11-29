<template>
  <div>
    <p>Flex Component</p>
    <div>
      <label>Direction</label>
      <select v-model="direction">
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
    </div>
    <div>
      <label>Distribution</label>
      <select v-model="distribution">
        <option value="leading">Leading</option>
        <option value="center">Center</option>
        <option value="trailing">Trailing</option>
      </select>
    </div>
    <div>
      <label>Spacing</label>
      <input type="number" v-model="spacing">
    </div>
  </div>
</template>

<script lang="ts">
import { FlexComponent } from '@/layout'
import { key } from '@/store/app'
import { FLEX_SET_DIRECTION, FLEX_SET_DISTRIBUTION, FLEX_SET_SPACING } from '@/store/mutation-types'
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'FlexComponentControls',
  props: {
    component: {
      type: Object as PropType<FlexComponent>,
      required: true
    }
  },
  setup(props) {
    const store = useStore(key)
    const { component } = toRefs(props)
    
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
      })
    }
  }
})
</script>
