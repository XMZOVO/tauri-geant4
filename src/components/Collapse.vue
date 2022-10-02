<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, ref } from 'vue'

const props = defineProps<{ title: string; itemCount: string }>()
const collapseTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const collapseTitle = ref(null)
const collapseContent = ref(null)
const collapseArrow = ref(null)

let isCollapsed = $ref(true)

onMounted(() => {
  collapseTl
    .to(collapseTitle.value, {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      duration: 0,
    })
    .to(collapseArrow.value, { rotation: 90 })
    .to(
      collapseContent.value,
      {
        height: `${(1 + 1.75 * parseFloat(props.itemCount)).toString()}rem`,
      },
      '<',
    )
})

const expand = () => {
  if (isCollapsed) {
    collapseTl.play()
    isCollapsed = false
  }
  else {
    collapseTl.reverse()
    isCollapsed = true
  }
}
</script>

<template>
  <div overflow-auto>
    <div
      ref="collapseTitle"
      flex
      items-center
      w-full
      h-7
      bg-card-collapse
      rounded-md
      text-xs
      px-2
      gap-1
      relative
      @click="expand"
    >
      <div ref="collapseArrow" i-carbon-chevron-right />
      <div>{{ title }}</div>
      <div flex-grow />
      <div i-carbon-draggable rotate-90 />
    </div>
    <!-- 内容 -->
    <div ref="collapseContent" h-0 overflow-hidden rounded-b bg-card-collapse>
      <slot />
    </div>
  </div>
</template>
