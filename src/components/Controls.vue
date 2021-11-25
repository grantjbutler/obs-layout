<template>
  <div class="w-72 bg-gray-200 p-2">
    <div v-if="component">
      <div>
        <p>Base Component Controls</p>
      </div>

      <component :is="component.controlsComponent" :component="component"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { key } from '@/store'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import FlexComponentControls from './Controls/FlexComponentControls.vue'
import SourceComponentControls from './Controls/SourceComponentControls.vue'

export default defineComponent({
  components: {
    FlexComponentControls,
    SourceComponentControls
  },
  setup() {
    const store = useStore(key)

    return {
      component: computed(() => store.state.selectedComponent)
    }
  }
})
</script>
