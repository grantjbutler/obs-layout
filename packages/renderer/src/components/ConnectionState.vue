<template>
  <div
    :class="`${backgroundColor} ${sizeClasses} rounded-full`"
    :title="title"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useObsStore } from '/@/store/obs';
import { OBSConnectionState } from '../../../shared/src/obs';

const props = defineProps<{
  size: 'small' | 'medium'
}>();

const store = useObsStore();

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-2 h-2';
    case 'medium':
      return 'w-4 h-4';
    default:
      return '';
  }
});

// eslint-disable-next-line vue/return-in-computed-property
const backgroundColor = computed(() => {
  switch (store.connectionState) {
    case OBSConnectionState.Connecting:
      return 'bg-yellow-500';
    case OBSConnectionState.Connected:
      return 'bg-green-500';
    case OBSConnectionState.Disconnected:
    case OBSConnectionState.Error:
      return 'bg-red-500';
  }
});
// eslint-disable-next-line vue/return-in-computed-property
const title = computed(() => {
  switch (store.connectionState) {
    case OBSConnectionState.Disconnected:
      return 'Disconnected';
    case OBSConnectionState.Connecting:
      return 'Connecting';
    case OBSConnectionState.Connected:
      return 'Connected';
    case OBSConnectionState.Error:
      return 'Error';
  }
});
</script>
