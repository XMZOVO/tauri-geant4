<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { fetch } from "@tauri-apps/api/http";

import * as echarts from "echarts";

type EChartsOption = echarts.EChartsOption;

const greetMsg = ref("");
const name = ref("");

const table1Column = ["序号", "能量(keV)", "效率(?)", "拟合(?)", "Delta(?)"];
const table2Column = [
  "压井时间(s)",
  "井口位置流型判别",
  "溢流段高度(m)",
  "溢流段内总气相体积(r)",
  "套压值(MPa)",
  "指定位置流型判别",
  "井筒环空循环压耗",
];

const tableContent = ref([
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5],
]);

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}

onMounted(async () => {
  var chartDom = document.getElementById("chart-container")!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  const response: any = await fetch("http://localhost:8080/spec", {
    method: "GET",
  });
  const str: string = response.data.data;
  const dataArry = str.substring(1, str.length - 1).split(",");
  dataArry[0] = "0";
  const data = generateData(dataArry.length, dataArry);

  option = {
    title: {
      text: "能谱",
      left: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        saveAsImage: {
          pixelRatio: 2,
        },
      },
    },
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

  function generateData(count: number, data: any) {
    const categoryData = [];
    const valueData = [];

    for (let i = 0; i < count; i++) {
      categoryData.push(i);
      valueData.push(data[i]);
    }

    return {
      categoryData: categoryData,
      valueData: valueData,
    };
  }
});

let i = 20;
const addData = () => {
  i -= 1;
  tableContent.value.push([1, 2, 3, 4, 5]);
  if (i < 0) {
    return;
  }
  setTimeout(() => {
    addData();
  }, 1000);
};
</script>

<template>
  <!-- <div class="card">
    <input id="greet-input" v-model="name" placeholder="输入..." />
    <button type="button" @click="greet()">Greet</button>
  </div> -->

  <!-- <p>{{ greetMsg }}</p> -->
  <!-- table1 -->
  <div class="h-1/3 overflow-x-auto px-10 py-6">
    <div class="flex items-center gap-3 pb-5">
      <p class="text-lg font-bold">效率计算结果表</p>

      <div class="dropdown">
        <label tabindex="0" class="btn btn-sm m-1">效率刻度</label>
        <div
          tabindex="0"
          class="card dropdown-content card-compact w-96 bg-base-100 p-2 shadow"
        >
          <div class="card-body">
            <div class="form-control">
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  class="input input-bordered"
                />
                <button class="btn btn-square">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
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
          <th v-for="data in item">{{ data }}</th>
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
  <div
    class="flex h-1/3 items-center justify-center overflow-x-visible px-10 py-6"
  >
    <div id="chart-container" class="h-full w-full"></div>
  </div>
  <div class="h-1/3"></div>
</template>
