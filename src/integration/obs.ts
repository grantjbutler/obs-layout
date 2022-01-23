import { OBSConnectionState } from "@/obs/connection-state"
import { State } from "@/store/app"
import { SET_OBS_CONNECTION_STATE } from "@/store/mutation-types"
import { ipcRenderer } from "electron"
import { Ref, ref } from "vue"
import { Store } from "vuex"

export function useObsConnectionState(): Ref<OBSConnectionState> {
  const state = ref(OBSConnectionState.Disconnected);

  ipcRenderer.invoke('get-obs-connection-status')
    .then((newState: OBSConnectionState) => {
      state.value = newState
    })

  ipcRenderer.on('obs-connection-state', (_, newState: OBSConnectionState) => state.value = newState)

  return state
}

export function obsWebSocketPlugin() {
  return (store: Store<State>): void => {
    const setObsConnectionState = (state: OBSConnectionState) => store.commit(SET_OBS_CONNECTION_STATE, state)

    ipcRenderer.invoke('get-obs-connection-status')
      .then((state: OBSConnectionState) => {
        setObsConnectionState(state)
      })

    ipcRenderer.on('obs-connection-state', (_, state: OBSConnectionState) => setObsConnectionState(state))
  }
}