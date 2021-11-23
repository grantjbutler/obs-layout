<template>
  <div class="bg-black aspect-w-16 aspect-h-9">
    <span v-text="component.source"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SourceComponent from '@/layout/SourceComponent'

export default defineComponent({
  props: {
    component: {
      type: Object as PropType<SourceComponent>,
      required: true
    }
  }
})
</script>
