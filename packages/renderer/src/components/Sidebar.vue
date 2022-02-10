<template>
  <div class="bg-gray-200 w-72 macos:bg-transparent">
    <tree-control
      v-if="component"
      :component="component"
    />
  </div>
</template>

<script lang="ts">
import { useStore } from '/@/store/app';
import { computed, defineComponent } from 'vue';
import TreeControl from './Sidebar/TreeControl.vue';
export default defineComponent({
  name: 'Sidebar',
  components: {
    TreeControl,
  },
  setup() {
    const store = useStore();
    return {
      component: computed(() => store.state.rootComponent),
    };
  },
});
</script>
