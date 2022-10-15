<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { Vector3 } from 'three'
import axios from 'axios'
import { readBinaryFile, readTextFile } from '@tauri-apps/api/fs'
import { useElementBounding, useMagicKeys } from '@vueuse/core'
import Base3D from '~/three/Base3D'
import { useStore } from '~/stores/store'
import Toasts from '~/components/Toasts.vue'
import PopBtn from '~/components/PopBtn.vue'
import UCheck from '~/components/ui/UCheck.vue'
import USlide from '~/components/ui/USlide.vue'
const emits = defineEmits(['executeSimulate', 'simulationComplete', 'onLoading', 'simulationStop'])

const { control, c /* keys you want to monitor */ } = useMagicKeys()

const store = useStore()
const navTab = ref(null)
const toast = ref()
const interactiveBar = ref()
const displaySimuInfoCard = ref(null)
const navTabTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const cardTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const simuInfoTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
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

watchEffect(() => {
  if (control.value && c.value)
    killProcess()
})

onMounted(async () => {
  cardTl.from('.card', { x: '100%', stagger: 0.1, delay: 0.4 }).from(interactiveBar.value, { y: '150%', duration: 0.3 }, '+=0.1')
  cardTl.play()
  // 初始化three
  base3D = new Base3D(ThreeDom.value)
  await base3D.init()
  await loadModelRenderSettings()
  gsap.from('.canvas', { opacity: 0, duration: 1 })
  // 初始化websocket
  const url = 'ws://localhost:8080/ws'
  ws = new WebSocket(url)
  ws.onmessage = websocketOnMessage
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

function websocketOnMessage(e: any) {
  duringSimulationInfo.unshift(e.data)
}

async function freshStructureList() {
  gdmlStructureList.splice(0, gdmlStructureList.length)
  for (const item in base3D.detector) {
    if (base3D.detector[item] === base3D.world)
      gdmlStructureList.unshift({ name: item, visible: true })
    else gdmlStructureList.push({ name: item, visible: true })
  }
  await nextTick()
  gsap.from('.structureListItem', { x: '200%', stagger: 0.05 })
}

async function loadModelRenderSettings() {
  if (!store.currentSceneUrl)
    await base3D.initModel()

  else await base3D.importVrml(store.currentSceneUrl, store.structureList, store.randomColor === '1')
  freshStructureList()
  base3D.worldVisibleChange(store.showWorldVolume)
  base3D.axisVisibleChange(store.showAxes)

  base3D.highLightSDLogVolume(store.gdmlMarco.detector.sdLogVolName)
  base3D.dirLightIntensityChange(store.dirLightIntensity)
  base3D.dirLightPosChange(new Vector3(parseFloat(store.dirLightPos.x), parseFloat(store.dirLightPos.y), parseFloat(store.dirLightPos.z)))
  base3D.opacityChange(store.detectorOpacity)
  base3D.setRoughness(parseFloat(store.roughness))
  base3D.particlePositionChange(new Vector3(parseFloat(store.marco.particle.pos.x), parseFloat(store.marco.particle.pos.y), parseFloat(store.marco.particle.pos.z)))
  base3D.fitCameraToSelection(base3D.camera, base3D.controls, base3D.detectorGroup.children, 1.8)
}

const selecListItem = (index: number) => {
  strucListSelect = index
  base3D.highlightSelect(gdmlStructureList[index].name)
}

const structVisibleChange = (item: GdmlStructure) => {
  if (gdmlStructureList.indexOf(item) === 0) {
    base3D.visibleChangeAll(!item.visible)
    const flag = !item.visible
    for (const i in gdmlStructureList)
      gdmlStructureList[i].visible = flag
  }
  else {
    base3D.visibleChange(item.name, !item.visible)
    item.visible = !item.visible
  }
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

const changeTemplate = async (index: number) => {
  store.currentSceneUrl = ''
  loadModelRenderSettings()
}

function getNodes(str: string, start: string, end: string) {
  const reg = new RegExp(`${start}(.+?)${end}`, 'g')
  const result = str.match(reg)!.map(item => item.replace(start, '').replace(end, ''))
  if (result)
    return result
  else return []
}

const convertGdml = async (path: string) => {
  const fileContent = await readTextFile(path)
  const newFContent = fileContent.replace('http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd', '../gdml.xsd')
  const meshList = getNodes(newFContent, '<volume name="', '">')
  const world = meshList.pop()
  if (world)
    meshList.unshift(world)
  store.structureList = meshList

  const myblob = new Blob([newFContent], {
    type: 'text/plain',
  })

  const res = await axios.post('http://localhost:8080/vrmlConvert', { lineSegments: store.lineSegmentsPerCircle, file: myblob }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return { vrmlurl: res.data.vrmlurl as string, meshList }
}

const importGdml = async (path: string) => {
  emits('onLoading', true)
  try {
    const vrmlData = await convertGdml(path)
    // await base3D.importVrml(vrmlData.vrmlurl, vrmlData.meshList, store.randomColor === '1')
    store.currentSceneUrl = vrmlData.vrmlurl
    loadModelRenderSettings()
    store.specParams.name = store.gdmlMarco.detector.fileName = vrmlData.vrmlurl.split('/').pop()!.split('.')[0]
  }
  catch {
    emits('onLoading', false)
  }
  emits('onLoading', false)
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

const particlePositionChange = (pos: { x: number; y: number; z: number }) => {
  base3D.particlePositionChange(new Vector3(pos.x, pos.y, pos.z))
}

const viewVrmlScene = async (path: string) => {
  const imgContent = await readBinaryFile(path)
  const blob = URL.createObjectURL(new Blob([imgContent.buffer]))
  base3D.viewVrmlScene(blob)
  gdmlStructureList.splice(0, gdmlStructureList.length)
}

// 计算用时
const getUseTime = (startTime: number, endTime: number) => {
  const useTime = endTime - startTime
  const hour = Math.floor(useTime / 3600000)
  const minute = Math.floor((useTime - hour * 3600000) / 60000)
  const second = Math.floor((useTime - hour * 3600000 - minute * 60000) / 1000)
  return `${hour}h ${minute}m ${second}s`
}

const executeSimulate = async () => {
  duringSimulationInfo.splice(0, duringSimulationInfo.length) // 清空runtime信息
  cardTl.reverse()
  emits('executeSimulate')
  await simuInfoTl.to(displaySimuInfoCard.value, { bottom: 0, duration: 0.3 }).play()

  base3D.autoRotateCamera(true)

  const startTime = new Date().getTime()

  let erro
  if (store.detectorTemplate === '-1') {
    store.setGdmlMarco()

    await axios.post('http://localhost:8080/g4gdml', store.gdmlMarco, { timeout: 1e5 }).catch((err) => {
      if (err.request.status === 500)
        erro = err
    })
  }
  else if (store.detectorTemplate === '0') {
    await axios.post('http://localhost:8080/g4', store.marco, { timeout: 1e5 }).catch((err) => {
      if (err.request.status === 500)
        erro = err
    })
  }

  if (erro === undefined) {
    const endTime = new Date().getTime()
    store.totalTime = getUseTime(startTime, endTime)

    // 处理本次模拟信息统计
    store.setLastSimulationInfo()

    cardTl.revert()
    base3D.autoRotateCamera(false)
    emits('simulationComplete')
    router.push({ path: '/overview', query: { fetchData: 1 } })
    // await axios.post('http://localhost:8080/runResult', { name: store.gdmlMarco.detector.fileName })
  }
}

async function killProcess() {
  await axios.post('http://localhost:8080/killProcess')
  cardTl.play()
  simuInfoTl.reverse()
  base3D.autoRotateCamera(false)
  emits('simulationStop')
  setTimeout(() => {
    toast.value.showToast()
  }, 300)
}

const setClip = () => {
  base3D.setClip(store.clipMod)
}

const setClipConstant = (index: number) => {
  base3D.setClipConstant(index, parseFloat(store.clipPanes[index]))
}

const autoRotate = () => {
  store.autoRotate = !store.autoRotate
  base3D.autoRotateCamera(store.autoRotate)
}
</script>

<template>
  <div flex w-full overflow-hidden>
    <!-- 中部 -->
    <div flex-grow relative justify-center flex>
      <!-- 渲染窗口 -->
      <canvas ref="ThreeDom" class="canvas" />
      <!-- 运行时输出信息 -->
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

      <!-- interactiveBar -->
      <div ref="interactiveBar" absolute bottom="3" w-full px-20 select-none>
        <div flex items-center justify-between px-10 bg-card-stripDark w-full h-12 p-3 rounded-full border="card-item ~" shadow-xl>
          <PopBtn show-menu="1" tip="视图" icon="i-lucide-view" />
          <PopBtn show-menu="1" tip="切面" icon="i-iconoir-3d-add-hole">
            <div flex flex-col text-sm w-full h-full items-center>
              <div flex flex-1 items-center gap-4 hover="bg-input" rounded="b-none md" p-2 py-1 w-full justify-start>
                <UCheck v-model="store.clipMod" @update:model-value="setClip" />
                <div>
                  启用切面
                </div>
              </div>
              <div flex flex-1 items-center gap-4 hover="bg-input" p-2 py-1 w-full justify-start>
                <div>
                  x
                </div>
                <USlide v-model="store.clipPanes[0]" min="-50" max="50" step="0.1" @update:model-value="setClipConstant(0)" />
              </div>
              <div flex flex-1 items-center gap-4 hover="bg-input" p-2 py-1 w-full justify-start>
                <div>
                  y
                </div>
                <USlide v-model="store.clipPanes[1]" min="-50" max="50" step="0.1" @update:model-value="setClipConstant(1)" />
              </div>
              <div flex flex-1 items-center gap-4 hover="bg-input" rounded="t-none md" p-2 py-1 w-full justify-start>
                <div>
                  z
                </div>
                <USlide v-model="store.clipPanes[2]" min="-50" max="50" step="0.1" @update:model-value="setClipConstant(2)" />
              </div>
            </div>
          </PopBtn>
          <PopBtn v-model="store.autoRotate" show-menu="0" tip="自动旋转" icon="i-fluent-cube-rotate-20-regular" @click="autoRotate" />
          <PopBtn

            show-menu="0" tip="正交视角" icon="i-ph-perspective"
          />
          <PopBtn show-menu="0" tip="info" icon="i-iconoir-3d-add-hole" />
          <PopBtn show-menu="0" tip="info" icon="i-iconoir-3d-add-hole" />
        </div>
      </div>
      <!-- Toast -->
      <Toasts ref="toast" message="模拟已停止" left="1/3" />
    </div>
    <!-- 右侧 -->
    <div w-60 flex flex-col>
      <!-- 卡1 -->
      <div class="h-1/2 card" p-2 pb-1>
        <div bg-card h-full rounded-md overflow-x-hidden class="no-scrollbar">
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
                <div>{{ item.name.slice(0, 15) }}</div>
              </div>

              <div
                v-if="index !== 0"
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
              @opacity-change="opacityChange"
              @axis-visible-change="axisVisibleChange"
              @world-visible-change="worldVisibleChange"
              @dir-light-intensity-change="dirLightIntensityChange"
              @dir-light-pos-change="dirLightPosChange"
              @execute-simulate="executeSimulate"
              @import-gdml="importGdml"
              @view-vrml-scene="viewVrmlScene"
              @change-template="changeTemplate"
              @particle-position-change="particlePositionChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
