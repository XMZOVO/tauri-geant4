<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { fetch } from "@tauri-apps/api/http";

import * as echarts from "echarts";

type EChartsOption = echarts.EChartsOption;

const greetMsg = ref("");
const name = ref("");
let specLoaded = ref(false);

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
  specLoaded.value = true;
  const str: string = response.data.data;
  const dataArry = str.substring(1, str.length - 1).split(",");
  dataArry[0] = "0";
  const data = generateData(dataArry.length, dataArry);

  option = {
    title: {
      text: echarts.format.addCommas(dataArry.length) + " Data",
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
  <div class="h-1/2 overflow-x-auto px-10 py-6">
    <p class="text-md pb-5 font-bold">效率结果表</p>
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
      <tfoot>
        <tr>
          <th v-for="item in table1Column">
            {{ item }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
  <!-- Chart -->
  <div
    class="flex h-1/2 items-center justify-center overflow-x-auto px-10 py-6"
  >
    <div v-show="specLoaded" id="chart-container" class="h-full w-full"></div>

    <!-- <div role="status" v-if="!specLoaded">
      <svg
        aria-hidden="true"
        class="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        ></path>
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        ></path>
      </svg>
      <span class="sr-only">Loading...</span>
    </div> -->
  </div>
</template>
