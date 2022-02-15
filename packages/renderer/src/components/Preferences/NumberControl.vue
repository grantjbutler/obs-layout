<template>
  <label class="macos:col-span-2 macos:col-start-2 macos:text-right">{{ label }}</label>
  <input
    class="macos:col-span-5 macos:col-end-9 macos:px-2 macos:py-1 macos:rounded macos:text-system-text-control macos:bg-system-background-control windows:mb-2 windows:w-2/3 windows:text-sm windows:border-gray-300"
    :value="modelValue"
    v-bind="$attrs"
    type="number"
    @input="modelValueUpdated"
  >
</template>

<script lang="ts" setup>
defineProps<{
  label: string,
  modelValue?: number
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value?: number): void
}>();

function modelValueUpdated(event: Event) {
  emits('update:modelValue', parseInt((event.target as HTMLInputElement).value, 10));
}
</script>
