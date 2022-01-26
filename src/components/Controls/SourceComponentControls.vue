<template>
  <div>
    <p class="controls-heading">Source Component</p>
    <div class="control-field">
      <label>Source</label>
      <select v-model="source">
        <option v-for="aSource in sources" :key="aSource" :value="aSource" v-text="aSource.name"></option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import SourceComponent from '@/layout/SourceComponent'
import { useStore } from '@/store/app'
import { SOURCE_SET_SOURCE } from '@/store/mutation-types'
import { computed, defineComponent, PropType, toRefs } from 'vue'

export default defineComponent({
  name: 'SourceComponentControls',
  props: {
    component: {
      type: Object as PropType<SourceComponent>,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const { component } = toRefs(props)
    const sources = computed(() => store.state.sources);

    return {
      source: computed({
        get() { return component.value.source },
        set(value) { store.commit(SOURCE_SET_SOURCE, value) }
      }),
      sources
    }
  },
})
</script>
