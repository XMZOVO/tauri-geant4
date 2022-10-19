<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    disabled?: boolean
  }>(),
  {
    modelValue: 1,
    disabled: false,
  },
)

const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <input
    v-model.number="value"
    type="range"
    min="0.0"
    max="1.0"
    step="0.01"
    w-16
    h-1
    rounded="md"
    bg-back
  >
</template>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 13px;
  width: 13px;
  border-radius: 40%;
  background: #E5E5E5;
  cursor: ew-resize;
  box-shadow: 0 0 2px 0 #555;
  transition: background .3s ease-in-out;
}

input[type=range]::-webkit-slider-runnable-track  {
  -webkit-appearance: none;
  appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}
</style>
