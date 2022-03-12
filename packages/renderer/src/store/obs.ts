import { defineStore } from 'pinia';
import type { Source } from '../../../shared/src/obs';
import { OBSConnectionState } from '../../../shared/src/obs';
import type { Size } from '../../../shared/src/layout';
import { useLayoutStore } from './layout';

interface State {
  connectionState: OBSConnectionState,
  sources: Source[],
  scenes: string[],
  canvasSize: Size
}

export const useObsStore = defineStore('obs', {
  state: (): State => {
    return {
      connectionState: OBSConnectionState.Disconnected,
      sources: [],
      scenes: [],
      canvasSize: {
        width: 1920,
        height: 1080,
      },
    };
  },
  actions: {
    setConnectionState(connectionState: OBSConnectionState) {
      this.connectionState = connectionState;
    },
    setSources(sources: Source[]) {
      this.sources = sources;
    },
    setScenes(scenes: string[]) {
      this.scenes = scenes;
    },
    setCanvasSize(size: Size) {
      this.canvasSize = size;

      const layoutStore = useLayoutStore();
      layoutStore.exerciseLayout();
    },
  },
});
