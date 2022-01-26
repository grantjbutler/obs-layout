import { ContainerLayoutNode, Frame, LayoutNode, SourceLayoutNode } from "@/layout"
import { OBSConnectionState } from "@/obs/connection-state"
import { Source } from "@/obs/source"
import { State } from "@/store/app"
import { SET_OBS_CONNECTION_STATE, SET_OBS_SOURCES, SET_OBS_SCENES } from "@/store/mutation-types"
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
    const setObsConnectionState = (state: OBSConnectionState) => store.commit(SET_OBS_CONNECTION_STATE, state);
    const setSources = (sources: Source[]) => store.commit(SET_OBS_SOURCES, sources);
    const setScenes = (scenes: string[]) => store.commit(SET_OBS_SCENES, scenes);

    ipcRenderer.invoke('get-obs-connection-status')
      .then(setObsConnectionState)
    
    ipcRenderer.invoke('get-obs-sources')
      .then(setSources)
    
    ipcRenderer.invoke('get-obs-scenes')
      .then(setScenes);

    ipcRenderer.on('obs-connection-state', (_, state: OBSConnectionState) => setObsConnectionState(state))
    ipcRenderer.on('obs-sources', (_, sources: Source[]) => setSources(sources));
    ipcRenderer.on('obs-scenes', (_, scenes: string[]) => setScenes(scenes));
  }
}

export function syncLayout(rootNode: LayoutNode, sceneName: string): void {
  const origin = { x: rootNode.frame.x, y: rootNode.frame.y };
  const nodes = walkLayout(rootNode, origin);
  ipcRenderer.invoke('sync-layout-to-scene', nodes, sceneName);
}

function walkLayout(node: LayoutNode, origin: { x: number, y: number }): { sourceName: string, frame: Frame }[] {
  origin.x += node.frame.x
  origin.y += node.frame.y

  if (node instanceof ContainerLayoutNode) {
    return node.children.flatMap(child => {
      return walkLayout(child, { x: origin.x, y: origin.y });
    });
  } else if (node instanceof SourceLayoutNode) {
    return [{
      sourceName: node.source.name,
      frame: new Frame(
        origin.x,
        origin.y,
        node.frame.width / node.source.width,
        node.frame.height / node.source.height
      )
    }];
  } else {
    return [];
  }
}