<template>
  <div class="w-72 p-2 bg-gray-200 h-screen">
    <tree-control v-if="component" :component="component"></tree-control>
  </div>
</template>

<script lang="ts">
import { key } from '@/store';
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex';
import TreeControl from './Sidebar/TreeControl.vue';

export default defineComponent({
  name: 'Sidebar',
  components: {
    TreeControl
  },
  setup() {
    const store = useStore(key)
    
    return {
      component: computed(() => store.state.rootComponent)
    }
  }
})
</script>
