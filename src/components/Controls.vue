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
import Component from '@/layout/Component'
import { defineComponent, PropType } from 'vue'
import FlexComponentControls from './Controls/FlexComponentControls.vue'
import SourceComponentControls from './Controls/SourceComponentControls.vue'

export default defineComponent({
  components: {
    FlexComponentControls,
    SourceComponentControls
  },
  props: {
    component: {
      type: Object as PropType<Component>
    }
  }
})
</script>
