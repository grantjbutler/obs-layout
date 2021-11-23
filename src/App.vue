<template>
  <div class="flex flex-row h-screen">
    <sidebar class="flex-none" :component="rootComponent" :selectedComponent="selectedComponent" @selectComponent="selectComponent"></sidebar>
    <preview :component="rootComponent"></preview>
    <controls class="flex-none" :component="selectedComponent"></controls>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Preview from './components/Preview.vue';
import Sidebar from './components/Sidebar.vue';
import Controls from './components/Controls.vue';
import RootComponent from './layout/RootComponent';
import Component from './layout/Component';

export default defineComponent({
  name: 'App',
  components: {
    Preview,
    Sidebar,
    Controls,
  },
  setup() {
    const rootComponent = ref(new RootComponent())
    const selectedComponent = ref<Component | null>(null)
    const selectComponent = (component: Component | null) => {
      selectedComponent.value = component
    }

    return {
      rootComponent,
      selectedComponent,
      selectComponent
    }
  }
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
