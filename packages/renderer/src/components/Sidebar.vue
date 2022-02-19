<template>
  <div class="bg-gray-200 w-72 macos:bg-transparent">
    <layouts />

    <tree-control
      v-if="component"
      :component="component"
    />
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '/@/store/layout';
import { computed } from 'vue';
import TreeControl from './Sidebar/TreeControl.vue';
import Layouts from './Sidebar/Layouts.vue';

const store = useLayoutStore();
const component = computed(() => store.rootComponent);
</script>
