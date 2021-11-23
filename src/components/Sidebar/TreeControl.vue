<template>
  <Disclosure v-slot="{ open }">
    <context-menu-providing>
      <div class="flex justify-between" :class="isSelected ? 'bg-orange-200' : ''" @click.prevent="selectComponent">
        <div class="flex">
          <DisclosureButton v-if="component.children.length > 0">
            <ChevronRightIcon class="w-6 h-6" :class='open ? "transform rotate-90" : ""' />
          </DisclosureButton>
          <div v-else class="w-6 h-6"></div>

          <span v-text="component.name" :class="allowsSelection ? 'text-black' : 'text-gray-500'"></span>
        </div>
      </div>

      <template v-slot:menu>
        <Menu>
          <Submenu label="Add Component...">
            <menu-item @click="addFlexComponent()">Flex Component</menu-item>
            <menu-item @click="addSourceComponent()">Source Component</menu-item>
          </Submenu>
          <menu-separator/>
          <menu-item>Delete</menu-item>
        </Menu>
      </template>
    </context-menu-providing>
    <DisclosurePanel v-if="component.children.length > 0" class="pl-4">
      <TreeControl v-for="child in component.children" :key="child.id" :component="child" :selectedComponent="selectedComponent" @selectComponent="propogateSelection"></TreeControl>
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
  Menu,
  MenuItem,
  Submenu,
  MenuSeparator
} from '../Menu'

export default defineComponent({
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronRightIcon,
    ContextMenuProviding,
    Menu,
    MenuItem,
    Submenu,
    MenuSeparator,
  },
  props: {
    component: {
      type: Object as PropType<Component>,
      required: true
    },
    allowsSelection: {
      type: Boolean,
      default: true
    },
    selectedComponent: {
      type: Object as PropType<Component>
    }
  },
  emits: {
    selectComponent(payload: Component) {
      return true
    }
  },
  setup(props, context) {
    const { selectedComponent, component, allowsSelection } = toRefs(props);
    const selectComponent = () => {
      if (!allowsSelection.value) { return; }
      propogateSelection(component.value)
    }

    const propogateSelection = (component: Component) => {
      context.emit('selectComponent', component)
    }

    const isSelected = computed(() => {
      return selectedComponent.value?.id == component.value.id
    })

    const addFlexComponent = () => {
      component.value.children.push(new FlexComponent())
    }

    const addSourceComponent = () => {
      component.value.children.push(new SourceComponent())
    }

    return {
      selectComponent,
      isSelected,
      addFlexComponent,
      addSourceComponent,
      propogateSelection
    }
  }
})
</script>
