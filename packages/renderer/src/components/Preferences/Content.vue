<template>
  <div class="text-sm macos:bg-system-background-under-page macos:text-system-text macos:p-2">
    <div class="flex flex-col macos:gap-2 windows:gap-8 windows:w-1/2">
      <Controls label="OBS Connection">
        <Control
          v-model="connection.host"
          label="Host"
          type="text"
        />
        <Control
          v-model="connection.port"
          label="Port"
          type="text"
        />
        <Control
          v-model="connection.password"
          label="Password"
          type="password"
        />

        <div class="flex justify-end macos:col-start-2 macos:col-end-9 windows:w-2/3">
          <button
            v-if="isConnectButtonVisible"
            class="px-3 py-1 bg-green-500 rounded"
            @click="connect"
          >
            Connect
          </button>
          <button
            v-if="isAbortButtonVisible"
            class="px-3 py-1 bg-yellow-500 rounded"
          >
            Abort
          </button>
          <button
            v-if="isDisconnectButtonVisible"
            class="px-3 py-1 bg-red-500 rounded"
            @click="disconnect"
          >
            Disconnect
          </button>
        </div>
      </Controls>

      <Controls label="Filters">
        <div
          v-if="isWindows"
          class="mb-2"
        >
          Filters allow you to limit which scenes and sources show up.
        </div>
        <Control
          v-model="sourceFilter"
          label="Source Filter"
          type="text"
        />
        <Control
          v-model="sceneFilter"
          label="Scene Filter"
          type="text"
        />
      </Controls>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import debounce from 'lodash/debounce';
import type { OBSConnectionOptions} from '../../../../shared/src/obs';
import { OBSConnectionState, isOBSConnectionOptions } from '../../../../shared/src/obs';
import { useObsConnectionState } from '/@/integration/obs';
import Controls from '/@/components/Preferences/Controls.vue';
import Control from '/@/components/Preferences/Control.vue';
import { useIsWindows } from '/@/integration/platform';

const isWindows = useIsWindows();
const connectionState = useObsConnectionState();
const connection = ref<OBSConnectionOptions>({
  host: 'localhost',
  port: 4444,
  password: undefined,
});

const sourceFilter = ref('');
const sceneFilter = ref('');
const isConnectButtonVisible = computed(() => connectionState.value == OBSConnectionState.Disconnected || connectionState.value == OBSConnectionState.Error);
const isAbortButtonVisible = computed(() => connectionState.value == OBSConnectionState.Connecting);
const isDisconnectButtonVisible = computed(() => connectionState.value == OBSConnectionState.Connected);

const connect = () => {
  if (isOBSConnectionOptions(connection.value)) {
    window.obs.connect(connection.value);
  }
};
const disconnect = () => {
  window.obs.disconnect();
};

onMounted(() => {
  window.preferences.loadConnectionOptions()
    .then(newValue => {
      if (newValue) {
        connection.value = newValue;
      }
    });

  window.preferences.loadSourceFilter()
    .then(filter => {
      sourceFilter.value = filter;
    });

  window.preferences.loadSceneFilter()
    .then(filter => {
      sceneFilter.value = filter;
    });
});

watch(sourceFilter, debounce((newFilter: string) => {
  window.preferences.setSourceFilter(newFilter);
}));
watch(sceneFilter, debounce((newFilter: string) => {
  window.preferences.setSceneFilter(newFilter);
}));
</script>
