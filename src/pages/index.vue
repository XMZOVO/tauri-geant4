<script setup lang="ts">
import { markRaw, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { Vector3 } from 'three'
import { fetch } from '@tauri-apps/api/http'
import axios from 'axios'
import { readBinaryFile } from '@tauri-apps/api/fs'
import Base3D from '~/three/Base3D'
import { useStore } from '~/stores/store'

const emits = defineEmits(['executeSimulate', 'simulationComplete'])
const store = useStore()
const navTab = ref(null)
const displaySimuInfoCard = ref(null)
const navTabTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const cardTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const router = useRouter()
const ThreeDom = ref() as any
const gdmlStructureList = $ref<GdmlStructure[]>([])
const cardTabBarItem = $ref([
  { name: '探测器几何', icon: 'i-carbon-3d-mpr-toggle', path: '/' },
  { name: '粒子枪', icon: 'i-carbon-webhook', path: '/particle' },
  { name: '其他', icon: 'i-carbon-lightning', path: '/execute' },
])

let strucListSelect = $ref(-1)
let base3D: Base3D
let ws: WebSocket
const duringSimulationInfo = $ref<string[]>([])

interface GdmlStructure {
  name: string
  visible: boolean
}
onMounted(async () => {
  cardTl.from('.card', { x: '100%', stagger: 0.1, delay: 0.3 })
  cardTl.play()
  // 初始化three
  base3D = new Base3D(ThreeDom.value)
  await base3D.init()
  gsap.from('.canvas', { opacity: 0, duration: 1 })
  // 填充gdml结构列表
  for (const item in base3D.detector) {
    if (item === 'world')
      gdmlStructureList.unshift({ name: item, visible: true })
    else gdmlStructureList.push({ name: item, visible: true })
  }
  await nextTick()
  gsap.from('.structureListItem', { x: '200%', stagger: 0.05 })

  const url = 'ws://localhost:8080/ws'
  ws = new WebSocket(url)
  ws.onmessage = websocketonmessage
})

onUnmounted(() => {
  // dispose threejs资源
  base3D.renderer.renderLists.dispose()
  base3D.renderer.dispose()
  base3D.renderer.forceContextLoss()
  while (base3D.scene.children.length > 0)
    base3D.scene.remove(base3D.scene.children[0])

  cancelAnimationFrame(base3D.timer)

  ws.close()
})

function websocketonmessage(e: any) {
  duringSimulationInfo.unshift(e.data)
}

const selecListItem = (index: number) => {
  strucListSelect = index
  base3D.highlightSelect(gdmlStructureList[index].name)
}

const structVisibleChange = (item: GdmlStructure) => {
  base3D.visibleChange(item.name)
  item.visible = !item.visible
}

const navToAction = (index: number) => {
  navTabTl
    .to(navTab.value, { scaleX: 0, transformOrigin: 'right' })
    .to(navTab.value, {
      y: `${index * 100}%`,
      duration: 0,
    })
    .to(navTab.value, { scaleX: 1, transformOrigin: 'right' }, '<')
  navTabTl.play()
  router.push(cardTabBarItem[index].path)
}

const convertGdml = async (path: string) => {
  const fileContent = await readBinaryFile(path)
  const formData = new FormData()
  formData.append('file', new Blob([fileContent.buffer]))
  const res = await axios.post('http://localhost:8080/convert', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return { mtlurl: res.data.mtlurl, objurl: res.data.objurl }
}

const importGdml = async (path: string) => {
  const modelUrl = await convertGdml(path)
  await base3D.importObj(modelUrl.objurl)
  gdmlStructureList.splice(0, gdmlStructureList.length)
  for (const item in base3D.detector) {
    if (item === 'world')
      gdmlStructureList.unshift({ name: item, visible: true })
    else gdmlStructureList.push({ name: item, visible: true })
  }
  await nextTick()
  gsap.from('.structureListItem', { x: '200%', stagger: 0.05 })
}

const positionChange = (pos: { x: number; y: number; z: number }) => {
  base3D.positionChange(new Vector3(pos.x, pos.y, pos.z))
}

const opacityChange = (opacity: number) => {
  base3D.opacityChange(opacity)
}

const axisVisibleChange = (visible: boolean) => {
  base3D.axisVisibleChange(visible)
}

const worldVisibleChange = (visible: boolean) => {
  base3D.worldVisibleChange(visible)
}

const dirLightIntensityChange = (intensity: number) => {
  base3D.dirLightIntensityChange(intensity)
}

const dirLightPosChange = (pos: { x: number; y: number; z: number }) => {
  base3D.dirLightPosChange(new Vector3(pos.x, pos.y, pos.z))
}

const executeSimulate = async () => {
  duringSimulationInfo.splice(0, duringSimulationInfo.length)
  cardTl.reverse()
  emits('executeSimulate')
  await gsap.to(displaySimuInfoCard.value, { bottom: 0, duration: 0.3 })
  base3D.autoRotateCamera(true)
  await axios.post('http://localhost:8080/g4', store.marco)

  // 处理本次模拟信息统计
  if (store.detectorTemplate === '-1')
    store.lastSimulationInfo.detectorParams = null
  else
    store.lastSimulationInfo.detectorParams = store.marco.detector
  store.lastSimulationInfo.detectorTemplate = store.detectorTemplate
  store.lastSimulationInfo.source = store.marco.particle.source
  store.lastSimulationInfo.totalParticles = store.marco.particle.number
  store.lastSimulationInfo.totalTime = '00:01:00'
  store.lastSimulationInfo.particlePos = store.marco.particle.pos
  cardTl.revert()
  base3D.autoRotateCamera(false)
  emits('simulationComplete')
  router.push({ path: '/overview', query: { fetchData: 1 } })
}
</script>

<template>
  <div flex w-full overflow-hidden>
    <!-- 中部 -->
    <div flex-grow relative justify-center flex>
      <!-- 渲染窗口 -->
      <canvas ref="ThreeDom" class="canvas" />
      <div
        ref="displaySimuInfoCard"
        overflow-x-hidden
        text-sm text-green w="2/3" p="y-1 l-1"
        border="~ card-item b-none"
        rounded-md rounded-b-none absolute bottom="-100" h-50 bg="op60 card-stripDark" flex
        flex-col overflow-y-auto sb
      >
        <div v-for="item in duringSimulationInfo" :key="item" whitespace-nowrap>
          {{ item }}
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div w-60 flex flex-col>
      <!-- 卡1 -->
      <div class="h-1/2 card" p-2 pb-1>
        <div bg-card h-full rounded-md overflow-x-hidden>
          <div grid grid-cols-1 text-xs>
            <div
              v-for="(item, index) in gdmlStructureList"
              :key="item.name"
              px-2
              flex
              items-center
              gap-1
              py-1
              class="structureListItem"
              :class="[
                index === strucListSelect
                  ? 'bg-blue'
                  : index % 2
                    ? `bg-card-strip`
                    : `bg-card-stripDark`,
              ]"
            >
              <div
                flex-grow
                flex
                h-full
                :class="index === 0 ? `pl-2` : `pl-6`"
                @click="selecListItem(index)"
              >
                <div i-carbon-caret-right />
                <div>{{ item.name.slice(0, 10) }}</div>
              </div>

              <div
                h-3
                w-3
                :class="[
                  item.visible
                    ? 'i-teenyicons-eye-solid'
                    : 'i-teenyicons-eye-closed-solid',
                ]"
                @click="structVisibleChange(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 卡2 -->
      <div class="h-1/2 card" p-2 pt-1>
        <div h-full bg-card rounded-md flex>
          <!-- 侧边tab栏 -->
          <div w-8 bg-card-tabBar rounded-r-none rounded-md>
            <div flex flex-col items-center relative>
              <!-- 指示条 -->
              <div
                ref="navTab"
                class="h-1/3"
                bg-card
                absolute
                w-8
                rounded="r-none md"
              />
              <div
                v-for="(item, index) in cardTabBarItem"
                :key="item.name"
                p-1
                @click="navToAction(index)"
              >
                <div
                  :class="[
                    item.icon,
                    {
                      'text-yellow': index === 0,
                      'text-red': index === 1,
                      'text-green': index === 2,
                    },
                  ]"
                />
              </div>
            </div>
          </div>
          <!-- tab内容页 -->
          <div flex-grow p-2 overflow-y-auto class="no-scrollbar">
            <RouterView
              @position-change="positionChange"
              @opacity-change="opacityChange"
              @axis-visible-change="axisVisibleChange"
              @world-visible-change="worldVisibleChange"
              @dir-light-intensity-change="dirLightIntensityChange"
              @dir-light-pos-change="dirLightPosChange"
              @execute-simulate="executeSimulate"
              @import-gdml="importGdml"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
