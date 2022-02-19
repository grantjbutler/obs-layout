<template>
  <div
    v-click-away="exitEditing"
    class="macos:mx-2 macos:rounded macos:px-2 macos:py-1"
    :class="{'bg-system-background-selected-content': isSelected, 'text-white': isSelected}"
    @click="select"
    @click.self="exitEditing"
    @dblclick.prevent="enterEditing"
  >
    <input
      v-if="isEditing"
      v-model.lazy="name"
      v-focus
      type="text"
      class="p-0 text-sm border-0 bg-system-background-under-page"
      @keydown.esc="exitEditing"
    >
    <span
      v-else
    >{{ layout.name }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { Layout } from '/@/layout';
import { useLayoutsStore } from '/@/store/layouts';

const props = defineProps<{
  layout: Layout
}>();

const layoutsStore = useLayoutsStore();
const isSelected = computed(() => layoutsStore.selectedLayout.name == props.layout.name);
const isEditing = ref(false);

const enterEditing = () => {
  if (!isSelected.value) { return; }
  isEditing.value = true;
};

const exitEditing = () => {
  isEditing.value = false;
};

const select = () => {
  if (isSelected.value) { return; }
  layoutsStore.selectLayout(props.layout);
};

watch(isSelected, (value) => {
  if (!value) {
    exitEditing();
  }
});

const name = computed({
  get: () => props.layout.name,
  set: (value) => layoutsStore.renameLayout(props.layout.name, value),
});
</script>
