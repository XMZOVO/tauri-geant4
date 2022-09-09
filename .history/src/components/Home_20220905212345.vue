<script setup lang="ts" type="module">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import path from "path";
import { exit } from "@tauri-apps/api/process";

const router = useRouter();
const greetMsg = ref("");
const name = ref("");
let specFile = ref("");
let JSRootPath = "/JsRoot720/";

let detectorSrc = ref(
  JSRootPath +
    "index.html?nobrowser&file=http://localhost:8080/rootExample&item=Default;1&opt=ssao;BACK;transp60"
);

const parametersNames = ref([
  { name: "探测器结构", checked: true },
  { name: "放射源信息", checked: false },
]);
const selectedName = ref("钻井液性能");
const detectorProperties = ref([
  { name: "晶体高度", value: 7.6, unit: "cm" },
  { name: "晶体半径", value: 3.8, unit: "cm" },
  { name: "反射层材料", value: "Al2O3", unit: "" },
  { name: "PMT厚度", value: 3, unit: "cm" },
]);
const radioactiveProperties = ref([
  { name: "放射性同位素", value: "Co60", unit: "" },
  { name: "粒子数", value: 1000, unit: "" },
  { name: "3", value: 20, unit: "" },
  { name: "4", value: 0.02, unit: "" },
  { name: "5", value: 10, unit: "" },
]);
const overflowParam = ref([
  { name: "组分含H2S", percent: 0 },
  { name: "组分含CH4", percent: 100 },
  { name: "组分含CO2", percent: 0 },
]);
const paticleParameters = ref([
  { name: "粒子数", value: 10000, unit: "pcs" },
  { name: "探测器距离", value: 25, unit: "cm" },
]);
const btnWait = ref("");

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}

const parametersInfoChanged = (name: String) => {
  if (name == "探测器结构") {
    parametersNames.value[0].checked = true;
    parametersNames.value[1].checked = false;
  } else {
    parametersNames.value[0].checked = false;
    parametersNames.value[1].checked = true;
  }
};

const executeCalculate = () => {
  btnWait.value = "loading";

  setTimeout(() => {
    router.push({ path: "/Overview" });
    btnWait.value = "";
  }, 1500);
};

const exitApp = async () => {
  await exit(1);
};
</script>

<template>
  <!-- <div class="card">
    <input id="greet-input" v-model="name" placeholder="Enter a name..." />
    <button type="button" @click="greet()">Greet</button>
  </div>

  <p>{{ greetMsg }}</p> -->

  <div class="flex h-full w-full">
    <div class="w-2/3 space-y-12 border-r border-base-300 py-6 px-16">
      <div class="h-auto">
        <span class="block text-lg font-normal">Hi Roy,</span>
        <span class="block text-3xl font-bold"
          >This is my last War &#128075;</span
        >
      </div>
      <div class="card h-2/5 w-full shadow-xl">
        <div class="card-body justify-between">
          <div class="flex justify-between">
            <p class="card-title text-sm">相关信息</p>
            <!-- 选择框 -->
            <!-- <div class="form-control w-1/3 max-w-xs">
              <select
                class="select select-bordered focus:outline-none"
                @change="parametersInfoChanged($event)"
              >
                <option v-for="item in parametersNames">{{ item }}</option>
              </select>
            </div> -->
            <div class="btn-group">
              <input
                v-for="item in parametersNames"
                type="radio"
                name="options"
                :data-title="item.name"
                class="btn"
                :checked="item.checked"
                @change="parametersInfoChanged(item.name)"
              />
            </div>
          </div>
          <!-- 统计信息 -->
          <div
            class="stats stats-vertical overflow-hidden shadow lg:stats-horizontal"
          >
            <div
              class="stat"
              v-if="parametersNames[0].checked"
              v-for="item in detectorProperties"
            >
              <div class="stat-title">{{ item.name }}</div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-desc">{{ item.unit }}</div>
            </div>
            <div
              class="stat"
              v-if="parametersNames[1].checked"
              v-for="item in radioactiveProperties"
            >
              <div class="stat-title">{{ item.name }}</div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-desc">{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部双卡片 -->
      <div class="flex h-2/5 space-x-5">
        <!-- 1 -->
        <div class="card w-1/2 bg-base-100 shadow-xl">
          <div class="card-body">
            <p class="text-sm font-semibold">溢流物相关参数</p>
            <!-- item -->
            <div
              v-for="item in overflowParam"
              class="flex items-center justify-between"
            >
              <img src="../assets/icon.png" class="h-12 w-12" />
              <p class="text-sm font-semibold">{{ item.name }}</p>
              <div
                class="radial-progress text-xs text-primary"
                :style="
                  '--value: ' +
                  item.percent +
                  '; --size: 3.5rem; --thickness: 6px'
                "
              >
                {{ item.percent }}%
              </div>
            </div>
          </div>
        </div>
        <!-- 2 -->
        <div class="card w-1/2 bg-base-100 shadow-xl">
          <div class="card-body">
            <iframe
              :src="detectorSrc"
              frameborder="0"
              class="h-72 w-full rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="w-1/3 flex-col justify-between space-y-5 px-8">
      <!-- 卡1 -->
      <div class="flex space-x-5">
        <div class="card w-full overflow-visible bg-base-100 shadow-xl">
          <div class="card-body p-5">
            <div class="flex-col space-y-5">
              <p class="text-md font-bold">参数设置</p>

              <!-- 溢流物 -->
              <div class="dropdown-left dropdown w-full">
                <div
                  tabindex="0"
                  class="flex items-center justify-between rounded-xl px-2 py-1 duration-300 hover:cursor-pointer hover:bg-primary hover:text-base-100"
                >
                  <img src="../assets/icon.png" class="h-14 w-14 rounded-xl" />
                  <div class="flex items-center">
                    <p class="text-sm font-bold">溢流物相关参数</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </div>
                <!-- 浮动窗口 -->
                <div
                  tabindex="0"
                  class="card dropdown-content rounded-box w-96 bg-base-100 shadow"
                >
                  <div class="card-body space-y-3">
                    <p class="font-bold">设置溢流物相关参数</p>
                    <div
                      v-for="item in overflowParam"
                      class="flex items-center justify-between"
                    >
                      <p>{{ item.name }}</p>
                      <p class="font-bold text-primary">{{ item.percent }}%</p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        v-model="item.percent"
                        class="range range-xs w-1/2"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 溢流物 -->
              <!-- 钻井液 -->
              <div class="dropdown-left dropdown w-full">
                <div
                  tabindex="0"
                  class="flex items-center justify-between rounded-xl px-2 py-1 duration-300 hover:cursor-pointer hover:bg-primary hover:text-base-100"
                >
                  <img src="../assets/icon.png" class="h-14 w-14 rounded-xl" />
                  <div class="flex items-center">
                    <p class="text-sm font-bold">探测器相关参数</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </div>
                <!-- 浮动窗口 -->
                <div
                  tabindex="0"
                  class="card dropdown-content rounded-box w-96 bg-base-100 shadow"
                >
                  <div class="card-body space-y-1">
                    <p class="font-bold">设置探测器参数</p>
                    <div
                      v-for="item in detectorProperties"
                      class="form-control"
                    >
                      <label class="label">
                        <span class="label-text">{{ item.name }}</span>
                      </label>
                      <label class="input-group">
                        <input
                          type="text"
                          v-model="item.value"
                          class="input input-bordered w-3/4 focus:outline-none"
                        />
                        <span class="w-1/4">{{ item.unit }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 钻井液 -->
              <!-- 节流压 -->
              <div class="dropdown-left dropdown w-full">
                <div
                  tabindex="0"
                  class="flex items-center justify-between rounded-xl px-2 py-1 duration-300 hover:cursor-pointer hover:bg-primary hover:text-base-100"
                >
                  <img src="../assets/icon.png" class="h-14 w-14 rounded-xl" />
                  <div class="flex items-center">
                    <p class="text-sm font-bold">粒子枪参数参数</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </div>
                <!-- 浮动窗口 -->
                <div
                  tabindex="0"
                  class="card dropdown-content rounded-box w-96 bg-base-100 shadow"
                >
                  <div class="card-body space-y-3">
                    <p class="font-bold">设置粒子枪参数</p>
                    <div
                      v-for="item in radioactiveProperties"
                      class="form-control"
                    >
                      <label class="label">
                        <span class="label-text">{{ item.name }}</span>
                      </label>
                      <label class="input-group">
                        <input
                          type="text"
                          v-model="item.value"
                          class="input input-bordered w-3/4 focus:outline-none"
                        />
                        <span class="w-1/4">{{ item.unit }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 节流压 -->
            </div>
          </div>
        </div>
      </div>
      <!-- 卡2 -->
      <div class="flex space-x-5">
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body space-y-5">
            <p class="text-md font-bold">模拟计算</p>
            <div>
              <div v-for="item in paticleParameters" class="form-control">
                <label class="label">
                  <span class="label-text">{{ item.name }}</span>
                </label>
                <label class="input-group">
                  <input
                    type="text"
                    placeholder="0.01"
                    :value="item.value"
                    class="input input-bordered w-full focus:outline-none"
                  />
                  <span>{{ item.unit }}</span>
                </label>
              </div>
            </div>
            <!-- 计算 -->
            <button :class="'btn w-full ' + btnWait" @click="executeCalculate">
              模拟
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
