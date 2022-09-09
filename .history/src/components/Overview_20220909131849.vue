<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { fetch } from "@tauri-apps/api/http";
import { a1Store, a2Store } from "../stores/efficiencyCalibrationParameters";

import * as echarts from "echarts";

// echarts.use([SVGRenderer, CanvasRenderer]);

const greetMsg = ref("");
const name = ref("");
const a1 = a1Store();
const a2 = a2Store();
let chartDom;
let myChart: echarts.ECharts;
let option: echarts.EChartsOption;
let energyArry: string[];

const table1Column = ["序号", "能量(MeV)", "效率", "拟合", "Delta "];

const tableContent = ref([
  { number: 1, energy: 0.662, efficiency: 0, fit: 0, delta: 0 },
  { number: 2, energy: 1.173, efficiency: 0, fit: 0, delta: 0 },
  { number: 3, energy: 1.332, efficiency: 0, fit: 0, delta: 0 },
  { number: 4, energy: 1.408, efficiency: 0, fit: 0, delta: 0 },
  { number: 5, energy: 0.221, efficiency: 0, fit: 0, delta: 0 },
  { number: 6, energy: 1, efficiency: 0, fit: 0, delta: 0 },
  { number: 7, energy: 1, efficiency: 0, fit: 0, delta: 0 },
  { number: 8, energy: 1, efficiency: 0, fit: 0, delta: 0 },
]);
const energyEfficieny = ref([
  { energy: 1.166, efficiency: 0.001339 },
  { energy: 1.324, efficiency: 0.001378 },
]);

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}

onMounted(async () => {
  const response: any = await fetch("http://localhost:8080/spec", {
    method: "GET",
  });
  const dataStr: string = response.data.data;
  const energyStr: string = response.data.energy;
  const dataArry = dataStr.substring(1, dataStr.length - 1).split(",");
  energyArry = energyStr.substring(1, energyStr.length - 1).split(",");
  dataArry[0] = "0";
  const data = generateData(dataArry, energyArry);

  chartDom = document.getElementById("chart-container")!;
  myChart = echarts.init(chartDom);

  option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      bottom: 90,
    },
    dataZoom: [
      {
        type: "inside",
      },
      {
        type: "slider",
      },
    ],
    xAxis: {
      data: data.categoryData,
      silent: false,
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
      show: false,
    },
    yAxis: {
      splitArea: {
        show: false,
      },
    },
    series: [
      {
        type: "bar",
        data: data.valueData,
        // Set `large` for large data amount
        large: true,
        barWidth: "100%",
        barCategoryGap: "0%",
      },
    ],
  };

  option && myChart.setOption(option);

  function generateData(data: string[], energy: string[]) {
    const categoryData = [];
    const valueData = [];

    for (let i = 0; i < data.length; i++) {
      categoryData.push(energy[i]);
      valueData.push(data[i]);
    }

    return {
      categoryData: categoryData,
      valueData: valueData,
    };
  }
});

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
  const efficiencyData = generateLineFit(energyArry);
  option = {
    xAxis: {
      data: energyArry,
    },
    yAxis: {},
    series: [
      {
        data: efficiencyData,
        type: "line",
        smooth: true,
      },
    ],
  };
  option && myChart.setOption(option);
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
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- table1 -->
    <div class="h-1/2 overflow-x-auto px-10 py-6">
      <div class="flex items-center gap-3 pb-5">
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
        <a class="tab tab-active tab-bordered">能谱</a>
        <a class="tab tab-bordered">展宽谱</a>
        <a class="tab tab-bordered">刻度曲线</a>
      </div>

      <!--  -->
      <div class="flex h-4/6 items-center justify-center overflow-x-visible">
        <div id="chart-container" class="h-full w-full"></div>
        <!-- <canvas id="myChart" class="h-full w-full"></canvas> -->
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
