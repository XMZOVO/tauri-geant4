<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/tauri";

const greetMsg = ref("");
const name = ref("");

const table1Column = [
  "序号",
  "起始井深(m)",
  "结束井深(m)",
  "环空外经(m)",
  "环空内径(m)",
];
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

onMounted(() => {});

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
    <p class="text-md pb-5 font-bold">分段结果表</p>
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
  <!-- table2 -->
  <div class="h-1/2 overflow-x-auto px-10 py-6">
    <div class="flex items-center gap-2 py-5">
      <p class="text-md font-bold">计算结果表</p>
      <div
        class="tooltip tooltip-right"
        data-tip="流型判别：0代表单向流；1代表泡状流；2代表段塞流；3代表扰状流；4代表环状流"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </div>
    </div>
    <table class="table-compact table w-full">
      <thead>
        <tr>
          <th v-for="item in table2Column">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>1</th>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th v-for="item in table2Column">
            {{ item }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
