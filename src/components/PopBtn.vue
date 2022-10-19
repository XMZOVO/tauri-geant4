<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
import { onClickOutside, useVModel } from '@vueuse/core'

const props = defineProps<{
  icon: string
  tip: string
  showMenu: string
  modelValue?: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const menuTl = gsap.timeline({ paused: true })
const btnTl = gsap.timeline({ paused: true })
const tipTl = gsap.timeline({ paused: true })

const popMenu = ref(null)
const popBtn = ref(null)
const popTip = ref(null)

onMounted(() => {
  menuTl.to(popMenu.value, {
    duration: 0,
    visibility: 'visible',
  }).from(popMenu.value, {
    duration: 0.3,
    scaleX: 0,
    scaleY: 0,
    opacity: 0,
    transformOrigin: 'center bottom',
    ease: 'back',
  })

  btnTl.to(popBtn.value, {
    duration: 0.3,
    borderRadius: '40%',
    delay: 0.2,
  })

  tipTl.from(popTip.value, {
    duration: 0.1,
    transformOrigin: 'bottom',
    scaleX: 0,
    scaleY: 0,
    delay: 0.1,
  })
})

onClickOutside(popMenu, async () => {
  menuTl.reverse()
}, { ignore: [popBtn] })

const showPopMenu = () => {
  tipTl.pause(0)
  if (props.showMenu === '1')
    menuTl.play()
}

const hoverBtn = () => {
  btnTl.play()
  tipTl.play()
}

const leaveBtn = () => {
  btnTl.pause(0)
  tipTl.pause(0)
}

defineExpose({
  showPopMenu,
})

const value = useVModel(props, 'modelValue', emits)
</script>

<template>
  <div w-9 h-9 overflow-visible flex flex-col relative items-center>
    <div ref="popBtn" w-9 h-9 hover="bg-card-item" flex items-center justify-center rounded-md z-50 @click="showPopMenu" @mouseover="hoverBtn" @mouseleave="leaveBtn">
      <div :class="[value ? 'text-green' : 'text-txt', icon]" w-6 h-6 />
    </div>
    <div ref="popMenu" border="card-item ~" rounded-md p-0 invisible absolute w-30 h-40 bottom-11 bg-card flex flex-col>
      <slot />
    </div>
    <div ref="popTip" w-15 flex items-center justify-center h-5 text-xs bg-input bottom-11 absolute rounded-sm>
      {{ tip }}
    </div>
  </div>
</template>
