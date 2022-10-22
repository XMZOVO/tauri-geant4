<script setup lang="ts">
import axios from 'axios'
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { onClickOutside, useMouse } from '@vueuse/core'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import CollapseResult from '~/components/CollapseResult.vue'
import UInput from '~/components/ui/UInput.vue'
import ResultScene from '~/three/ResultScene'
import Toasts from '~/components/Toasts.vue'
const emits = defineEmits(['executeSimulate', 'simulationComplete', 'onLoading', 'simulationStop'])

Exporting(Highcharts)

let resultList = $ref<Result[]>([])
let resultListBackup = $ref<Result[]>([])
let resultScene: ResultScene
let countList: number[] = []
let energyList: number[] = []
let fwhmCountList: number[] = []
let chart

const sceneDom = ref()
const specDom = ref()
const chartSkeleton = ref(null)
const chartSkTl = gsap.timeline({ paused: true, defaults: { duration: 0.5 } })
const result = ref(null) as any
const resultSource = ref(null)
const toast = ref()
const resultSourceTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const sceneDiv = ref(null)
const specDiv = ref(null)
const sceneDivTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const specDivTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
interface Result {
  id: number
  gdmlName: string
  runId: string
  title: string
  description: string
  resultScene: boolean
  createTime: string
}

onClickOutside(sceneDom, () => {
  sceneDivTl.pause(0)
  resultScene.clearScene()
})
onClickOutside(specDom, () => {
  specDivTl.pause(0)
})

onMounted(async () => {
  const res = await axios.get('http://localhost:8080/resultDb')
  resultListBackup = resultList = res.data.data
  resultScene = new ResultScene(sceneDom.value)
  resultScene.init()

  sceneDivTl.to(sceneDiv.value, { visibility: 'visible', duration: 0 }).from(sceneDiv.value, {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: 'center center',
    duration: 0.3,
  })
  specDivTl.to(specDiv.value, { visibility: 'visible', duration: 0 }).from(specDiv.value, {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: 'center center',
    duration: 0.3,
  })
})

onUnmounted(() => {
  resultScene.renderer.renderLists.dispose()
  resultScene.renderer.dispose()
  resultScene.renderer.forceContextLoss()
  while (resultScene.scene.children.length > 0)
    resultScene.scene.remove(resultScene.scene.children[0])

  cancelAnimationFrame(resultScene.timer)
})

const searchResult = (value: string) => {
  if (value === '') {
    resultList = resultListBackup
  }
  else {
    resultList = resultListBackup.filter((item) => {
      return item.title.includes(value) || item.description.includes(value)
    })
  }
}

const viewResultScene = async (index: number) => {
  if (resultList[index].resultScene) {
    await sceneDivTl.play()
    resultScene.importScene(`http://localhost:8080/file/vrml/${resultList[index].runId}.wrl`)
  }
  else {
    toast.value.showToast()
  }
}

const fetchSpec = async (index: number, fwhm: boolean) => {
  chartSkTl.to(chartSkeleton.value, { visibility: 'visible' }).to(chartSkeleton.value, { background: '#3D3D3D', ease: 'sine', duration: 0.6, repeat: -1, yoyo: true }, '<')
  chartSkTl.play()
  await specDivTl.play()
  const specParams = { name: resultList[index].runId, ch: '4096', minEn: '0.0', maxEn: '2.0', fA: '-0.0137257', fB: '0.0739501', fC: '-0.152982' }
  const response = await axios.post('http://localhost:8080/spec', specParams)
  countList = response.data.data
    .split(',')
    .map((item: any) => {
      return parseInt(item, 10)
    })
  energyList = response.data.energy
    .split(',')
    .map((item: any) => {
      return parseFloat(item)
    })
  fwhmCountList = response.data.fwhmData
    .split(',')
    .map((item: any) => {
      return parseFloat(item)
    })
  if (!fwhm)
    createChart()
  else
    createFWHMChart()
  chartSkTl.pause(0)
  chartSkTl.kill()
}

function createChart() {
  chart = Highcharts.chart({
    chart: {
      animation: false,
      renderTo: 'myChart',
      panning: { enabled: true },
      panKey: 'shift',
      backgroundColor: 'transparent',
      zooming: {
        type: 'x',
        resetButton: {
          theme: {
            fill: '#545454',
            style: {
              color: '#E5E5E5',
            },
            states: {
              hover: {
                fill: '#656565',
                style: {
                  color: '#E5E5E5',
                },
              },
            },
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        groupPadding: 0,
        pointPadding: 0,
        edgeWidth: 0,
        animation: false,
      },
    },
    yAxis: {
      title: { text: '' },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
    },
    xAxis: {
      visible: false,
      categories: energyList.map(item => item.toFixed(4)),
    },
    accessibility: {
      enabled: false,
    },
    navigation: { buttonOptions: { enabled: false } },
    series: [
      {
        name: '计数',
        type: 'column',
        data: countList,
      },
    ],
  })
}

function createFWHMChart() {
  chart = Highcharts.chart({
    chart: {
      animation: false,
      renderTo: 'myChart',
      panning: { enabled: true },
      panKey: 'shift',
      backgroundColor: 'transparent',
      zooming: {
        type: 'x',
        resetButton: {
          theme: {
            fill: '#545454',
            style: {
              color: '#E5E5E5',
            },
            states: {
              hover: {
                fill: '#656565',
                style: {
                  color: '#E5E5E5',
                },
              },
            },
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        groupPadding: 0,
        pointPadding: 0,
        edgeWidth: 0,
        animation: false,
      },
    },
    yAxis: {
      title: { text: '' },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
    },
    xAxis: {
      visible: false,
      categories: energyList.map(item => item.toFixed(3)),
    },
    accessibility: {
      enabled: false,
    },
    navigation: { buttonOptions: { enabled: false } },
    series: [
      {
        type: 'column',
        name: '计数',
        data: fwhmCountList,
      },
    ],
  })
}
</script>

<template>
  <div w-full flex flex-col p-2>
    <div w-full relative flex justify-center>
      <Toasts
        ref="toast"
        :success="false" message="该模拟未保存模拟场景" absolute z-50
      />
    </div>
    <div flex flex-col flex-1 bg-card rounded-md p-3 overflow-y-hidden gap-2>
      <div flex border="~ card-item" h-10 w-50 bg-back p="y-1 x-2" rounded="md" gap-2 items-center>
        <div i-carbon-search />
        <UInput w-full @update:model-value="searchResult" />
      </div>
      <!-- 表 -->
      <div flex flex-col border="~ card-item rounded-md" overflow-y-auto sb>
        <!-- 表头 -->
        <div bg-card-tabBar p-2 px-5 flex rounded="md b-none">
          <div flex-1 max-w="25" font-bold>
            序号
          </div>
          <div flex-1 font-bold>
            标题
          </div>
          <div flex-1 font-bold>
            探测器
          </div>
          <div flex-1 font-bold>
            时间
          </div>
          <div flex-1 max-w="25" font-bold>
            操作
          </div>
        </div>
        <!-- 表身 -->
        <div v-for="item, index in resultList" :key="item.id" flex flex-col overflow-hidden>
          <CollapseResult
            ref="result"
            :s-id="item.id"
            :index="index" :length="resultList.length" :gdml-name="item.gdmlName"
            :description="item.description" :title="item.title" :create-time="item.createTime"
            @view-result-scene="viewResultScene" @fetch-spec="fetchSpec"
          />
        </div>
      </div>
    </div>
  </div>
  <div ref="sceneDiv" absolute w-full h-full z-50 bg="back op80" invisible p-30 overflow-hidden>
    <div w-full h-full>
      <canvas ref="sceneDom" />
    </div>
  </div>
  <div ref="specDiv" absolute w-full h-full z-50 bg="back op80" invisible p-30 overflow-hidden>
    <div w-full h-full relative>
      <div ref="chartSkeleton" invisible w-full h-full absolute bg-back z-50 justify-center items-center flex rounded-md>
        <div id="skIcon" i-carbon-chart-cluster-bar w="1/6" h="1/6" />
      </div>
      <div id="myChart" ref="specDom" bg-back flex-1 />
    </div>
  </div>
</template>
