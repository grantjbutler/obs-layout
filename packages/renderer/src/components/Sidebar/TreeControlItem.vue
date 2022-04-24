<template>
  <Disclosure
    v-slot="{ open }"
    :default-open="true"
  >
    <context-menu-providing>
      <div
        v-click-away="exitEditing"
        class="relative flex macos:mx-2 macos:rounded macos:py-1"
        :class="{'bg-system-background-selected-content': isSelected, 'text-white': isSelected}"
        :style="`padding-left: calc(0.25rem + 0.75rem * ${indentationLevel})`"
        @click.prevent="selectComponent"
        @click.self="exitEditing"
        @dblclick.prevent="enterEditing"
        @dragenter="dragEntered"
        @dragleave="dragLeft"
        @dragover="dragOver"
        @drop="drop"
      >
        <div
          v-if="isDragTarget"
          class="absolute right-0 h-[2px] bg-blue-600 before:block before:absolute before:border-2 before:border-blue-600 before:w-2 before:h-2 before:rounded before:-ml-2 before:-mt-1 before:top-px"
          :style="`left: calc(0.75rem * ${dropIndicatorIndentationLevel} + 1rem)`"
          :class="{'bottom-[-1px]': !dropOnTopEdge, 'top-[-1px]': dropOnTopEdge}"
        />
        <DisclosureButton v-if="isContainerComponent">
          <ChevronRightIcon
            class="w-4 h-4"
            :class="open ? 'transform rotate-90' : ''"
          />
        </DisclosureButton>
        <div
          v-else
          class="w-4 h-4"
        />

        <input
          v-if="isEditing"
          v-model.lazy="name"
          v-focus
          type="text"
          class="p-0 text-sm border-0 bg-system-background-under-page"
          @keydown.esc="exitEditing"
        >
        <span
          v-else
          draggable="true"
          @dragstart="startDragging"
          v-text="component.name"
        />
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
          <menu-item
            :enabled="canBeDeleted"
            @click="deleteComponent()"
          >
            Delete
          </menu-item>
        </context-menu>
      </template>
    </context-menu-providing>
    <DisclosurePanel v-if="childComponents.length > 0">
      <TreeControlItem
        v-for="child in childComponents"
        :key="child.id"
        :component="child"
        :indentation-level="indentationLevel + 1"
      />
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, inject, watch } from 'vue';
import type { Component} from '/@/layout';
import { ContainerComponent, containerComponents as ContainerComponents, components as LayoutComponents } from '/@/layout';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue';
import { ChevronRightIcon } from '@heroicons/vue/solid';
import { useLayoutStore } from '/@/store/layout';
import { draggedComponentKey } from './TreeControlKeys';

interface ContainerAction {
  title: string
  action: () => void
}

const props = defineProps({
  component: {
    type: Object as PropType<Component>,
    required: true,
  },
  indentationLevel: {
    type: Number,
    default: 0,
  },
});

const store = useLayoutStore();
const isSelected = computed(() => {
  return store.selectedComponent?.id == props.component.id;
});
const isContainerComponent = computed(() => props.component instanceof ContainerComponent);
const childComponents = computed(() => {
  if (props.component instanceof ContainerComponent) {
    return props.component.children;
  } else {
    return [];
  }
});

const selectComponent = () => {
  store.selectComponent(props.component);
};

const containerActions = computed((): ContainerAction[] => {
  if (!isContainerComponent.value) {
    return [];
  }
  if (!(props.component instanceof ContainerComponent)) {
    return [];
  }
  let actions: ContainerAction[] = [];
  for (const property in LayoutComponents) {
    if (!props.component.canAddChild(LayoutComponents[property])) {
      continue;
    }
    actions.push({
      title: LayoutComponents[property].displayName,
      action: () => { store.addChild(new LayoutComponents[property](), props.component.id); },
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
        store.embedInComponent(props.component.id, new LayoutComponents[property]() as ContainerComponent);
      },
    });
  }
  return actions;
});

const canBeDeleted = computed((): boolean => {
  return props.component.id != store.rootComponent.id;
});

const deleteComponent = () => {
  store.deleteComponent(props.component.id);
};

// --

const isEditing = ref(false);

const enterEditing = () => {
  if (!isSelected.value) { return; }
  isEditing.value = true;
};

const exitEditing = () => {
  isEditing.value = false;
};

watch(isSelected, (value) => {
  if (!value) {
    exitEditing();
  }
});

const name = computed({
  get: () => props.component.name,
  set: (value) => store.renameComponent(props.component, value),
});

// --

const isDragTarget = ref(false);
const dropOnTopEdge = ref(true);
const draggedComponent = inject(draggedComponentKey)!;
const dropIndicatorIndentationLevel = computed(() => {
  let level = props.indentationLevel;

  if (isContainerComponent.value) {
    level += dropOnTopEdge.value ? 0 : 1;
  }

  return level;
});

const startDragging = (event: DragEvent) => {
  draggedComponent.value = props.component;

  event.dataTransfer!.effectAllowed = 'move';
};

const dragEntered = () => {
  const component = draggedComponent.value;
  if (!component) { return; }

  if (component.id == props.component.id) {
    isDragTarget.value = false;
    return;
  }

  let parent = props.component.parent;
  while (parent) {
    if (parent.id == component.id) {
      // The component we're dragging has the component in this tree control as a descendent. Thus, we cannot drag that component into this component.
      isDragTarget.value = false;
      return;
    }

    parent = parent.parent;
  }

  if (isContainerComponent.value) {
    isDragTarget.value = (props.component as ContainerComponent).canAddChild(Object.getPrototypeOf(component));
  } else {
    isDragTarget.value = props.component.parent!.canAddChild(Object.getPrototypeOf(component));
  }
};

const dragLeft = () => {
  isDragTarget.value = false;
};

const dragOver = (event: DragEvent) => {
  event.preventDefault();

  if (!isDragTarget.value) { return; }
  const component = draggedComponent.value;
  if (!component) { return; }

  event.dataTransfer!.dropEffect = 'move';

  const isRootComponent = props.component.id == store.rootComponent.id;

  if (isRootComponent) {
    dropOnTopEdge.value = false;
  } else {
    const height = parseInt(window.getComputedStyle(event.target as Element).height, 10);
    const isTargettingTopEdge = event.offsetY < height / 2.0;

    if (isTargettingTopEdge) {
      dropOnTopEdge.value = props.component.parent!.canAddChild(Object.getPrototypeOf(component));
    } else {
      dropOnTopEdge.value = false;
    }
  }
};

const drop = (event: DragEvent) => {
  event.preventDefault();

  if (!isDragTarget.value) { return; }

  const component = draggedComponent.value;
  if (!component) { return; }

  if (isContainerComponent.value) {
    if (dropOnTopEdge.value) {
      store.addChild(component, props.component.parent!.id);
      store.moveBefore(component, props.component);
    } else {
      store.insertChildAtBeginning(component, props.component.id);
    }
  } else {
    store.addChild(component, props.component.parent!.id);

    if (dropOnTopEdge.value) {
      store.moveBefore(component, props.component);
    } else {
      store.moveAfter(component, props.component);
    }
  }

  isDragTarget.value = false;
};
</script>

