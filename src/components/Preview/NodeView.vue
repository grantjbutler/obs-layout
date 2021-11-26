<template>
  <div class="absolute box-border" :style="{...node.frame.toStyleObject(), 'background': borderColor}">
    <div class="relative box-border" v-if="node.children.length > 0">
      <node-view v-for="child in node.children" :key="child.id" :node="child"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import LayoutNode from '@/layout/LayoutNode'

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default defineComponent({
  name: 'NodeView',
  props: {
    node: {
      type: Object as PropType<LayoutNode>,
      required: true
    }
  },
  setup() {
    const borderColor = ref<string>(`rgba(${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, ${getRandomInt(0, 256)}, 0.25)`);

    return {
      borderColor
    }
  }
})
</script>
