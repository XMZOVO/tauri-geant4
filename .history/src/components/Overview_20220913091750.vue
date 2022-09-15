<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { fetch } from "@tauri-apps/api/http";
import { a1Store, a2Store } from "../stores/efficiencyCalibrationParameters";
import { config } from "process";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// echarts.use([SVGRenderer, CanvasRenderer]);

const greetMsg = ref("");
const name = ref("");
const a1 = a1Store();
const a2 = a2Store();
// let chartDom;
// let chartDom2: any;

// let myChart: echarts.ECharts;
// let myChart2: echarts.ECharts;

// let option: echarts.EChartsOption;
// let option2: echarts.EChartsOption;
let energyArry: string[];

const table1Column = ["序号", "能量(MeV)", "效率", "拟合", "Delta "];
const tableContent = ref([
  { number: 1, energy: 0.662, efficiency: 0, fit: 0, delta: 0 },
  { number: 2, energy: 1.173, efficiency: 0, fit: 0, delta: 0 },
  { number: 3, energy: 1.332, efficiency: 0, fit: 0, delta: 0 },
  { number: 4, energy: 1.408, efficiency: 0, fit: 0, delta: 0 },
  { number: 5, energy: 0.221, efficiency: 0, fit: 0, delta: 0 },
  { number: 6, energy: 0.569, efficiency: 0, fit: 0, delta: 0 },
  { number: 7, energy: 1.598, efficiency: 0, fit: 0, delta: 0 },
]);
const energyEfficieny = ref([
  { energy: 1.166, efficiency: 0.001339 },
  { energy: 1.324, efficiency: 0.001378 },
]);

const shownChartIndex = ref(0);
let efficiencyData;
let specData;

onMounted(async () => {
  const response: any = await fetch("http://localhost:8080/spec", {
    method: "GET",
  });
  const dataStr: string = response.data.data;
  const energyStr: string = response.data.energy;
  const dataArry = dataStr.substring(1, dataStr.length - 1).split(",");
  energyArry = energyStr.substring(1, energyStr.length - 1).split(",");
  dataArry[0] = "0";
  specData = generateData(dataArry, energyArry);

  let root = am5.Root.new("chartdiv");

  root.setThemes([am5themes_Animated.new(root)]);

  let chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panY: false,
      panX: false,
      wheelY: "zoomX",
      layout: root.verticalLayout,
    })
  );

  // Define data

  // Create Y-axis
  let yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  // Create X-Axis
  let xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      tooltip: am5.Tooltip.new(root, {}),
      renderer: am5xy.AxisRendererX.new(root, {}),
    })
  );

  // Create series
  let series1 = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      valueXField: "energy",
    })
  );
  series1.data.setAll(specData);

  // Add legend
  let legend = chart.children.push(am5.Legend.new(root, {}));
  legend.data.setAll(chart.series.values);

  // Add cursor
  chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));

  //初始化charts
  // chartDom = document.getElementById("chart-container")!;
  // myChart = echarts.init(chartDom);
  // chartDom2 = document.getElementById("chart-container2")!;
  // myChart2 = echarts.init(chartDom2);

  // option = {
  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       type: "shadow",
  //     },
  //   },
  //   grid: {
  //     bottom: 90,
  //   },
  //   dataZoom: [
  //     {
  //       type: "inside",
  //     },
  //     {
  //       type: "slider",
  //     },
  //   ],
  //   xAxis: {
  //     data: specData.energyData,
  //     silent: false,
  //     splitLine: {
  //       show: false,
  //     },
  //     splitArea: {
  //       show: false,
  //     },
  //     show: false,
  //   },
  //   yAxis: {
  //     splitArea: {
  //       show: false,
  //     },
  //   },
  //   series: [
  //     {
  //       type: "bar",
  //       data: specData.valueData,
  //       // Set `large` for large data amount
  //       large: true,
  //       barWidth: "100%",
  //       barCategoryGap: "0%",
  //     },
  //   ],
  // };

  // option && myChart.setOption(option);

  // //自适应charts尺寸
  // window.onresize = () => {
  //   myChart.resize();
  //   myChart2.resize();
  // };
});

const generateData = (data: string[], energy: string[]) => {
  // let ene: number[] = [];
  // let cut: number[] = [];
  // let outData = { ene, cut };
  let outData = [];

  for (let i = 0; i < data.length; i++) {
    outData.push({ energy: parseFloat(energy[i]), count: parseFloat(data[i]) });

    // outData.ene.push(parseFloat(energy[i]));
    // outData.cut.push(parseFloat(data[i]));
  }

  return outData;
};

const caibrateEfficiency = async () => {
  //效率刻度系数
  const parametersList: Float32Array = await invoke("linear_fit", {
    energy1: energyEfficieny.value[0].energy,
    energy2: energyEfficieny.value[1].energy,
    efficiency1: energyEfficieny.value[0].efficiency,
    efficiency2: energyEfficieny.value[1].efficiency,
  });
  a1.set(parametersList[0]);
  a2.set(parametersList[1]);

  //效率反算
  let energyList: number[] = [];
  tableContent.value.forEach((element) => {
    energyList.push(element.energy);
  });

  const effList: number[] = await invoke("eff_cal_line", {
    a1: a1.value,
    a2: a2.value,
    energyList: energyList,
  });
  for (let i = 0; i < effList.length; i++) {
    tableContent.value[i].efficiency = effList[i];
  }

  //绘制曲线
  efficiencyData = generateLineFit(energyArry);
  // option2 = {
  //   xAxis: {
  //     data: energyArry,
  //   },
  //   yAxis: {},
  //   series: [
  //     {
  //       data: efficiencyData,
  //       type: "line",
  //       smooth: true,
  //     },
  //   ],
  // };
  // option2 && myChart2.setOption(option2);

  shownChartIndex.value = 2;
};

const generateLineFit = (energyList: string[]): number[] => {
  let efficiencyList: number[] = [];
  for (let i = 0; i < energyList.length; i++) {
    let efficiency: number = Math.exp(
      a1.value + a2.value * Math.log(parseFloat(energyList[i]))
    );
    efficiencyList.push(efficiency);
  }
  return efficiencyList;
};

const toSpec = () => {
  shownChartIndex.value = 0;
};

const toFWHM = () => [(shownChartIndex.value = 1)];

const toCalibrateChart = () => {
  shownChartIndex.value = 2;
};
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- table1 -->
    <div class="h-1/2 overflow-x-auto px-10 py-6">
      <div class="flex items-center justify-between pb-5">
        <div class="flex items-center gap-3">
          <p class="text-lg font-bold">效率计算结果表</p>
          <div class="dropdown">
            <label tabindex="0" class="btn btn-sm m-1">效率刻度</label>
            <div
              tabindex="0"
              class="card dropdown-content card-compact w-max bg-base-100 p-2 shadow"
            >
              <div class="card-body">
                <!-- 刻度选项 -->
                <div class="felx space-y-3">
                  <div class="form-control" v-for="item in energyEfficieny">
                    <div class="input-group">
                      <input
                        type="text"
                        :value="item.efficiency"
                        placeholder="能量点对应效率"
                        class="input input-bordered w-full"
                      />
                      <button class="btn btn-square">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="btn w-full" @click="caibrateEfficiency">刻度</div>
                </div>
                <!-- 刻度选项 -->
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="flex items-center gap-3">
          <div class="tooltip tooltip-left" data-tip="打印">
            <button class="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                />
              </svg>
            </button>
          </div>
          <div class="tooltip tooltip-left" data-tip="保存">
            <button class="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- 按钮 -->
      </div>
      <table class="table-compact table w-full">
        <thead>
          <tr>
            <th v-for="item in table1Column">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableContent">
            <th v-for="(data, index) in item" :key="index">
              <input
                type="number"
                placeholder=""
                v-model="item[index]"
                class="input input-ghost input-xs max-w-xs focus:bg-base-100 focus:outline-none"
              />
            </th>
          </tr>
        </tbody>
        <!-- <tfoot>
          <tr>
            <th v-for="item in table1Column">
              {{ item }}
            </th>
          </tr>
        </tfoot> -->
      </table>
    </div>
    <!-- Chart -->
    <div class="h-1/2 flex-col">
      <div class="tabs px-10">
        <a
          @click="toSpec"
          class="tab tab-bordered"
          :class="{ [`tab-active`]: shownChartIndex == 0 }"
          >能谱</a
        >
        <a
          @click="toFWHM"
          class="tab tab-bordered"
          :class="{ [`tab-active`]: shownChartIndex == 1 }"
          >展宽谱</a
        >
        <a
          @click="toCalibrateChart"
          class="tab tab-bordered"
          :class="{ [`tab-active`]: shownChartIndex == 2 }"
          >刻度曲线</a
        >
      </div>

      <!--  -->
      <div class="flex h-5/6 items-center justify-center">
        <div id="chartdiv" class="h-full w-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
