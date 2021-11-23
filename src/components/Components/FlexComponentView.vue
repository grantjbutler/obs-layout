<template>
  <div class="flex" :class="{ 'flex-col': component.direction == 'vertical', 'flex-row': component.direction == 'horizontal' }">
    <component v-for="child in component.children" :key="child.id" :is="child.viewComponent" :component="child"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import FlexComponent from '@/layout/FlexComponent'

export default defineComponent({
  props: {
    component: {
      type: Object as PropType<FlexComponent>,
      required: true
    }
  }
})
</script>
