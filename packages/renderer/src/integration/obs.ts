import type { LayoutNode } from '/@/layout';
import { ContainerLayoutNode, Frame, SourceLayoutNode } from '/@/layout';
import type { Source } from '../../../shared/src/obs';
import { OBSConnectionState } from '../../../shared/src/obs';
import type { State } from '/@/store/app';
import { SET_OBS_CONNECTION_STATE, SET_OBS_SOURCES, SET_OBS_SCENES } from '/@/store/mutation-types';
import type { Ref} from 'vue';
import { ref } from 'vue';
import type { Store } from 'vuex';

export function useObsConnectionState(): Ref<OBSConnectionState> {
  const state = ref(OBSConnectionState.Disconnected);

  window.obs.getConnectionStatus()
    .then((newState: OBSConnectionState) => {
      state.value = newState;
    });

  window.obs.onConnectionStateChanged((newState) => state.value = newState);

  return state;
}

export function obsWebSocketPlugin() {
  return (store: Store<State>): void => {
    const setObsConnectionState = (state: OBSConnectionState) => store.commit(SET_OBS_CONNECTION_STATE, state);
    const setSources = (sources: Source[]) => store.commit(SET_OBS_SOURCES, sources);
    const setScenes = (scenes: string[]) => store.commit(SET_OBS_SCENES, scenes);

    window.obs.getConnectionStatus()
      .then(setObsConnectionState);

    window.obs.getSources()
      .then(setSources);

    window.obs.getScenes()
      .then(setScenes);

    window.obs.onConnectionStateChanged(setObsConnectionState);
    window.obs.onSourcesChanged(setSources);
    window.obs.onScenesChanged(setScenes);
  };
}

export function syncLayout(rootNode: LayoutNode, sceneName: string): void {
  const origin = { x: rootNode.frame.x, y: rootNode.frame.y };
  const nodes = walkLayout(rootNode, origin);
  window.obs.sync(nodes, sceneName);
}

function walkLayout(node: LayoutNode, origin: { x: number, y: number }): { sourceName: string, frame: Frame }[] {
  origin.x += node.frame.x;
  origin.y += node.frame.y;

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
        node.frame.height / node.source.height,
      ),
    }];
  } else {
    return [];
  }
}
