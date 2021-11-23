<template>
  <div>
    <p>Source Component</p>
    <div>
      <label>Source</label>
      <select :value="component.source" @change="setSource">
        <option value="">None</option>
        <option value="MC Ninja">MC Ninja</option>
        <option value="Game capture">Game capture</option>
        <option value="facecam">facecam</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import SourceComponent from '@/layout/SourceComponent'
import { defineComponent, PropType, toRefs } from 'vue'

export default defineComponent({
  props: {
    component: {
      type: Object as PropType<SourceComponent>,
      required: true
    }
  },
  setup(props) {
    const { component } = toRefs(props)

    const setSource = (source: string) => {
      component.value.source = source
    }

    return {
      setSource
    }
  },
})
</script>
