<template>
  <Disclosure v-slot="{ open }">
    <context-menu-providing>
      <div class="flex justify-between" :class="{'bg-green-200': isSelected}" @click.prevent="selectComponent">
        <div class="flex">
          <DisclosureButton v-if="component.children.length > 0">
            <ChevronRightIcon class="w-6 h-6" :class='open ? "transform rotate-90" : ""' />
          </DisclosureButton>
          <div v-else class="w-6 h-6"></div>

          <span v-text="component.name"></span>
        </div>
      </div>

      <template v-slot:menu>
        <context-menu>
          <Submenu label="Add Component...">
            <menu-item @click="addFlexComponent()">Flex Component</menu-item>
            <menu-item @click="addSourceComponent()">Source Component</menu-item>
          </Submenu>
          <menu-separator/>
          <menu-item>Delete</menu-item>
        </context-menu>
      </template>
    </context-menu-providing>
    <DisclosurePanel v-if="component.children.length > 0" class="pl-4">
      <TreeControl v-for="child in component.children" :key="child.id" :component="child"></TreeControl>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { Component, FlexComponent, SourceComponent } from '@/layout';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue';
import { ChevronRightIcon } from '@heroicons/vue/solid';
import {
  ContextMenuProviding,
  ContextMenu,
  MenuItem,
  Submenu,
  MenuSeparator
} from '../Menu'
import { useStore } from 'vuex';
import { key } from '@/store';
import { ADD_CHILD, SELECT_COMPONENT } from '@/store/mutation-types';

export default defineComponent({
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronRightIcon,
    ContextMenuProviding,
    ContextMenu,
    MenuItem,
    Submenu,
    MenuSeparator,
  },
  props: {
    component: {
      type: Object as PropType<Component>,
      required: true
    },
  },
  setup(props) {
    const store = useStore(key)
    const { component } = toRefs(props);

    const selectComponent = () => {
      store.commit(SELECT_COMPONENT, component.value)
    }

    const isSelected = computed(() => {
      return store.state.selectedComponent?.id == component.value.id
    })

    const addFlexComponent = () => {
      store.commit(ADD_CHILD, { parentId: component.value.id, component: new FlexComponent()})
    }

    const addSourceComponent = () => {
      store.commit(ADD_CHILD, { parentId: component.value.id, component: new SourceComponent()})
    }

    return {
      selectComponent,
      isSelected,
      addFlexComponent,
      addSourceComponent
    }
  }
})
</script>
