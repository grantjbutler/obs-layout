<template>
  <Disclosure
    v-slot="{ open }"
    as="div"
    class="mb-2 "
  >
    <div class="flex justify-between gap-2 macos:px-2 macos:pb-1 macos:border-b macos:border-system-separator macos:text-system-text-secondary">
      <span
        v-if="open"
        class="macos:py-1 macos:pl-2"
      >Layouts</span>
      <select
        v-else
        v-model="selectedLayout"
        class="text-sm windows:border-gray-300 macos:bg-transparent macos:rounded macos:border-0 macos:py-1 macos:pl-2 macos:pr-8"
      >
        <option
          v-for="layout in layouts"
          :key="layout.id"
          :value="layout.id"
        >
          {{ layout.name }}
        </option>
      </select>

      <div class="flex gap-2 align-baseline">
        <button
          title="Add Layout"
          @click="isNewLayoutModalOpen = true"
        >
          <PlusCircleIcon class="w-5 h-5" />
        </button>

        <DisclosureButton :title="open ? `Hide layout list` : `Reveal layout list`">
          <ChevronRightIcon
            class="w-4 h-4"
            :class="open ? 'transform rotate-90' : ''"
          />
        </DisclosureButton>
      </div>
    </div>

    <DisclosurePanel>
      <div class="flex flex-col h-24 overflow-y-auto macos:border-b macos:border-system-separator macos:py-1">
        <LayoutItem
          v-for="layout in layouts"
          :key="layout.id"
          :layout="layout"
        />
      </div>
    </DisclosurePanel>

    <new-layout-modal
      :open="isNewLayoutModalOpen"
      @close="setIsNewLayoutModalOpen"
    />
  </Disclosure>
</template>

<script lang="ts" setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue';
import {
  PlusCircleIcon,
  ChevronRightIcon,
} from '@heroicons/vue/solid';
import { computed, ref } from 'vue';
import { useLayoutsStore } from '/@/store/layouts';
import NewLayoutModal from '/@/components/Modals/NewLayoutModal.vue';
import LayoutItem from './LayoutItem.vue';

const layoutsStore = useLayoutsStore();
const layouts = computed(() => layoutsStore.layouts);
const selectedLayout = computed({
  get: () => layoutsStore.selectedLayout.id,
  set: (value) => layoutsStore.selectLayout(value),
});

const isNewLayoutModalOpen = ref(false);
const setIsNewLayoutModalOpen = (isOpen: boolean) => isNewLayoutModalOpen.value = isOpen;
</script>
