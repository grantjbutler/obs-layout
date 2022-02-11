import type { OBSConnectionOptions, OBSConnectionState, Source } from '../shared/src/obs';
import type { MenuItemDefinition } from '../shared/src/menu';
import type { Node } from './src/obs';

export declare global {
  interface Window {
    readonly versions: NodeJS.ProcessVersions;
    readonly platform: NodeJS.Platform;
    readonly contextMenu: {
      show: (menu: MenuItemDefinition[]) => void;
      onClick: (id: string, handler: () => void) => void;
    };
    readonly obs: {
      connect: (options: OBSConnectionOptions) => void;
      disconnect: () => void;
      getConnectionStatus(): Promise<OBSConnectionState>;
      getSources(): Promise<Source[]>;
      getScenes(): Promise<string[]>;
      sync(nodes: Node[], sceneName: string)

      onConnectionStateChanged: (handler: (value: OBSConnectionState) => void) => void;
      onSourcesChanged: (handler: (value: Source[]) => void) => void;
      onScenesChanged: (handler: (value: string[]) => void) => void;
    };
    readonly preferences: {
      loadConnectionOptions: () => Promise<OBSConnectionOptions | null>;
      loadSourceFilter: () => Promise<string>;
      loadSceneFilter: () => Promise<string>;
      setSourceFilter: (filter: string) => void;
      setSceneFilter: (filter: string) => void;
    };
  }
}
