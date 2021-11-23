<template>
  <div class="w-72 p-2 bg-gray-200">
    <tree-control :component="component" :allowsSelection="false" @selectComponent="propogateSelection"></tree-control>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Component from '@/layout/Component';
import TreeControl from './Sidebar/TreeControl.vue';

export default defineComponent({
  components: { TreeControl },
  props: {
    component: {
      type: Object as PropType<Component>,
      required: true
    }
  },
  emit: {
    selectComponent(payload: Component) {
      return true
    }
  },
  setup(_, context) {
    const propogateSelection = (component: Component) => {
      context.emit('selectComponent', component)
    }

    return {
      propogateSelection
    }
  }
})
</script>
