<template>
  <tr
    class="h-6"
  >
    <td class="w-4/5 px-1">
      {{ name }}
    </td>
    <td class="w-1/5 px-1">
      <input
        class="w-full p-0 text-right bg-transparent border-0"
        type="number"
        :value="modelValue"
        @input="setWeight"
      >
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  name: string,
  modelValue: number
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

const setWeight = (event: Event) => {
  let weight = parseInt((event.target as HTMLInputElement).value, 10);
  if (isNaN(weight)) { weight = 1; }
  emits('update:modelValue', weight);
};
</script>
