<template>
  <div class="flex-1 bg-gray-400">
    <div class="flex flex-col h-screen p-4 justify-center items-center">
      <div class="flex flex-row max-h-full w-full" style="aspect-ratio: 16 / 9">
        <div class="bg-red-600 shadow-lg w-full" style="aspect-ratio: 16 / 9">
          <component v-for="child in component.children" :key="child.id" :is="child.viewComponent" :component="child"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import RootComponent from '@/layout/RootComponent'
import { defineComponent, PropType } from 'vue'
import FlexComponentView from './Components/FlexComponentView.vue'
import SourceComponentView from './Components/SourceComponentView.vue'

export default defineComponent({
  name: 'Preview',
  components: {
    FlexComponentView,
    SourceComponentView,
  },
  props: {
    component: {
      type: Object as PropType<RootComponent>,
      required: true
    }
  }
})
</script>
