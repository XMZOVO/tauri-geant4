<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    min: string
    max: string
    step: string
  }>(),
  {
    modelValue: '10000',
    disabled: false,
    min: '0',
    max: '10000',
    step: '1',
  },
)
const emits = defineEmits(['update:modelValue'])
const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <input v-model="value" cursor-ew-resize :step="step" :min="min" :max="max" type="range" appearance-none bg="card-item" rounded-full h-3 w-full>
</template>

