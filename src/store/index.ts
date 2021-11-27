import { Component, FlexComponent, SourceComponent, LayoutExerciser, LayoutNode, Size, containerComponents } from '@/layout'
import ContainerComponent from '@/layout/ContainerComponent'
import InsetComponent from '@/layout/InsetComponent'
import Insets from '@/layout/Insets'
import { InjectionKey } from '@vue/runtime-core'
import { createStore, Store } from 'vuex'

import { 
  SELECT_COMPONENT,
  ADD_CHILD,
  EMBED_IN_COMPONENT,
  EXERCISE_LAYOUT,
  FLEX_SET_DIRECTION,
  FLEX_SET_DISTRIBUTION,
  FLEX_SET_SPACING,
  INSET_SET_INSETS,
  SOURCE_SET_SOURCE,
  SET_PREVIEW_SIZE,
  layoutExercisingMutations
} from './mutation-types'

export interface State {
  rootComponent: ContainerComponent
  rootNode: LayoutNode | null
  previewSize: Size
  selectedComponent: Component | null
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    rootComponent: new FlexComponent(),
    rootNode: null,
    previewSize: new Size(0, 0),
    selectedComponent: null,
  },
  mutations: {
    [SELECT_COMPONENT](state: State, component: Component) {
      state.selectedComponent = component
    },
    [SET_PREVIEW_SIZE](state: State, newSize: Size) {
      state.previewSize = newSize
    },
    [EXERCISE_LAYOUT](state: State) {
      state.rootNode = new LayoutExerciser().execute(state.rootComponent, state.previewSize)
    },
    [ADD_CHILD](state: State, payload: { component: Component, parentId: string }) {
      const parent = state.rootComponent.childWithId(payload.parentId)
      if (!parent || !(parent instanceof ContainerComponent)) { return }
      parent.addChild(payload.component)
    },
    [EMBED_IN_COMPONENT](state: State, payload: { id: string, container: ContainerComponent }) {
      if (state.rootComponent.id == payload.id) {
        payload.container.addChild(state.rootComponent)
        state.rootComponent = payload.container
      } else {
        const child = state.rootComponent.childWithId(payload.id)
        if (!child) { return; }
        const parent = child.parent;
        if (!parent) { return; }

        child.removeFromParent()
        parent.addChild(payload.container)
        payload.container.addChild(child)
      }
    },
    [FLEX_SET_DIRECTION](state: State, direction: 'horizontal' | 'vertical') {
      if (!state.selectedComponent || !(state.selectedComponent instanceof FlexComponent)) {
        return;
      }
      state.selectedComponent.direction = direction
    },
    [FLEX_SET_DISTRIBUTION](state: State, distribution: 'leading' | 'center' | 'trailing') {
      if (!state.selectedComponent || !(state.selectedComponent instanceof FlexComponent)) {
        return;
      }
      state.selectedComponent.distribution = distribution
    },
    [FLEX_SET_SPACING](state: State, spacing: number) {
      if (!state.selectedComponent || !(state.selectedComponent instanceof FlexComponent)) {
        return;
      }
      state.selectedComponent.spacing = spacing
    },
    [INSET_SET_INSETS](state: State, insets: Insets) {
      if (!state.selectedComponent || !(state.selectedComponent instanceof InsetComponent)) {
        return;
      }
      state.selectedComponent.insets = insets
    },
    [SOURCE_SET_SOURCE](state: State, source: string | undefined) {
      if (!state.selectedComponent || !(state.selectedComponent instanceof SourceComponent)) {
        return;
      }
      state.selectedComponent.source = source
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    (store) => {
      store.subscribe(mutation => {
        if (!layoutExercisingMutations.includes(mutation.type)) {
          return;
        }
        store.commit(EXERCISE_LAYOUT)
      })
    }
  ]
})
