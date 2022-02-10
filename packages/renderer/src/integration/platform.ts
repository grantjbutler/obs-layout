import type { ComputedRef } from 'vue';
import { computed } from 'vue';

export function usePlatform(): ComputedRef<NodeJS.Platform> {
  return computed(() => window.platform);
}

export function useIsMacOS(): ComputedRef<boolean> {
  return computed(() => window.platform == 'darwin');
}

export function useIsWindows(): ComputedRef<boolean> {
  return computed(() => window.platform == 'win32');
}
