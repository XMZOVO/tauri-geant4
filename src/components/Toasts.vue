<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const props = withDefaults(defineProps<{
  message: string
  success: boolean
}>(), {
  message: '',
  success: true,
})
const toastTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const Toast = ref(null)

let isShowing = $ref(false)

const showToast = async () => {
  if (isShowing)
    return
  isShowing = true
  toastTl.to(Toast.value, { top: 20, duration: 0.2 }).to(Toast.value, {
    top: -70,
    duration: 0.2,
    delay: 0.8,
  })
  await toastTl.play()
  isShowing = false
}

defineExpose({
  showToast,
})
</script>

<template>
  <div ref="Toast" absolute top="-20" h-15 w-80 p-5 flex items-center bg-card-item gap-2 border="~ card-item" shadow-lg rounded-md>
    <div :class="success ? 'i-carbon-checkmark-filled text-green' : 'i-carbon-close-filled text-red'" />
    <div>{{ props.message }}</div>
  </div>
</template>
