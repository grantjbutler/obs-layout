<template>
  <div>
    <p class="controls-heading">Source Component</p>
    <div class="control-field">
      <label>Source</label>
      <select v-model="source">
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
import { key } from '@/store/app'
import { SOURCE_SET_SOURCE } from '@/store/mutation-types'
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SourceComponentControls',
  props: {
    component: {
      type: Object as PropType<SourceComponent>,
      required: true
    }
  },
  setup(props) {
    const store = useStore(key)
    const { component } = toRefs(props)

    return {
      source: computed({
        get() { return component.value.source },
        set(value) { store.commit(SOURCE_SET_SOURCE, value) }
      })
    }
  },
})
</script>
