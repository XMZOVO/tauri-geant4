<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { fetch } from '@tauri-apps/api/http'
import { open, save } from '@tauri-apps/api/dialog'
import { BaseDirectory, copyFile, writeTextFile } from '@tauri-apps/api/fs'
import { invoke } from '@tauri-apps/api/tauri'
import { readText } from '@tauri-apps/api/clipboard'
import { onClickOutside, useMouse } from '@vueuse/core'
import gsap from 'gsap'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Toasts from '../components/Toasts.vue'
import UInput from '~/components/ui/UInput.vue'
import USelect from '~/components/ui/USelect.vue'
import { useStore } from '~/stores/store'
import UCheck from '~/components/ui/UCheck.vue'

const emits = defineEmits(['executeSimulate', 'simulationComplete', 'onLoading', 'simulationStop'])

Exporting(Highcharts)

const toast = ref()
const route = useRoute()
const router = useRouter()
const store = useStore()
const dataNumPerPage = 10
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
const searchInput = ref('')
const chartNav = $ref([{ name: '能谱', path: '/overview/' }, { name: '展宽谱', path: '/overview/fwhm' }, { name: '刻度曲线', path: '/overview/curve' }])

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
  pageNum = Math.ceil(store.calResultList.length / dataNumPerPage) || 1
  if (currentPage === pageNum) {
    return store.calResultList.slice(
      dataNumPerPage * (currentPage - 1),
      store.calResultList.length,
    )
  }
  else {
    return store.calResultList.slice(
      dataNumPerPage * (currentPage - 1),
      dataNumPerPage * (currentPage - 1) + 10,
    )
  }
})

interface nuclide {
  id: number
  nuclide: string
  energy: number
  percent: number
  halfLife: string
  halfLifeUnit: string
}

watch(searchInput, (val) => {
  if (val === '') {
    store.nucTableData = store.nucTableDataBackup
  }
  else {
    store.nucTableData = store.nucTableDataBackup.filter(item =>
      item.nuclide.toLowerCase().includes(val.toLowerCase()),
    )
  }
})

function toScientificNotation(num: number | undefined) {
  if (!num)
    return
  const str = num.toString()
  const reg = /^(\d+)(e)([\-]?\d+)$/
  const arr = reg.exec(str)
  if (arr == null)
    return num.toExponential(2)

  else
    return `${Math.round(Number(arr[1]) * 10 ** Number(arr[3]))}e${arr[3]}`
}

onClickOutside(nucTable, async () => {
  if (showNucTable) {
    await nucTableTl.to(nucTable.value, { opacity: 0 }).to(nucTable.value, { visibility: 'hidden', duration: 0 })
    nucTableTl.kill()
    showNucTable = false
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
  const response: any = await axios.post('http://localhost:8080/spec', store.specParams)
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
              store.calPointList[fillPointIndex].energy = parseFloat(
                dataContext.category as string,
              )
              store.calPointList[fillPointIndex].efficiency
                = dataContext.y! / parseFloat(store.marco.particle.number)
              fillPointIndex = -1
              toast.value.showToast()
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
  store.selectedChart = 0
  if (store.calResultList.length === 0)
    store.initcalResult()
  if (store.nucTableDataBackup.length === 0) {
    const response: any = await axios.get('http://localhost:8080/nuclideDb')
    store.nucTableDataBackup = store.nucTableData = response.data.data
  }
  if (route.query.fetchData) {
    await fetchSpectrumData()
    createChart()
  }
  else if (store.spectrumData.countList) {
    createChart()
  }
})

const openDatabaseForm = async () => {
  if (showNucTable) {
    nucTableTl.to(nucTable.value, {
      // left: `${x.value.toString()}px`,
      top: `${y.value.toString()}px`,
      duration: 0.2,
    })
    nucTableTl.play()
  }
  else {
    nucTableTl.to(nucTable.value, {
      duration: 0,
      left: `${x.value.toString()}px`,
      top: `${y.value.toString()}px`,
      visibility: 'visible',
    }).to(nucTable.value, {
      duration: 0.2,
      opacity: 1,
    }).from(nucTable.value, {
      duration: 0.3,
      scaleX: 0,
      scaleY: 0,
      transformOrigin: 'left top',
      ease: 'back',
    }, '<')
    await nucTableTl.play()
    showNucTable = true
  }
}

const selectNuc = async (item: nuclide) => {
  if (selectCalDataIndex !== -1) {
    store.calResultList[selectCalDataIndex].energy = item.energy
    await nucTableTl.to(nucTable.value, { opacity: 0 }).to(nucTable.value, { visibility: 'hidden', duration: 0 })
    nucTableTl.kill()
    showNucTable = false
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
  store.calResultList.forEach((element) => {
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
    store.calResultList.splice((selectCalDataIndex + (currentPage - 1) * dataNumPerPage) + 1, 0, {
      energy: undefined,
      efficiency: undefined,
      delta: undefined,
    })
  }
  else {
    store.calResultList.push({
      energy: undefined,
      efficiency: undefined,
      delta: undefined,
    })
  }
}

const removeCalResult = () => {
  if (selectCalDataIndex !== -1)
    store.calResultList.splice(selectCalDataIndex + (currentPage - 1) * dataNumPerPage, 1)
  else store.calResultList.pop()
}

const navToChart = (index: number) => {
  router.push(chartNav[index].path)
  store.selectedChart = index
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
      store.calPointList.push({
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
    store.calPointList.splice(selectCalPointIndex + 1, 0, {
      energy: undefined,
      efficiency: undefined,
    })
  }
  else {
    store.calPointList.push({
      energy: undefined,
      efficiency: undefined,
    })
  }
}

const removeCalPoint = () => {
  if (selectCalPointIndex !== -1)
    store.calPointList.splice(selectCalPointIndex, 1)
  else store.calPointList.pop()
}

const executeCalibrate = async () => {
  if (store.clibrateMethod === '线性') {
    // 效率刻度系数
    const parametersList: Float32Array = await invoke('linear_fit', {
      energy1: store.calPointList[0].energy,
      energy2: store.calPointList[1].energy,
      efficiency1: store.calPointList[0].efficiency,
      efficiency2: store.calPointList[1].efficiency,
    })

    // 效率反算
    const energyList: number[] = []
    store.calResultList.forEach((element) => {
      if (element.energy !== undefined)
        energyList.push(element.energy)
    })

    const effList: number[] = await invoke('eff_cal_line', {
      a1: parametersList[0],
      a2: parametersList[1],
      energyList,
    })

    const curPoint = Array.from({ length: 4096 }, (_, index) => index)
    store.calValue = await invoke('eff_cal_line', {
      a1: parametersList[0],
      a2: parametersList[1],
      a3: parametersList[2],
      energyList: curPoint,
    })

    for (let i = 0; i < effList.length; i++)
      store.calResultList[i].efficiency = parseFloat(effList[i].toFixed(6))
  }
  else {
    let energyList: number[] = []
    const efficiencyList: number[] = []
    store.calPointList.forEach((element) => {
      if (element.energy !== undefined && element.efficiency !== undefined) {
        energyList.push(element.energy)
        efficiencyList.push(element.efficiency)
      }
    })

    // 效率刻度系数
    const parametersList: Float32Array = await invoke('quadratic_fit', {
      en: energyList,
      eff: efficiencyList,
    })

    // 效率反算
    energyList = []
    store.calResultList.forEach((element) => {
      if (element.energy !== undefined)
        energyList.push(element.energy)
    })

    const effList: number[] = await invoke('eff_cal_quad', {
      a1: parametersList[0],
      a2: parametersList[1],
      a3: parametersList[2],
      energyList,
    })

    const curPoint = Array.from({ length: 4096 }, (_, index) => index)
    store.calValue = await invoke('eff_cal_quad', {
      a1: parametersList[0],
      a2: parametersList[1],
      a3: parametersList[2],
      energyList: curPoint,
    })

    for (let i = 0; i < effList.length; i++)
      store.calResultList[i].efficiency = parseFloat(effList[i].toFixed(6))
  }

  await nextTick()
  gsap.from('.resultEfficiency', {
    y: 10,
    opacity: 0,
    duration: 0.5,
    stagger: 0.03,
  })

  if (store.showCalibrateCurve) {
    store.selectedChart = 2
    router.push({ path: '/overview/curve', query: { freshCurve: '1' } })
  }
}
</script>

<template>
  <div flex w-full flex-col p-2 gap-2 text-sm relative>
    <!-- 上部 -->
    <div flex flex-grow gap-2 class="max-h-1/2">
      <!-- 刻度结果表 -->
      <div ref="calResultTable" w="1/2" flex flex-col bg-card rounded-md border="~ card-item">
        <!-- 表头 -->
        <div flex items-center justify-evenly px-2 py-2>
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
            :key="index"
            flex
            flex-1
            items-center
            px-3
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
              {{ store.showSciencedata === '1' ? toScientificNotation(item.efficiency) : item.efficiency }}
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
      <div w="1/2" bg-card rounded-md flex flex-col border="~ card-item">
        <!-- 图操作 -->
        <div flex p-2>
          <div v-for="item, index in chartNav" :key="item.name" bg-input py-1 px-2 :class="[{ 'rounded-md rounded-r-none': index === 0 }, { 'rounded-md rounded-l-none': index === 2 }, { op60: index !== store.selectedChart }]" hover="bg-input-hover" @click="navToChart(index)">
            {{ item.name }}
          </div>
        </div>
        <RouterView v-slot="{ Component }" v-model="store.calValue">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </RouterView>
      </div>
    </div>
    <!-- 下部 -->
    <div flex class="h-1/2" gap-2>
      <div w="1/2" flex gap-2>
        <div class="w-3/5" bg-card rounded-md>
          <!-- 刻度点表 -->
          <div ref="calPointTable" w-full h-full flex flex-col bg-card rounded-md border="~ card-item">
            <!-- 表头 -->
            <div flex items-center justify-evenly px-3 py-2>
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
                v-for="(item, index) in store.calPointList"
                :key="index"
                flex
                flex-1
                items-center
                max-h-9
                px-3
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
                    appearance-none
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
                    appearance-none
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
        <div class="w-2/5" bg-card rounded-md flex flex-col border="~ card-item">
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
      <div w="1/2" bg-card rounded-md border="~ card-item">
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
    <!-- 提示框 -->
    <Toasts ref="toast" message="已选取刻度点" ml="1/3" />
  </div>
  <!-- 核素数据库 -->
  <div ref="nucTable" invisible op0 absolute text-xs w-90 h-90 flex flex-col z-50 border="~ card-item" bg-card rounded-md shadow="xl back">
    <!-- 表头 -->
    <div flex w-full px-1 py-1>
      <div flex bg-back rounded-md px-2 py="0.1rem" items-center gap-2 border="~ card-item">
        <div i-carbon-search />
        <input v-model="searchInput" bg-transparent p-0 focus:outline-none focus:ring-0>
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
    <div v-if="showNucTable" flex-1 overflow-y-auto rounded-md rounded-t-none sb overflow-x-hidden>
      <div
        v-for="(item, index) in store.nucTableData"
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
          {{ item.id }}
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
