<template>
  <Disclosure v-slot="{ open }" :defaultOpen="true">
    <context-menu-providing>
      <div class="flex justify-between" :class="{'bg-green-200': isSelected}" @click.prevent="selectComponent">
        <div class="flex">
          <DisclosureButton v-if="isContainerComponent && component.children.length > 0">
            <ChevronRightIcon class="w-6 h-6" :class='open ? "transform rotate-90" : ""' />
          </DisclosureButton>
          <div v-else class="w-6 h-6"></div>

          <span v-text="component.name"></span>
        </div>
      </div>

      <template v-slot:menu>
        <context-menu>
          <Submenu label="Add Component..." v-if="containerActions.length > 0">
            <menu-item v-for="action in containerActions" :key="action.title" @click="action.action()">{{ action.title }}</menu-item>
          </Submenu>
          <menu-separator v-if="isContainerComponent" />
          <Submenu label="Embed In...">
            <menu-item v-for="action in embedActions" :key="action.title" @click="action.action()">{{ action.title }}</menu-item>
          </Submenu>
          <menu-separator/>
          <menu-item>Delete</menu-item>
        </context-menu>
      </template>
    </context-menu-providing>
    <DisclosurePanel v-if="isContainerComponent && component.children.length > 0" class="pl-4">
      <TreeControl v-for="child in component.children" :key="child.id" :component="child"></TreeControl>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue'
import { Component, FlexComponent, SourceComponent, ContainerComponent, containerComponents as ContainerComponents, components as LayoutComponents } from '@/layout';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue';
import { ChevronRightIcon } from '@heroicons/vue/solid';
import { useStore } from 'vuex';
import { key } from '@/store';
import { ADD_CHILD, SELECT_COMPONENT, EMBED_IN_COMPONENT } from '@/store/mutation-types';

interface ContainerAction {
  title: string
  action: () => void
}

export default defineComponent({
  name: 'TreeControl',
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronRightIcon,
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

    const isContainerComponent = computed(() => component.value instanceof ContainerComponent)

    const addFlexComponent = () => {
      store.commit(ADD_CHILD, { parentId: component.value.id, component: new FlexComponent()})
    }

    const addSourceComponent = () => {
      store.commit(ADD_CHILD, { parentId: component.value.id, component: new SourceComponent()})
    }

    const containerActions = computed((): ContainerAction[] => {
      if (!isContainerComponent.value) {
        return []
      }

      if (!(component.value instanceof ContainerComponent)) {
        return [];
      }

      let actions: ContainerAction[] = []
      for (const property in LayoutComponents) {
        if (!component.value.canAddChild(LayoutComponents[property])) {
          continue;
        }

        actions.push({
          title: LayoutComponents[property].displayName,
          action: () => { store.commit(ADD_CHILD, { parentId: component.value.id, component: new LayoutComponents[property]()}) }
        })
      }

      return actions;
    })

    const embedActions = computed((): ContainerAction[] => {
      let actions: ContainerAction[] = []
      for (const property in ContainerComponents) {
        actions.push({
          title: LayoutComponents[property].displayName,
          action: () => {
            store.commit(EMBED_IN_COMPONENT, { id: component.value.id, container: new LayoutComponents[property]() })
          }
        })
      }
      return actions
    })

    return {
      selectComponent,
      isSelected,
      isContainerComponent,
      containerActions,
      embedActions,
      addFlexComponent,
      addSourceComponent
    }
  }
})
</script>
