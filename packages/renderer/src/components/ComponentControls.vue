<template>
  <div class="w-72 bg-system-background-window">
    <div v-if="component">
      <div
        v-for="(control, index) in controls"
        :key="index"
      >
        <component
          :is="control"
          :component="component"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Component } from '/@/layout';
import { useLayoutStore } from '/@/store/layout';
import { computed } from 'vue';
import ControlComponents from './Controls/Registry';

const store = useLayoutStore();
const component = computed(() => store.selectedComponent);

const controls = computed(() => {
  let controlComponent = Object.getPrototypeOf(component.value);
  let controlsComponents = [];
  do {
    let control = ControlComponents.registry.get(controlComponent.constructor);
    if (control) {
      controlsComponents.push(control);
    }
    controlComponent = Object.getPrototypeOf(controlComponent);
  } while (controlComponent instanceof Component);
  return controlsComponents.reverse();
});
</script>
