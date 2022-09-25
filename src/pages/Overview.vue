<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick } from "vue";
import { fetch } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api/tauri";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { count } from "console";
import gsap from "gsap";

const tableHead = ["序号", "能量(MeV)", "探测效率", "拟合", "Delta"];
const calData = reactive<calibrateData[]>([]);
const energyList = $ref<number[]>([
  0.662, 117.32, 133.25, 121.78, 244.69, 344.27, 411.11, 443.96, 778.9, 867.37,
  964.0, 1085.86, 1112.07, 1212.94, 1299.14, 1408.0,
]);
const dataNumPerPage = 10;
const calPoint = reactive<calPoint[]>([]);
const totalParticleNumber = 1000000;
const simulateInformation = [
  { name: "模拟总粒子数", value: 1e6 },
  { name: "探测器模版", value: "NaI探测器" },
  { name: "放射源", value: "Co60" },
  { name: "模拟总用时", value: "00:02:20" },
];

let fillPointIndex = -1;
let enableMousePick = $ref(false);
let currentPage = $ref(1);
let pageNum = $ref(1);
let currentClickData: specPoint = {};
let currentPageData = computed(() => {
  pageNum = Math.ceil(calData.length / dataNumPerPage) || 1;
  if (currentPage == pageNum) {
    return calData.slice(dataNumPerPage * (currentPage - 1), calData.length);
  } else {
    return calData.slice(
      dataNumPerPage * (currentPage - 1),
      dataNumPerPage * (currentPage - 1) + 10
    );
  }
});

interface calibrateData {
  number: number;
  energy?: number;
  efficiency?: number;
  fit?: number;
  delta?: number;
}

interface calPoint {
  energy?: number;
  efficiency?: number;
}

interface specData {
  data: number[];
  energy: number[];
}

interface specPoint {
  count?: number;
  enenrgy?: number;
}

for (let i = 0; i < 15; i++) {
  calData.push({
    number: i + 1,
    energy: energyList[i],
    efficiency: undefined,
    delta: undefined,
  });
}

calPoint.push({ energy: 1.166, efficiency: 0.001339 });
calPoint.push({ energy: 1.324, efficiency: 0.001378 });

onMounted(async () => {
  const response: any = await fetch("http://localhost:8080/spec", {
    method: "GET",
    timeout: 30,
  });
  const countList = response.data.data.split(",").map(function (item: any) {
    return parseInt(item, 10);
  });
  const energyList = response.data.energy.split(",").map(function (item: any) {
    return parseFloat(item);
  });

  countList[0] = 0;
  // if (true) return;
  const specData = generateData(countList, energyList);
  // 初始化图表
  let root = am5.Root.new("myChart");
  // 设置主题
  const myTheme = am5.Theme.new(root);
  myTheme.rule("Label").setAll({
    fill: am5.color("#E5E5E5"),
    fontSize: "0.75rem",
  });
  root.setThemes([myTheme]);

  // 创建Chart
  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panY: false,
      panX: false,
      wheelY: "zoomX",
      layout: root.verticalLayout,
    })
  );

  // 创建Y轴
  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  // 创建X轴
  let xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      categoryField: "energy",
    })
  );
  xAxis.data.setAll(specData);

  // 创建Series
  let series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Spectrum",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      categoryXField: "energy",
      tooltip: am5.Tooltip.new(root, {
        labelText: "计数:{count}\n能量:{energy}",
      }),
    })
  );
  series.columns.template.setAll({
    width: am5.percent(100),
  });
  series.data.setAll(specData);

  // 添加图例
  // let legend = chart.children.push(am5.Legend.new(root, {}));
  // legend.data.setAll(chart.series.values);

  // 添加十字光标
  chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  let cursor = chart.get("cursor")!;
  cursor.lineX.setAll({
    stroke: am5.color("#E5E5E5"),
    strokeWidth: 1,
  });

  cursor.lineY.setAll({
    stroke: am5.color("#E5E5E5"),
    strokeWidth: 1,
  });
  cursor.selection.setAll({
    fill: am5.color("#E5E5E5"),
    fillOpacity: 0.2,
  });

  // 点击事件
  series.columns.template.events.on("click", function (ev) {
    if (enableMousePick) {
      enableMousePick = false;
      const dataContext = ev.target.dataItem!.dataContext as any;
      calPoint[fillPointIndex].energy = dataContext.energy as number;
      calPoint[fillPointIndex].efficiency =
        (dataContext.count as number) / totalParticleNumber;
      console.log(calPoint[fillPointIndex]);
      fillPointIndex = -1;
    }
  });
});

const createChart = () => {};

const generateData = (data: number[], energy: number[]) => {
  let outData = [];
  for (let i = 0; i < data.length; i++) {
    outData.push({
      energy: parseFloat(energy[i].toFixed(3)),
      count: parseFloat(data[i].toFixed(3)),
    });
  }
  return outData;
};

const nextPage = () => {
  if (currentPage != pageNum) {
    currentPage++;
  }
};

const prePage = () => {
  if (currentPage != 1) {
    currentPage--;
  }
};

const addCalData = () => {
  calData.push({ number: calData.length + 1 });
};

const addCalPoint = () => {
  calPoint.push({});
};

const pickPoint = (index: number) => {
  enableMousePick = true;
  fillPointIndex = index;
};

const executeCalculation = async () => {
  //效率刻度系数
  const parametersList: Float32Array = await invoke("linear_fit", {
    energy1: calPoint[0].energy,
    energy2: calPoint[1].energy,
    efficiency1: calPoint[0].efficiency,
    efficiency2: calPoint[1].efficiency,
  });

  //效率反算
  let energyList: number[] = [];
  calData.forEach((element) => {
    energyList.push(element.energy!);
  });

  const effList: number[] = await invoke("eff_cal_line", {
    a1: parametersList[0],
    a2: parametersList[1],
    energyList: energyList,
  });
  for (let i = 0; i < effList.length; i++) {
    calData[i].efficiency = parseFloat(effList[i].toFixed(6));
  }

  await nextTick();
  gsap.from(".effieicncy", {
    y: 10,
    opacity: 0,
    duration: 0.5,
    stagger: 0.03,
  });
};
</script>

<template>
  <div
    class="flex p-2 flex-col text-center h-full text-txt bg-back select-none gap-2"
  >
    <!-- 上半 -->
    <div class="flex flex-grow gap-2">
      <!-- 表 -->
      <div class="w-1/2 flex flex-col bg-card rounded-md">
        <!-- table -->
        <div class="overflow-y-auto no-scrollbar rounded-md flex-grow">
          <table class="w-full h-full">
            <thead>
              <tr class="bg-input-grey">
                <th
                  v-for="item in tableHead"
                  :class="item == `能量(MeV)` ? `pr-5` : ``"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody class="overflow-y-auto no-scrollbar">
              <tr
                v-for="(item, index) in currentPageData"
                :class="[
                  'border-b border-input-grey border-opacity-40 text-sm',
                ]"
              >
                <td>{{ item.number }}</td>
                <td>
                  <input
                    class="text-sm p-0 text-left border-opacity-20 focus:ring-0 border-none bg-card rounded-sm w-20"
                    type="number"
                    v-model="item.energy"
                  />
                </td>
                <td class="effieicncy w-24">
                  <div class="w-full mx-auto">
                    {{ item.efficiency }}
                  </div>
                </td>
                <td>{{ item.fit }}</td>
                <td>{{ item.delta }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 表底 -->
        <div class="flex items-center px-4 py-2">
          <!-- 分页栏 -->
          <nav class="flex items-center space-x-2 flex-grow">
            <a
              class="inline-flex items-center gap-2 rounded-md cursor-pointer"
              @click="prePage()"
            >
              <div class="px-2 py-1 hover:bg-input-grey rounded-md">
                <div
                  class="h-5 w-5 i-ic-round-keyboard-double-arrow-left"
                ></div>
              </div>
              <span class="sr-only">Previous</span>
            </a>
            <div
              class="px-2 py-1 hover:bg-input-grey rounded-md cursor-pointer"
              v-for="(item, index) in pageNum"
            >
              <a class="w-5 h-5">{{ item }}</a>
            </div>
            <a
              class="inline-flex items-center gap-2 rounded-md cursor-pointer"
              @click="nextPage()"
            >
              <span class="sr-only">Next</span>
              <div
                class="rounded-md px-2 py-1 hover:bg-input-grey cursor-pointer"
              >
                <div
                  class="h-5 w-5 i-ic-round-keyboard-double-arrow-right"
                ></div>
              </div>
            </a>
          </nav>
          <!-- 保存 -->
          <div
            class="rounded-md px-2 py-1 hover:bg-input-grey cursor-pointer"
            @click=""
          >
            <div class="i-carbon-download w-5 h-5"></div>
          </div>
          <!-- 添加 -->
          <div
            class="rounded-md px-2 py-1 hover:bg-input-grey cursor-pointer"
            @click="addCalData"
          >
            <div class="i-carbon-add w-5 h-5"></div>
          </div>
          <div
            class="rounded-md px-2 py-1 hover:bg-input-grey cursor-pointer"
            @click=""
          >
            <div class="i-carbon-subtract w-5 h-5"></div>
          </div>
        </div>
      </div>

      <!-- 图 -->
      <div class="flex-grow overflow-hidden rounded-md flex flex-col bg-card">
        <div class="flex text-sm py-1 px-2">
          <button
            class="border border-input-grey bg-input-grey px-2 rounded-md rounded-r-none py-1"
          >
            原始谱
          </button>
          <button
            class="border border-input-grey px-2 rounded-md rounded-l-none py-1 flex items-center gap-1"
          >
            展宽谱
            <div
              class="tooltip tooltip-right"
              data-tip="展宽系数 a:0.1 b:0.2 c:0.3"
            >
              <div
                class="i-carbon-information text-input-hover hover:text-txt"
              ></div>
            </div>
          </button>
        </div>
        <div id="myChart" class="flex-grow"></div>
      </div>
    </div>
    <!-- 下半 -->
    <div class="h-1/2 flex bg-back gap-2 text-txt">
      <!-- 刻度区 -->
      <div class="bg-back w-1/2 h-full rounded-md flex gap-2">
        <div class="flex flex-col flex-grow">
          <!-- 表 -->
          <div
            class="bg-card rounded-md rounded-b-none no-scrollbar overflow-y-auto flex flex-col justify-between flex-grow"
          >
            <table class="w-full overflow-y-auto">
              <thead>
                <tr class="bg-input-grey text-sm">
                  <th class="py-1">能量(MeV)</th>
                  <th>探测效率</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody class="overflow-y-auto">
                <tr
                  class="border-b-input-grey border-b border-opacity-40"
                  v-for="(item, index) in calPoint"
                >
                  <td>
                    <input
                      class="bg-card border-none p-0 w-20 px-2 text-sm focus:ring-0 focus:border-none focus:outline-none text-left"
                      v-model="item.energy"
                    />
                  </td>
                  <td>
                    <input
                      class="bg-card border-none p-0 w-20 px-2 text-sm focus:ring-0 focus:border-none focus:outline-none text-left"
                      v-model="item.efficiency"
                    />
                  </td>
                  <td class="flex items-center justify-center w-full">
                    <div
                      @click="pickPoint(index)"
                      class="i-carbon-touch-1 my-1 text-input-hover cursor-pointer hover:text-txt"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 表操作 -->
          <div class="flex pb-3 px-3 bg-card rounded-b-md">
            <!-- 剪切板粘贴 -->
            <div
              class="px-2 py-1 hover:bg-input-grey rounded-md cursor-pointer"
            >
              <div class="i-carbon-task-add"></div>
            </div>
            <div class="flex-grow"></div>
            <!-- 添加点 -->
            <div
              class="px-2 py-1 hover:bg-input-grey rounded-md cursor-pointer"
            >
              <div class="i-carbon-add" @click="addCalPoint"></div>
            </div>
            <div
              class="px-2 py-1 hover:bg-input-grey rounded-md cursor-pointer"
            >
              <div class="i-carbon-subtract" @click=""></div>
            </div>
          </div>
        </div>
        <!-- 下卡2 -->
        <div class="w-1/2 bg-card rounded-md">
          <div class="flex flex-col h-full py-3 px-3 text-sm justify-between">
            <!-- 刻度设置 -->
            <div class="flex flex-col gap-2">
              <!-- 刻度方式 -->
              <div class="flex items-center">
                <div class="w-1/2">效率刻度方式</div>
                <select
                  class="w-1/2 text-sm p-0 px-2 py-1 rounded-md border-none bg-back focus:border-none focus:outline-none focus:ring-0 hover:bg-opacity-60"
                >
                  <option>线性</option>
                  <option>二次</option>
                  <option>多项式</option>
                </select>
              </div>
              <!-- 刻度完成显示 -->
              <div class="flex items-center">
                <div class="w-1/2">显示刻度曲线</div>
                <input
                  type="checkbox"
                  class="rounded-sm bg-input-grey border-item"
                />
              </div>
            </div>
            <div class="flex gap-2 justify-end">
              <button
                class="px-2 py-1 bg-item hover:bg-input-grey rounded-md"
                @click="executeCalculation"
                titlle="刻度"
              >
                刻度
              </button>
              <button class="px-2 py-1 bg-item hover:bg-input-grey rounded-md">
                取消刻度
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 信息展示区 -->
      <div class="bg-card flex-grow h-full rounded-md p-10 text-sm">
        <div class="grid grid-cols-2">
          <div class="flex flex-col w-full gap-3">
            <div class="flex w-full" v-for="item in simulateInformation">
              <div class="w-1/2 text-start">{{ item.name }}:</div>
              <div class="w-1/2 text-start">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
