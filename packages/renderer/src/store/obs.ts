import { defineStore } from 'pinia';
import type { Source } from '../../../shared/src/obs';
import { OBSConnectionState } from '../../../shared/src/obs';

interface State {
  connectionState: OBSConnectionState,
  sources: Source[],
  scenes: string[]
}

export const useObsStore = defineStore('obs', {
  state: (): State => {
    return {
      connectionState: OBSConnectionState.Disconnected,
      sources: [],
      scenes: [],
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
  },
});
