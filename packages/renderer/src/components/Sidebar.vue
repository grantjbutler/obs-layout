<template>
  <div class="bg-gray-200 w-72 macos:bg-transparent">
    <tree-control
      v-if="component"
      :component="component"
    />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '/@/store/app';
import { computed } from 'vue';
import TreeControl from './Sidebar/TreeControl.vue';

const store = useStore();
const component = computed(() => store.state.rootComponent);
</script>
