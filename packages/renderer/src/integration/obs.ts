import type { LayoutNode } from '/@/layout';
import { ContainerLayoutNode, Frame, SourceLayoutNode } from '/@/layout';
import { OBSConnectionState } from '../../../shared/src/obs';
import type { Ref} from 'vue';
import { ref } from 'vue';
import { useObsStore } from '/@/store/obs';

export function useObsConnectionState(): Ref<OBSConnectionState> {
  const state = ref(OBSConnectionState.Disconnected);

  window.obs.getConnectionStatus()
    .then((newState: OBSConnectionState) => {
      state.value = newState;
    });

  window.obs.onConnectionStateChanged((newState) => state.value = newState);

  return state;
}

export function useObs() {
  const obsStore = useObsStore();

  window.obs.getConnectionStatus()
    .then(obsStore.setConnectionState);

  window.obs.getSources()
    .then(obsStore.setSources);

  window.obs.getScenes()
    .then(obsStore.setScenes);

  window.obs.onConnectionStateChanged(obsStore.setConnectionState);
  window.obs.onSourcesChanged(obsStore.setSources);
  window.obs.onScenesChanged(obsStore.setScenes);
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
