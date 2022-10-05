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
  <div flex relative>
    <input
      v-model="value"
      type="text"
      appearance-none
      text-xs
      border-none
      px-2
      h-5
      w-16
      bg-back
      p-0
      focus:outline-none
      focus:ring-0
      focus:border-none
      rounded-sm
    >
    <slot />
  </div>
</template>
