<template>
  <div class="bg-gray-200 w-72 macos:bg-transparent">
    <layouts-list v-if="isMacOS" />

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
import LayoutsList from './Sidebar/LayoutsList.vue';
import { useIsMacOS } from '/@/integration/platform';

const store = useLayoutStore();
const component = computed(() => store.rootComponent);
const isMacOS = useIsMacOS();
</script>
