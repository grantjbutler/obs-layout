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

<script lang="ts">
import { Component } from '/@/layout';
import { useStore } from '/@/store/app';
import { computed, defineComponent } from 'vue';
import ControlComponents from './Controls/Registry';
export default defineComponent({
  name: 'Controls',
  components: {
    ...ControlComponents.components,
  },
  setup() {
    const store = useStore();
    const component = computed(() => store.state.selectedComponent);
    const controls = computed(() => {
      let controlComponent = Object.getPrototypeOf(component.value);
      let controlsComponents = [];
      do {
        let control: any = ControlComponents.registry.get(controlComponent.constructor);
        if (control) {
          controlsComponents.push(control);
        }
        controlComponent = Object.getPrototypeOf(controlComponent);
      } while (controlComponent instanceof Component);
      return controlsComponents.reverse();
    });
    return {
      controls,
      component,
    };
  },
});
</script>
