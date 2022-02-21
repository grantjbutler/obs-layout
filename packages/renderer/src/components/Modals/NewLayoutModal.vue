<template>
  <TransitionRoot
    appear
    :show="open"
  >
    <Dialog
      class="fixed inset-0 z-10 overflow-y-auto"
      @close="(isOpen: boolean) => $emit('close', isOpen)"
    >
      <div class="flex items-center justify-center min-h-screen">
        <TransitionChild
          enter="transition-opacity duration-200 ease-linear"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity duration-200 ease-linear"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 macos:bg-black windows:bg-white macos:opacity-30 windows:opacity-50" />
        </TransitionChild>

        <TransitionChild
          enter="transition duration-200 ease-linear"
          enter-from="opacity-0 macos:-translate-y-8"
          enter-to="opacity-100 macos:translate-y-0"
          leave="transition duration-200 ease-linear"
          leave-from="opacity-100 macos:translate-y-0"
          leave-to="opacity-0 macos:-translate-y-8"
        >
          <div class="relative flex flex-col gap-3 p-4 mx-auto text-sm border rounded-lg macos:shadow-lg macos:max-w-sm windows:w-80 bg-system-background-under-page macos:text-system-text macos:border-system-separator windows:border-system-divider">
            <h3 class="hidden text-xl windows:block">
              Add a Layout
            </h3>

            <div class="flex flex-col gap-2">
              <label>Layout Name</label>
              <input
                v-model="name"
                type="text"
                class="macos:text-system-text-control macos:bg-system-background-control macos:w-full macos:px-2 macos:py-1 macos:rounded"
              >
            </div>

            <div class="flex flex-col gap-1">
              <label>Root Component</label>
              <select
                v-model="rootComponent"
                class="windows:border-gray-300 macos:text-system-text-control macos:bg-system-background-control macos:w-full macos:rounded macos:py-1 macos:px-2"
              >
                <option
                  v-for="(component, key) in ContainerComponents"
                  :key="component.displayName"
                  :value="key"
                >
                  {{ component.displayName }}
                </option>
              </select>
            </div>

            <div class="flex w-full gap-2 windows:flex-row-reverse macos:justify-end">
              <button
                class="px-2 py-1 rounded macos:bg-gray-500 windows:bg-gray-300 windows:w-1/2"
                @click.prevent="cancel"
              >
                Cancel
              </button>
              <button
                class="px-2 py-1 rounded bg-system-background-selected-content disabled:opacity-30 windows:w-1/2 windows:text-white"
                :disabled="!isCreateButtonEnabled"
                @click.prevent="create"
              >
                Create Layout
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>template>

<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import { computed, ref } from 'vue';
import type { ContainerComponent } from '/@/layout';
import { containerComponents as ContainerComponents, components as LayoutComponents } from '/@/layout';
import { useLayoutsStore } from '/@/store/layouts';

defineProps<{
  open: boolean
}>();

const emit = defineEmits<{
  (e: 'close', isOpen: boolean): void
}>();

const store = useLayoutsStore();

const name = ref('');
const rootComponent = ref<string>('');

const isCreateButtonEnabled = computed(() => name.value !== '' && rootComponent.value !== '');

const clear = () => {
  name.value = '';
  rootComponent.value = '';
};
const cancel = () => {
  clear();
  emit('close', false);
};
const create = () => {
  store.createLayout(name.value, new LayoutComponents[rootComponent.value]() as ContainerComponent);
  clear();
  emit('close', false);
};
</script>
