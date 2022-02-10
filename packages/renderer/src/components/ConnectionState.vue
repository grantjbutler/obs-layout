<template>
  <div
    :class="`${backgroundColor} ${sizeClasses} rounded-full`"
    :title="title"
  />
</template>

<script lang="ts" setup>
import type { PropType} from 'vue';
import { computed } from 'vue';
import { useStore } from '/@/store/app';
import { OBSConnectionState } from '../../../shared/src/obs';

enum Size {
  Small = 'small',
  Medium = 'medium'
}

const props = defineProps({
  size: {
    type: String as PropType<Size>,
    required: true
  }
});



const store = useStore();

const sizeClasses = computed(() => {
  switch (props.size) {
    case Size.Small:
      return 'w-2 h-2';
    case Size.Medium:
      return 'w-4 h-4';
    default:
      return '';
  }
});

// eslint-disable-next-line vue/return-in-computed-property
const backgroundColor = computed(() => {
  switch (store.state.connectionState) {
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
  switch (store.state.connectionState) {
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
