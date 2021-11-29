import { InjectionKey } from '@vue/runtime-core'
import { createStore, Store } from 'vuex'
import { OBSConnection } from '@/obs/connection';

export interface State {
  connection: OBSConnection | undefined
}
  
export const key: InjectionKey<Store<State>> = Symbol()
  
export const store = createStore<State>({
  state: {
    connection: undefined
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
})
