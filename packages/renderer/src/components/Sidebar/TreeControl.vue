<template>
  <Disclosure
    v-slot="{ open }"
    :default-open="true"
  >
    <context-menu-providing>
      <div
        class="flex macos:mx-2 macos:rounded"
        :class="{'bg-system-background-selected-content': isSelected, 'text-white': isSelected}"
        :style="`padding-left: calc(0.75rem * ${indentationLevel})`"
        @click.prevent="selectComponent"
      >
        <DisclosureButton v-if="isContainerComponent">
          <ChevronRightIcon
            class="w-4 h-4"
            :class="open ? &quot;transform rotate-90&quot; : &quot;&quot;"
          />
        </DisclosureButton>
        <div
          v-else
          class="w-4 h-4"
        />

        <span v-text="component.name" />
      </div>

      <template #menu>
        <context-menu>
          <Submenu
            v-if="containerActions.length > 0"
            label="Add Component..."
          >
            <menu-item
              v-for="action in containerActions"
              :key="action.title"
              @click="action.action()"
            >
              {{ action.title }}
            </menu-item>
          </Submenu>
          <menu-separator v-if="isContainerComponent" />
          <Submenu label="Embed In...">
            <menu-item
              v-for="action in embedActions"
              :key="action.title"
              @click="action.action()"
            >
              {{ action.title }}
            </menu-item>
          </Submenu>
          <menu-separator />
          <menu-item @click="deleteComponent()">
            Delete
          </menu-item>
        </context-menu>
      </template>
    </context-menu-providing>
    <DisclosurePanel v-if="isContainerComponent">
      <TreeControl
        v-for="child in component.children"
        :key="child.id"
        :component="child"
        :indentation-level="indentationLevel + 1"
      />
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts">
import type { PropType} from 'vue';
import { computed, defineComponent, toRefs } from 'vue';
import type { Component} from '/@/layout';
import { FlexComponent, SourceComponent, ContainerComponent, containerComponents as ContainerComponents, components as LayoutComponents } from '/@/layout';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue';
import { ChevronRightIcon } from '@heroicons/vue/solid';
import { useStore } from '/@/store/app';
import { ADD_CHILD, SELECT_COMPONENT, EMBED_IN_COMPONENT, DELETE_COMPONENT } from '/@/store/mutation-types';
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
      required: true,
    },
    indentationLevel: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();
    const { component } = toRefs(props);
    const selectComponent = () => {
      store.commit(SELECT_COMPONENT, component.value);
    };
    const isSelected = computed(() => {
      return store.state.selectedComponent?.id == component.value.id;
    });
    const isContainerComponent = computed(() => component.value instanceof ContainerComponent);
    const addFlexComponent = () => {
      store.commit(ADD_CHILD, { parentId: component.value.id, component: new FlexComponent()});
    };
    const addSourceComponent = () => {
      store.commit(ADD_CHILD, { parentId: component.value.id, component: new SourceComponent()});
    };
    const containerActions = computed((): ContainerAction[] => {
      if (!isContainerComponent.value) {
        return [];
      }
      if (!(component.value instanceof ContainerComponent)) {
        return [];
      }
      let actions: ContainerAction[] = [];
      for (const property in LayoutComponents) {
        if (!component.value.canAddChild(LayoutComponents[property])) {
          continue;
        }
        actions.push({
          title: LayoutComponents[property].displayName,
          action: () => { store.commit(ADD_CHILD, { parentId: component.value.id, component: new LayoutComponents[property]()}); },
        });
      }
      return actions;
    });
    const embedActions = computed((): ContainerAction[] => {
      let actions: ContainerAction[] = [];
      for (const property in ContainerComponents) {
        actions.push({
          title: LayoutComponents[property].displayName,
          action: () => {
            store.commit(EMBED_IN_COMPONENT, { id: component.value.id, container: new LayoutComponents[property]() });
          },
        });
      }
      return actions;
    });
    const deleteComponent = () => {
      store.commit(DELETE_COMPONENT, { id: component.value.id });
    };
    return {
      selectComponent,
      isSelected,
      isContainerComponent,
      containerActions,
      embedActions,
      addFlexComponent,
      addSourceComponent,
      deleteComponent,
    };
  },
});
</script>
