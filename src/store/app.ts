import { obsWebSocketPlugin } from '@/integration/obs'
import { Component, FlexComponent, SourceComponent, LayoutExerciser, LayoutNode, Size } from '@/layout'
import ContainerComponent from '@/layout/ContainerComponent'
import InsetComponent from '@/layout/InsetComponent'
import Insets from '@/layout/Insets'
import { OBSConnectionState } from '@/obs/connection-state'
import { Source } from '@/obs/source';
import { InjectionKey } from '@vue/runtime-core'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

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
  layoutExercisingMutations,
  SET_OBS_CONNECTION_STATE,
  SET_OBS_SOURCES,
  SET_OBS_SCENES
} from './mutation-types'

export interface State {
  rootComponent: ContainerComponent
  rootNode: LayoutNode | null
  selectedComponent: Component | null,
  connectionState: OBSConnectionState,
  sources: Source[],
  scenes: string[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    rootComponent: new FlexComponent(),
    rootNode: null,
    selectedComponent: null,
    connectionState: OBSConnectionState.Disconnected,
    sources: [],
    scenes: []
  },
  mutations: {
    [SELECT_COMPONENT](state: State, component: Component) {
      state.selectedComponent = component
    },
    [EXERCISE_LAYOUT](state: State) {
      state.rootNode = new LayoutExerciser().execute(state.rootComponent, new Size(1920, 1080))
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
    [SOURCE_SET_SOURCE](state: State, source: Source | undefined) {
      if (!state.selectedComponent || !(state.selectedComponent instanceof SourceComponent)) {
        return;
      }
      state.selectedComponent.source = source
    },
    [SET_OBS_CONNECTION_STATE](state: State, connectionState: OBSConnectionState) {
      state.connectionState = connectionState
    },
    [SET_OBS_SOURCES](state: State, sources: Source[]) {
      state.sources = sources;
    },
    [SET_OBS_SCENES](state: State, scenes: string[]) {
      state.scenes = scenes;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    obsWebSocketPlugin(),
    (store) => {
      store.commit(EXERCISE_LAYOUT)

      store.subscribe(mutation => {
        if (!layoutExercisingMutations.includes(mutation.type)) {
          return;
        }
        store.commit(EXERCISE_LAYOUT)
      })
    }
  ]
})

export function useStore(): Store<State> {
  return baseUseStore(key)
}
