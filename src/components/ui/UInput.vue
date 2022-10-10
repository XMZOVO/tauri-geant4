<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '0',
    disabled: false,
  },
)

const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <input
    v-model="value"
    type="text"
    appearance-none
    border-none
    px-2
    bg-back
    p-0
    focus:outline-none
    focus:ring-0
    focus:border-none
  >
</template>
