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

  const data: any = await fetch("http://localhost:8080/spec", {
    method: "GET",
  });

  const dataArry = Array.from(data.data.data);

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
      },
    ],
  };

  option && myChart.setOption(option);

  function generateData(count: number) {
    let baseValue = Math.random() * 1000;
    let time = +new Date(2011, 0, 1);
    let smallBaseValue: number;

    function next(idx: number) {
      smallBaseValue =
        idx % 30 === 0
          ? Math.random() * 700
          : smallBaseValue + Math.random() * 500 - 250;
      baseValue += Math.random() * 20 - 10;
      return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000);
    }

    const categoryData = [];
    const valueData = [];

    for (let i = 0; i < count; i++) {
      categoryData.push(i);
      valueData.push(next(i).toFixed(2));
      time += 1000;
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
  <div class="h-1/2 overflow-x-auto px-10 py-6">
    <div id="chart-container" class="h-full w-full"></div>
  </div>
</template>
