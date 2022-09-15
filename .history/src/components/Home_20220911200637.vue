<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import path from "path";
import { exit } from "@tauri-apps/api/process";
import { fetch } from "@tauri-apps/api/http";

const router = useRouter();
const greetMsg = ref("");
const name = ref("");
let specFile = ref("");
let JSRootPath = ref("/JsRoot720/");
const btnWait = ref("");
const activeDetector = ref(0);

let detectorSrc = ref(
  JSRootPath.value +
    "index.htm?nobrowser&file=http://localhost:8080/file/G4Backend/build/rootFiles/test.root&item=Default;1&opt=ssao;transp60"
);

const parametersNames = ref([
  { name: "探测器结构", checked: true },
  { name: "放射源信息", checked: false },
]);
const selectedName = ref("钻井液性能");
const detectorProperties = ref([
  { name: "晶体高度", value: 7.6, unit: "cm" },
  { name: "晶体半径", value: 3.8, unit: "cm" },
  { name: "反射层顶部厚度", value: "0.3", unit: "cm" },
  { name: "PMT厚度", value: 3, unit: "cm" },
]);
const radioactiveProperties = ref([
  { name: "放射性同位素", value: "Co60", unit: "" },
  { name: "3", value: 20, unit: "" },
  { name: "4", value: 0.02, unit: "" },
  { name: "5", value: 10, unit: "" },
]);
const detectorList = ref([
  {
    name: "碘化钠探测器",
    percent: 40,
    description: "Sodium Iodide Detector",
    img: "NaI.png",
  },
  {
    name: "溴化澜探测器",
    percent: 100,
    description: "Lanthanum Bromide Detector",
    img: "LB.png",
  },
  {
    name: "高纯锗探测器",
    percent: 60,
    description: "High Purity Germanium Detector",
    img: "HPGe.png",
  },
]);
const paticleParameters = ref([
  { name: "粒子数", value: 10000, unit: "pcs" },
  { name: "探测器距离", value: 25, unit: "cm" },
]);

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}

onMounted(async () => {});

const parametersInfoChanged = (name: String) => {
  if (name == "探测器结构") {
    parametersNames.value[0].checked = true;
    parametersNames.value[1].checked = false;
  } else {
    parametersNames.value[0].checked = false;
    parametersNames.value[1].checked = true;
  }
};

const executeCalculate = async () => {
  if (paticleParameters.value[0].value > 10000000) {
    alert("粒子数过大");
    return;
  }
  btnWait.value = "loading";
  const response = await fetch("http://localhost:8080/g4", {
    method: "POST",
    query: {
      ch: detectorProperties.value[0].value.toString(),
      cr: detectorProperties.value[1].value.toString(),
      rtt: detectorProperties.value[2].value.toString(),
      num: paticleParameters.value[0].value.toString(),
    },
  }).then((res) => {
    btnWait.value = "";
    router.push({ path: "/Overview" });
  });
};

const refreshDetector = async () => {
  detectorSrc.value = " ";
  await fetch("http://localhost:8080/gdml", {
    method: "GET",
    query: {
      ch: detectorProperties.value[0].value.toString(),
      cr: detectorProperties.value[1].value.toString(),
      rtt: detectorProperties.value[2].value.toString(),
      pmt: detectorProperties.value[3].value.toString(),
    },
  }).then(() => {
    // let iframe: any = document.getElementById("iframe");
    // iframe.contentWindow.location.reload(true);
    detectorSrc.value =
      JSRootPath.value +
      "index.htm?nobrowser&file=http://localhost:8080/file/G4Backend/build/rootFiles/wtest.root&item=Default;1&opt=ssao;transp60";
  });
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
      <div class="h-3/7 card w-full shadow-xl">
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
      <div class="h-3/7 flex space-x-5">
        <!-- 1 -->
        <div class="card w-1/2 bg-base-100 shadow-xl">
          <div class="card-body gap-3">
            <p class="text-sm font-semibold">探测器模版选择</p>
            <!-- item -->
            <div class="flex h-full flex-col justify-between">
              <div
                v-for="(item, index) in detectorList"
                class="flex cursor-pointer items-center justify-between rounded-xl py-3 px-3 hover:bg-base-300"
              >
                <div class="flex items-center gap-2">
                  <img
                    :src="`/src/assets/${item.img}`"
                    class="h-14 w-14 rounded-xl bg-cyan-500 p-1"
                  />
                  <div class="flex flex-col">
                    <p class="text-sm font-semibold">{{ item.name }}</p>
                    <p class="text-xs text-neutral">
                      {{ item.description }}
                    </p>
                    <div class="badge badge-primary badge-xs p-2">
                      {{ index == 0 ? "已实现" : "未实现" }}
                    </div>
                  </div>
                </div>
                <!-- <div
                  class="radial-progress text-xs text-primary"
                  :style="
                    '--value: ' +
                    item.percent +
                    '; --size: 3.5rem; --thickness: 6px'
                  "
                >
                  {{ item.percent }}%
                </div> -->
              </div>
            </div>
            <btn class="btn rounded-xl"> 更多模版</btn>
          </div>
        </div>
        <!-- 2 -->
        <div class="card w-1/2 bg-base-100 shadow-xl">
          <div class="card-body p-2">
            <iframe
              :src="detectorSrc"
              frameborder="0"
              class="h-full w-full rounded-lg"
            ></iframe>
            <!-- <div class="h-full w-full bg-black" id="drawing"></div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="w-1/3 flex-col space-y-5 px-8 pt-6">
      <!-- 帮助 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
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
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
          <label class="font-bold">帮助与教程</label>
        </div>
        <div class="badge badge-info">+99</div>
      </div>
      <!-- 帮助 -->
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
                    <p class="text-sm font-bold">相关参数</p>
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
                  class="card dropdown-content rounded-box w-full bg-base-100 shadow"
                >
                  <div class="card-body space-y-3">
                    <p class="font-bold">设置相关参数</p>
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
                    <div class="flex items-center">
                      <p class="font-bold">
                        设置{{
                          activeDetector == 0 ? "碘化钠" : "高纯锗"
                        }}探测器参数
                      </p>
                      <button class="btn btn-xs" @click="refreshDetector">
                        刷新探测器模型
                      </button>
                    </div>
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
                    v-model="item.value"
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
