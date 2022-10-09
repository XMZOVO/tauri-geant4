<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { fetch } from '@tauri-apps/api/http'
import { open, save } from '@tauri-apps/api/dialog'
import { BaseDirectory, copyFile, writeTextFile } from '@tauri-apps/api/fs'
import { invoke } from '@tauri-apps/api/tauri'
import { readText } from '@tauri-apps/api/clipboard'
import { onClickOutside, useMouse } from '@vueuse/core'
import gsap from 'gsap'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import { useRoute } from 'vue-router'
import UInput from '~/components/ui/UInput.vue'
import USelect from '~/components/ui/USelect.vue'
import { useStore } from '~/stores/store'
import UCheck from '~/components/ui/UCheck.vue'

const emits = defineEmits(['executeSimulate', 'simulationComplete'])

Exporting(Highcharts)

const route = useRoute()
const store = useStore()
const dataNumPerPage = 10
const calDataEnergyList = $ref<number[]>([
  0.662, 1.1732, 1.3325, 1.2178, 2.4469, 3.4427, 4.1111, 4.4396, 7.789, 8.6737,
  9.640, 10.8586, 11.1207, 12.1294, 12.9914, 14.080,
])
const calResult = $ref<calibrateResult[]>([])
for (let i = 0; i < 15; i++) {
  calResult.push({
    energy: calDataEnergyList[i],
    efficiency: undefined,
    delta: undefined,
  })
}
const calPointList = $ref<calPoint[]>([])
calPointList.push(
  ...[
    { energy: 1.166, efficiency: 0.001339 },
    { energy: 1.324, efficiency: 0.001378 },
  ],
)
const nucTable = ref(null)
const dbBtn = ref(null)
const calResultTable = ref(null)
const calPointTable = ref(null)
const { x, y } = useMouse()
const nucTableTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const infoToDisplay = $ref([
  { name: '模拟总粒子数', value: store.marco.particle.number },
  { name: '探测器模版', value: store.detectorTemplate === '0' ? 'NaI' : 'GDML' },
  { name: '放射源', value: store.marco.particle.source },
  { name: '模拟总用时', value: store.totalTime },
])

if (store.detectorTemplate === '0') {
  infoToDisplay.push(...[
    { name: '晶体高度', value: store.marco.detector.cylinderH },
    { name: '晶体半径', value: store.marco.detector.cylinderR },
    { name: '放射层顶厚', value: store.marco.detector.reflectTT },
    { name: '放射层侧厚', value: store.marco.detector.reflectST },
    { name: '放射层材料', value: store.marco.detector.reflectMat },
    { name: 'PMT厚度', value: store.marco.detector.pmtT },
  ])
}

let selectCalDataIndex = $ref<number>(-1)
let selectCalPointIndex = $ref<number>(-1)
let currentPage = $ref(1)
let pageNum = $ref(1)
let showNucTable = $ref(false)
let enableMousePick = $ref(false)
let fillPointIndex = -1
const currentPageResult = computed(() => {
  pageNum = Math.ceil(calResult.length / dataNumPerPage) || 1
  if (currentPage === pageNum) {
    return calResult.slice(
      dataNumPerPage * (currentPage - 1),
      calResult.length,
    )
  }
  else {
    return calResult.slice(
      dataNumPerPage * (currentPage - 1),
      dataNumPerPage * (currentPage - 1) + 10,
    )
  }
})

interface calibrateResult {
  energy?: number
  efficiency?: number
  fit?: number
  delta?: number
}

interface calPoint {
  energy?: number
  efficiency?: number
}

interface nuclide {
  id: number
  nuclide: string
  energy: number
  percent: number
  halfLife: string
  halfLifeUnit: string
}

onClickOutside(nucTable, () => {
  if (showNucTable) {
    showNucTable = false
    nucTableTl.kill()
  }
}, { ignore: [dbBtn] })

onClickOutside(calResultTable, () => {
  if (selectCalDataIndex !== -1)
    selectCalDataIndex = -1
}, { ignore: [nucTable] })

onClickOutside(calPointTable, () => {
  if (selectCalPointIndex !== -1)
    selectCalPointIndex = -1
})

const fetchSpectrumData = async () => {
  const response: any = await fetch('http://localhost:8080/spec', {
    method: 'GET',
    timeout: 30,
  })
  store.spectrumData.countList = response.data.data
    .split(',')
    .map((item: any) => {
      return parseInt(item, 10)
    })
  store.spectrumData.energyList = response.data.energy
    .split(',')
    .map((item: any) => {
      return parseFloat(item)
    })
  store.spectrumData.fwhmCountList = response.data.fwhmData
    .split(',')
    .map((item: any) => {
      return parseFloat(item)
    })
}

const createChart = () => {
  const chart = Highcharts.chart({
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
      categories: store.spectrumData.energyList.map(item => item.toFixed(3)),
    },
    accessibility: {
      enabled: false,
    },
    navigation: { buttonOptions: { enabled: false } },
    series: [
      {
        name: '计数',
        type: 'column',
        data: store.spectrumData.countList,
        events: {
          click: (ev: any) => {
            if (enableMousePick) {
              enableMousePick = false
              const dataContext = ev.point
              calPointList[fillPointIndex].energy = parseFloat(
                dataContext.category as string,
              )
              calPointList[fillPointIndex].efficiency
                = dataContext.y! / parseFloat(store.marco.particle.number)
              fillPointIndex = -1
            }
          },
        },
      },
    ],
  })
}

const createFWHMChart = () => {
  const chart = Highcharts.chart({
    chart: {
      animation: false,
      renderTo: 'fwhmChart',
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
      categories: store.spectrumData.energyList.map(item => item.toFixed(3)),
    },
    accessibility: {
      enabled: false,
    },
    navigation: { buttonOptions: { enabled: false } },
    series: [
      {
        type: 'column',
        name: '计数',
        data: store.spectrumData.fwhmCountList,
        events: {
          click: (event) => {
          },
        },
      },
    ],
  })
}

onMounted(async () => {
  if (store.nuclideList.length === 0) {
    const response: any = await fetch('http://localhost:8080/nuclideDb')
    store.nuclideList = response.data.data
  }
  if (route.query.fetchData) {
    await fetchSpectrumData()
    createChart()
  }
  else if (store.spectrumData.countList) {
    createChart()
  }
})

const openDatabaseForm = () => {
  if (showNucTable) {
    nucTableTl.to(nucTable.value, {
      left: `${x.value.toString()}px`,
      top: `${y.value.toString()}px`,
      duration: 0.2,
    })
  }
  else {
    showNucTable = true
    nucTableTl.to(nucTable.value, {
      duration: 0,
      left: `${x.value.toString()}px`,
      top: `${y.value.toString()}px`,
    })
  }
  nucTableTl.play()
}

const selectNuc = (item: nuclide) => {
  if (selectCalDataIndex !== -1) {
    calResult[selectCalDataIndex].energy = item.energy
    showNucTable = false
    nucTableTl.kill()
  }
}

const prePage = () => {
  if (currentPage !== 1)
    currentPage--
}

const nextPage = () => {
  if (currentPage !== pageNum)
    currentPage++
}

const exportToCsv = async () => {
  let csv = 'Energy,Efficiency,Fit,Delta\n'
  calResult.forEach((element) => {
    csv += `${element.energy},${element.efficiency ?? ''},${
      element.fit ?? ''
    }, ${element.delta ?? ''}\n`
  })

  const filePath = await save({
    filters: [
      {
        name: 'calibration data',
        extensions: ['csv'],
      },
    ],
  })
  if (filePath)
    await writeTextFile(filePath, csv)
}

const addCalResult = () => {
  if (selectCalDataIndex !== -1) {
    calResult.splice((selectCalDataIndex + (currentPage - 1) * dataNumPerPage) + 1, 0, {
      energy: undefined,
      efficiency: undefined,
      delta: undefined,
    })
  }
  else {
    calResult.push({
      energy: undefined,
      efficiency: undefined,
      delta: undefined,
    })
  }
}

const removeCalResult = () => {
  if (selectCalDataIndex !== -1)
    calResult.splice(selectCalDataIndex + (currentPage - 1) * dataNumPerPage, 1)
  else calResult.pop()
}

const pickPoint = (index: number) => {
  enableMousePick = true
  fillPointIndex = index
}

const pasteFromClipboard = async () => {
  const clipboardText = await readText()
  try {
    const clipboardData = clipboardText!.split('\n')

    for (let i = 0; i < clipboardData.length; i++) {
      const data
        = clipboardData[i].split(' ').length === 2
          ? clipboardData[i].split(' ')
          : clipboardData[i].split('\t')
      calPointList.push({
        energy: isNaN(parseFloat(data[0])) ? undefined : parseFloat(data[0]),
        efficiency: isNaN(parseFloat(data[1])) ? undefined : parseFloat(data[1]),
      })
    }
  }
  catch {
  }
}

const addCalPoint = () => {
  if (selectCalPointIndex !== -1) {
    calPointList.splice(selectCalPointIndex + 1, 0, {
      energy: undefined,
      efficiency: undefined,
    })
  }
  else {
    calPointList.push({
      energy: undefined,
      efficiency: undefined,
    })
  }
}

const removeCalPoint = () => {
  if (selectCalPointIndex !== -1)
    calPointList.splice(selectCalPointIndex, 1)
  else calPointList.pop()
}

const executeCalibrate = async () => {
  // 效率刻度系数
  const parametersList: Float32Array = await invoke('linear_fit', {
    energy1: calPointList[0].energy,
    energy2: calPointList[1].energy,
    efficiency1: calPointList[0].efficiency,
    efficiency2: calPointList[1].efficiency,
  })

  // 效率反算
  const energyList: number[] = []
  calResult.forEach((element) => {
    if (element.energy !== undefined)
      energyList.push(element.energy)
  })

  const effList: number[] = await invoke('eff_cal_line', {
    a1: parametersList[0],
    a2: parametersList[1],
    energyList,
  })
  for (let i = 0; i < effList.length; i++)
    calResult[i].efficiency = parseFloat(effList[i].toFixed(6))
  await nextTick()
  gsap.from('.resultEfficiency', {
    y: 10,
    opacity: 0,
    duration: 0.5,
    stagger: 0.03,
  })
}
</script>

<template>
  <div flex w-full flex-col p-2 gap-2 text-sm relative>
    <!-- 上部 -->
    <div flex flex-grow gap-2 class="max-h-1/2">
      <!-- 刻度结果表 -->
      <div ref="calResultTable" w="1/2" flex flex-col bg-card rounded-md>
        <!-- 表头 -->
        <div flex items-center justify-evenly px-2 py-1>
          <div class="w-1/5">
            序号
          </div>
          <div class="w-1/5">
            能量(MeV)
          </div>
          <div class="w-1/5">
            效率
          </div>
          <div class="w-1/5">
            Fit
          </div>
          <div class="w-1/5">
            Delta
          </div>
        </div>
        <!-- 表身 -->
        <div ref="dbBtn" flex-grow overflow-y-auto flex flex-col class="no-scrollbar">
          <div
            v-for="(item, index) in currentPageResult"
            :key="item.energy"
            flex
            flex-1
            items-center
            px-2
            py-1
            class="detectorListItem"
            :class="[
              dataNumPerPage * (currentPage - 1) + index === selectCalDataIndex
                ? 'bg-blue hover:bg-blue-light'
                : index % 2
                  ? `bg-card-strip hover:bg-card-hover`
                  : `bg-card-stripDark hover:bg-card-hover`,
              currentPage === pageNum ? 'max-h-9' : '',
            ]"
            @click="selectCalDataIndex = dataNumPerPage * (currentPage - 1) + index"
          >
            <div class="w-1/5">
              {{ dataNumPerPage * (currentPage - 1) + (index + 1) }}
            </div>
            <div flex items-center w="1/5">
              <input
                v-model="item.energy"
                type="text"
                text-sm
                border-none
                w-16
                p-0
                focus:outline-none
                focus:ring-0
                focus:border-none
                rounded-sm
                bg-transparent
              >
              <div
                db-btn-out
                cursor-pointer
                op30
                hover:op100
                p-1
                @click="openDatabaseForm"
              >
                <div db-btn-in i-carbon-data-base />
              </div>
            </div>
            <div class="w-1/5 resultEfficiency">
              {{ item.efficiency }}
            </div>
            <div class="w-1/5">
              {{ item.fit }}
            </div>
            <div class="w-1/5">
              {{ item.delta }}
            </div>
          </div>
        </div>
        <!-- 表底 -->
        <div flex py-2 px-4 justify-between items-center>
          <!-- 分页 -->
          <div flex flex-grow items-center>
            <a
              inline-flex
              items-center
              gap-2
              rounded-md
              cursor-pointer
              @click="prePage()"
            >
              <div p="x-2 y-1" hover="bg-input" rounded-md>
                <div h-5 w-5 i-ic-round-keyboard-double-arrow-left />
              </div>
              <span sr-only>Previous</span>
            </a>
            <div
              v-for="(item, index) in pageNum"
              :key="item"
              px-2
              py-1
              hover="bg-input"
              rounded-md
              cursor-pointer
              @click="currentPage = index + 1"
            >
              <a
                w-5
                h-5
                text-txt
                :class="
                  currentPage === index + 1
                    ? 'text-opacity-100'
                    : 'text-opacity-40'
                "
              >{{ item }}</a>
            </div>
            <a
              inline-flex
              items-center
              gap-2
              rounded-md
              cursor-pointer
              @click="nextPage()"
            >
              <span sr-only>Next</span>
              <div rounded-md p="x-2 y-1" hover="bg-input" cursor-pointer>
                <div h-5 w-5 i-ic-round-keyboard-double-arrow-right />
              </div>
            </a>
          </div>
          <!-- 操作 -->
          <div flex gap-2 item-center>
            <!-- 保存 -->
            <div
              rounded-md
              px-2
              py-1
              hover="bg-input"
              cursor-pointer
              @click="exportToCsv"
            >
              <div i-carbon-download w-5 h-5 />
            </div>
            <!-- 添加 -->
            <div
              rounded-md
              px-2
              py-1
              hover="bg-input"
              cursor-pointer
              @click="addCalResult"
            >
              <div i-carbon-add w-5 h-5 />
            </div>
            <div
              rounded-md
              px-2
              py-1
              hover="bg-input"
              cursor-pointer
              @click="removeCalResult"
            >
              <div i-carbon-subtract w-5 h-5 />
            </div>
          </div>
        </div>
      </div>
      <!-- 绘图 -->
      <div w="1/2" bg-card rounded-md flex flex-col>
        <!-- 图操作 -->
        <div flex />
        <div id="myChart" flex-1 />
      </div>
    </div>
    <!-- 下部 -->
    <div flex class="h-1/2" gap-2>
      <div w="1/2" flex gap-2>
        <div class="w-3/5" bg-card rounded-md>
          <!-- 刻度点表 -->
          <div ref="calPointTable" w-full h-full flex flex-col bg-card rounded-md>
            <!-- 表头 -->
            <div flex items-center justify-evenly px-2 py-1>
              <div w="1/6">
                序号
              </div>
              <div w="1/3">
                能量(MeV)
              </div>
              <div w="1/3">
                效率
              </div>
              <div w="1/6">
                操作
              </div>
            </div>
            <!-- 表身 -->
            <div flex-1 overflow-y-auto flex flex-col class="no-scrollbar">
              <div
                v-for="(item, index) in calPointList"
                :key="item.energy"
                flex
                flex-1
                items-center
                max-h-9
                px-2
                py-1
                class="detectorListItem"
                :class="[
                  index === selectCalPointIndex
                    ? 'bg-blue hover:bg-blue-light'
                    : index % 2
                      ? `bg-card-strip hover:bg-card-hover`
                      : `bg-card-stripDark hover:bg-card-hover`,
                ]"
                @click="selectCalPointIndex = index"
              >
                <div w="1/6">
                  {{ index + 1 }}
                </div>
                <div flex items-center w="1/3">
                  <input
                    v-model.number="item.energy"
                    type="text"
                    text-sm
                    border-none
                    w-16
                    p-0
                    focus:outline-none
                    focus:ring-0
                    focus:border-none
                    rounded-sm
                    bg-transparent
                  >
                </div>
                <div flex items-center w="1/3">
                  <input
                    v-model.number="item.efficiency"
                    type="text"
                    text-sm
                    border-none
                    w-16
                    p-0
                    focus:outline-none
                    focus:ring-0
                    focus:border-none
                    rounded-sm
                    bg-transparent
                  >
                </div>
                <div flex items-center cursor-pointer op30 hover:op100 p-1 w="1/6" @click="pickPoint(index)">
                  <div i-carbon-touch-1 />
                </div>
              </div>
            </div>
            <!-- 表底操作 -->
            <div flex gap-2 item-center w-full py-2 px-4>
              <!-- 剪切板 -->
              <div
                rounded-md
                px-2
                py-1
                hover="bg-input"
                cursor-pointer
                task-add
                @click="pasteFromClipboard"
              >
                <div i-carbon-task-add w-5 h-5 />
              </div>
              <div flex-1 />
              <!-- 添加 -->
              <div
                rounded-md
                px-2
                py-1
                hover="bg-input"
                cursor-pointer
                @click="addCalPoint"
              >
                <div i-carbon-add w-5 h-5 />
              </div>
              <div
                rounded-md
                px-2
                py-1
                hover="bg-input"
                cursor-pointer
                @click="removeCalPoint"
              >
                <div i-carbon-subtract w-5 h-5 />
              </div>
            </div>
          </div>
        </div>
        <!-- 刻度执行 -->
        <div class="w-2/5" bg-card rounded-md flex flex-col>
          <div grid-cols-3 grid items-center p-3 gap-2>
            <div flex justify-end>
              刻度方式
            </div>
            <div flex justify-start col-span-2>
              <select
                v-model="store.clibrateMethod"
                rounded-md
                bg-back
                focus:outline-none
                focus:border-none
                focus:ring-0
                border-none
                shadow-sm
                text-sm
                py-1
                px-2
                w-full
              >
                <option>线性</option>
                <option>二次</option>
                <option>多项式</option>
              </select>
            </div>
            <div whitespace-nowrap flex justify-end>
              刻度曲线
            </div>
            <input
              v-model="store.showCalibrateCurve"
              type="checkbox"
              rounded-sm
              bg-input-grey
              border-item
              w-4
              h-4
              text-blue
            >
          </div>
          <div flex-1 />
          <div flex gap-2 items-center w-full justify-end p-3>
            <button bg-input hover="bg-input-hover" px-2 py-1 rounded-md @click="executeCalibrate">
              刻度
            </button>
            <button bg-input hover="bg-input-hover" px-2 py-1 rounded-md>
              取消刻度
            </button>
          </div>
        </div>
      </div>
      <!-- 刻度信息展示 -->
      <div w="1/2" bg-card rounded-md>
        <div v-if="store.lastSimulationInfo.totalParticles" grid grid-flow-row auto-rows-max gap-2 p-3>
          <div v-for="item in infoToDisplay" :key="item.name" flex w="1/2" items-center gap-2>
            <div flex justify-start w="1/2">
              {{ `${item.name}:` }}
            </div>
            <div w="1/2" flex justify-start>
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 核素数据库 -->
  <div v-show="showNucTable" ref="nucTable" absolute text-xs w-90 h-90 flex flex-col z-50 border="~ card-item" bg-card rounded-md shadow="xl back">
    <!-- 表头 -->
    <div flex w-full px-1 py-1>
      <div flex bg-back rounded-md px-2 py="0.1rem" items-center gap-2 border="~ card-item">
        <div i-carbon-search />
        <input bg-transparent p-0 focus:outline-none focus:ring-0>
      </div>
    </div>
    <div grid grid-cols-5 items-center bg-card-item w-full justify-evenly px-2 py-1>
      <div>
        序号
      </div>
      <div>
        核素
      </div>
      <div>
        能量
      </div>
      <div>
        分支比
      </div>
      <div>
        半衰期
      </div>
    </div>
    <!-- 表内容 -->
    <div flex-1 overflow-y-auto rounded-md rounded-t-none sb overflow-x-hidden>
      <div
        v-for="(item, index) in store.nuclideList"
        :key="item.id"
        grid
        grid-cols-5
        items-center
        w-full
        bg-card
        justify-evenly
        px-2
        py-1
        :class="index % 2 === 0 ? 'bg-card-stripDark hover:bg-card-hover' : 'bg-card-strip hover:bg-card-hover'"
        @click="selectNuc(item)"
      >
        <div>
          {{ index + 1 }}
        </div>
        <div>
          {{ item.nuclide }}
        </div>
        <div>
          {{ item.energy }}
        </div>
        <div>
          {{ item.percent }}
        </div>
        <div whitespace-nowrap>
          {{ `${item.halfLife} ${item.halfLifeUnit}` }}
        </div>
      </div>
    </div>
  </div>
</template>
