<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { onClickOutside, useMouse } from '@vueuse/core'
import axios from 'axios'
import SourceInfo from './SourceInfo.vue'

const props = defineProps<{
  sId: number
  index: number
  length: number
  gdmlName: string
  title: string
  description: string
  createTime: string
}>()

const emits = defineEmits<{
  (event: 'viewResultScene', ...args: any[]): void
  (event: 'fetchSpec', ...args: any[]): void
  (event: 'deleteResult', ...args: any[]): void
}>()

const { x, y } = useMouse()

const resultDetail = ref(null)
const resultDtTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const resultSourceTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const resultSource = ref(null)
const sourceBtn = ref(null)

let isCollapse = $ref(true)
let showSource = $ref(false)
const nuclide = ref()
const number = ref()
const type = ref()

onClickOutside(resultSource, async () => {
  resultSourceTl.kill()
  showSource = false
})

onMounted(() => {
  resultDtTl.to(resultDetail.value, { height: '6rem', duration: 0.2 })
})

const expandDetail = async () => {
  if (isCollapse) {
    isCollapse = false
    resultDtTl.play()
  }
  else {
    resultDtTl.reverse()
    isCollapse = true
  }
}

const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleString('zh-cn', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const deleteResult = (index: number) => {
  emits('deleteResult', index)
}

const viewResultScene = () => {
  emits('viewResultScene', props.index)
}

const fetchSpec = () => {
  emits('fetchSpec', props.index, false)
}
const fetchFwhmSpec = () => {
  emits('fetchSpec', props.index, true)
}

const showSourceInfo = async () => {
  await axios.get(`http://localhost:8080/resultDb/${props.sId}`).then((res) => {
    nuclide.value = res.data.data[0].nuclide
    number.value = res.data.data[0].sourceNum
    type.value = res.data.data[0].sourceType === 'point' ? '点源' : '体源'
  })
  showSource = true
  await nextTick()
  resultSourceTl.to(resultSource.value, {
    left: `${x.value.toString()}px`,
    top: `${y.value.toString()}px`,
    visibility: 'visible',
    duration: 0,
  }).from(resultSource.value, { scaleX: 0, scaleY: 0, transformOrigin: 'top left', duration: 0.2 })
  resultSourceTl.play()
}
</script>

<template>
  <div
    :class="[index % 2 ? 'bg-card-strip' : 'bg-card-stripDark',
             index === length ? 'rounded-b-md' : '']"
    p-2 px-5 flex h-15 items-center hover="bg-card-hover"
    @click="expandDetail"
  >
    <div flex-1 max-w="25">
      {{ index + 1 }}
    </div>
    <div flex-1>
      {{ title }}
    </div>
    <div flex-1 flex>
      <div :class="gdmlName === '' ? 'bg-yellow' : 'bg-green'" rounded-md p="x-2 y-0.5" flex-none text-sm>
        {{ gdmlName === '' ? 'NaI探测器' : 'GDML模型' }}
      </div>
    </div>
    <div flex-1>
      {{ formatTime(createTime) }}
    </div>
    <div flex-1 max-w="25">
      <a op70 hover="op100" @click.stop="deleteResult(index)">删除</a>
    </div>
  </div>
  <div ref="resultDetail" class="resultDetail" h-0 bg-back w-full>
    <div flex items-center justify-around p-5 text-sm h-full overflow-hidden>
      <div flex flex-col>
        <div font-bold>
          备注信息
        </div>
        <div op80>
          {{ description }}
        </div>
      </div>
      <div flex flex-col>
        <div font-bold>
          能谱
        </div>
        <a op80 hover="op100" @click="fetchSpec">查看</a>
      </div>
      <div flex flex-col>
        <div font-bold>
          展宽谱
        </div>
        <a op80 hover="op100" @click="fetchFwhmSpec">查看</a>
      </div>
      <div ref="sourceBtn" flex flex-col>
        <div font-bold>
          粒子源信息
        </div>
        <a op80 hover="op100" @click="showSourceInfo">查看</a>
      </div>
      <div flex flex-col>
        <div font-bold>
          模拟结果场景
        </div>
        <a w-10 op80 hover="op100" @click="viewResultScene">查看</a>
      </div>
    </div>
  </div>
  <div v-if="showSource" ref="resultSource" absolute invisible rounded-md>
    <SourceInfo :nuclide="nuclide" :number="number" :type="type" />
  </div>
</template>
