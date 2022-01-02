import { InjectionKey } from '@vue/runtime-core'
import { createStore, Store } from 'vuex'
import { OBSConnectionOptions } from '@/obs/connection';

export interface State {
  connection: OBSConnectionOptions | undefined
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
