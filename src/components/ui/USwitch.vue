<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import gsap from 'gsap'
import { onMounted } from 'vue'

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
const indicatorTl = gsap.timeline({ paused: true })
const value = useVModel(props, 'modelValue', emits)

onMounted(() => {
  indicatorTl.to('.indicator', {
    duration: 0.15,
    right: '0.25rem',
    width: '1.5rem',
    backgroundColor: '#06AD86',
  }).to('.indicator', {
    duration: 0.15,
    width: '1rem',
  })
  if (value.value === '1')
    indicatorTl.play()
})
const toggleSwitch = () => {
  if (value.value === '1') {
    value.value = '0'
    indicatorTl.reverse()
  }
  else {
    value.value = '1'
    indicatorTl.play()
  }
}
</script>

<template>
  <div w-10 h-6 rounded-full bg-input flex items-center cursor-pointer px-1 relative @click="toggleSwitch">
    <div class="indicator" w-4 h-4 rounded-full bg-red absolute />
  </div>
</template>
