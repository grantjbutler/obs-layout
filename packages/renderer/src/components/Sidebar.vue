<template>
  <div class="bg-gray-200 w-72 macos:bg-transparent">
    <div class="flex justify-between gap-2 mb-2 macos:px-2 macos:pb-1 macos:border-b macos:border-system-separator macos:text-system-text-secondary">
      <select
        v-model="selectedLayout"
        class="windows:text-sm windows:border-gray-300 macos:bg-transparent macos:rounded macos:border-0 macos:text-sm macos:py-1 macos:pl-2 macos:pr-8"
      >
        <option
          v-for="layout in layouts"
          :key="layout.name"
          :value="layout"
        >
          {{ layout.name }}
        </option>
      </select>

      <div class="flex gap-2 align-baseline">
        <button
          title="Add Layout"
          @click="isNewLayoutModalOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button title="More">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>
      </div>
    </div>

    <new-layout-modal
      :open="isNewLayoutModalOpen"
      @close="setIsNewLayoutModalOpen"
    />

    <tree-control
      v-if="component"
      :component="component"
    />
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '/@/store/layout';
import { computed, ref } from 'vue';
import TreeControl from './Sidebar/TreeControl.vue';
import { useLayoutsStore } from '../store/layouts';
import NewLayoutModal from './Sidebar/NewLayoutModal.vue';

const store = useLayoutStore();
const component = computed(() => store.rootComponent);

const layoutsStore = useLayoutsStore();
const layouts = computed(() => layoutsStore.layouts);
const selectedLayout = computed({
  get: () => layoutsStore.selectedLayout,
  set: (value) => layoutsStore.selectLayout(value),
});

const isNewLayoutModalOpen = ref(false);
const setIsNewLayoutModalOpen = (isOpen: boolean) => isNewLayoutModalOpen.value = isOpen;
</script>
