<template>
  <tree-control-item
    :component="component"
    :indentation-level="0"
  />
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';
import TreeControlItem from './TreeControlItem.vue';
import type { Component } from '/@/layout';
import { draggedComponentKey } from './TreeControlKeys';

defineProps<{
  component: Component
}>();

const draggedComponent = ref<Component | null>();
provide(draggedComponentKey, draggedComponent);
</script>
