<template>
  <div
    class="macos:mx-2 macos:rounded macos:px-2 macos:py-1"
    :class="{'bg-system-background-selected-content': isSelected, 'text-white': isSelected}"
    @click.prevent="select"
  >
    <span>{{ layout.name }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Layout } from '/@/layout';
import { useLayoutsStore } from '/@/store/layouts';

const props = defineProps<{
  layout: Layout
}>();

const layoutsStore = useLayoutsStore();
const isSelected = computed(() => layoutsStore.selectedLayout.name == props.layout.name);

const select = () => {
  if (isSelected.value) { return; }
  layoutsStore.selectLayout(props.layout);
};
</script>
