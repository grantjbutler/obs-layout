import { computed, ComputedRef } from 'vue'

export function usePlatform(): ComputedRef<NodeJS.Platform> {
  return computed(() => process.platform)
}

export function useIsMacOS(): ComputedRef<boolean> {
  return computed(() => process.platform == 'darwin')
}

export function useIsWindows(): ComputedRef<boolean> {
  return computed(() => process.platform == 'win32')
}

