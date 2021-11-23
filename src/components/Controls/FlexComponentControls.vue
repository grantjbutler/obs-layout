<template>
  <div>
    <p>Flex Component</p>
    <div>
      <label>Direction</label>
      <select :value="component.direction" @change="setDirection">
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import FlexComponent from '@/layout/FlexComponent'
import { defineComponent, PropType, toRefs } from 'vue'

export default defineComponent({
  props: {
    component: {
      type: Object as PropType<FlexComponent>,
      required: true
    }
  },
  setup(props) {
    const { component } = toRefs(props)
    
    const setDirection = (direction: 'horizontal' | 'vertical') => {
      component.value.direction = direction
    }

    return {
      setDirection
    }
  }
})
</script>
