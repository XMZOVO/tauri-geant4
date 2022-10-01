<script setup lang="ts">
import { computed } from "vue";
import UInput from "~/components/ui/UInput.vue";

let selectCalDataIndex = $ref<number>(-1);
let selectCalPointIndex = $ref<number>(-1);
let currentPage = $ref(1);
let pageNum = $ref(1);
let currentPageResult = computed(() => {
  pageNum = Math.ceil(calResult.length / dataNumPerPage) || 1;
  if (currentPage == pageNum) {
    return calResult.slice(
      dataNumPerPage * (currentPage - 1),
      calResult.length
    );
  } else {
    return calResult.slice(
      dataNumPerPage * (currentPage - 1),
      dataNumPerPage * (currentPage - 1) + 10
    );
  }
});

const dataNumPerPage = 10;
const calDataEnergyList = $ref<number[]>([
  0.662, 117.32, 133.25, 121.78, 244.69, 344.27, 411.11, 443.96, 778.9, 867.37,
  964.0, 1085.86, 1112.07, 1212.94, 1299.14, 1408.0,
]);
const calResult = $ref<calibrateResult[]>([]);
for (let i = 0; i < 15; i++) {
  calResult.push({
    energy: calDataEnergyList[i],
    efficiency: undefined,
    delta: undefined,
  });
}
const calPoint = $ref<calPoint[]>([]);
calPoint.push(
  ...[
    { energy: 1.166, efficiency: 0.001339 },
    { energy: 1.324, efficiency: 0.001378 },
  ]
);

interface calibrateResult {
  energy?: number;
  efficiency?: number;
  fit?: number;
  delta?: number;
}

interface calPoint {
  energy?: number;
  efficiency?: number;
}

const openDatabaseForm = () => {};
const prePage = () => {
  if (currentPage != 1) {
    currentPage--;
  }
};

const nextPage = () => {
  if (currentPage != pageNum) {
    currentPage++;
  }
};

const exportToCsv = () => {};
const addCalData = () => {};
const removeCalData = () => {};
const pasteFromClipboard = () => {};
</script>

<template>
  <div flex w-full flex-col p-2 gap-2 text-sm>
    <!-- 上部 -->
    <div flex flex-grow gap-2 class="max-h-1/2">
      <!-- 刻度结果表 -->
      <div class="w-1/2" flex flex-col bg-card rounded-md>
        <!-- 表头 -->
        <div flex items-center justify-evenly px-2 py-1>
          <div class="w-1/5">序号</div>
          <div class="w-1/5">能量(MeV)</div>
          <div class="w-1/5">效率</div>
          <div class="w-1/5">Fit</div>
          <div class="w-1/5">Delta</div>
        </div>
        <!-- 表身 -->
        <div flex-grow overflow-y-auto flex flex-col>
          <div
            @click="selectCalDataIndex = index"
            v-for="(item, index) in currentPageResult"
            flex
            flex-1
            items-center
            px-2
            py-1
            class="detectorListItem"
            :class="[
              index == selectCalDataIndex
                ? 'bg-blue hover:bg-blue-light'
                : index % 2
                ? `bg-card-strip hover:bg-card-hover`
                : `bg-card-stripDark hover:bg-card-hover`,
              currentPage == pageNum ? 'max-h-9' : '',
            ]"
          >
            <div class="w-1/5">{{ index + 1 }}</div>
            <div flex items-center>
              <input
                type="text"
                text-sm
                border-none
                w-16
                p-0
                focus:outline-none
                focus:ring-0
                focus:border-none
                rounded-sm
                v-model="item.energy"
                bg-transparent
              />
              <div
                db-btn-out
                cursor-pointer
                text-input-hover
                hover:text-txt
                p-1
                @click="openDatabaseForm"
              >
                <div db-btn-in i-carbon-data-base></div>
              </div>
            </div>
            <div class="w-1/5">{{ item.efficiency }}</div>
            <div class="w-1/5">{{ item.fit }}</div>
            <div class="w-1/5">{{ item.delta }}</div>
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
                <div h-5 w-5 i-ic-round-keyboard-double-arrow-left></div>
              </div>
              <span sr-only>Previous</span>
            </a>
            <div
              px-2
              py-1
              hover="bg-input"
              rounded-md
              cursor-pointer
              v-for="(item, index) in pageNum"
              @click="currentPage = index + 1"
            >
              <a
                w-5
                h-5
                text-txt
                :class="
                  currentPage == index + 1
                    ? 'text-opacity-100'
                    : 'text-opacity-40'
                "
                >{{ item }}</a
              >
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
                <div h-5 w-5 i-ic-round-keyboard-double-arrow-right></div>
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
              <div i-carbon-download w-5 h-5></div>
            </div>
            <!-- 添加 -->
            <div
              rounded-md
              px-2
              py-1
              hover="bg-input"
              cursor-pointer
              @click="addCalData"
            >
              <div i-carbon-add w-5 h-5></div>
            </div>
            <div
              rounded-md
              px-2
              py-1
              hover="bg-input"
              cursor-pointer
              @click="removeCalData"
            >
              <div i-carbon-subtract w-5 h-5></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 绘图 -->
      <div class="w-1/2" bg-card rounded-md flex flex-col></div>
    </div>
    <!-- 下部 -->
    <div flex class="h-1/2" gap-2>
      <div class="w-1/2" flex gap-2>
        <div class="w-3/5" bg-card rounded-md>
          <!-- 刻度点表 -->
          <div w-full h-full flex flex-col bg-card rounded-md>
            <!-- 表头 -->
            <div flex items-center justify-evenly px-2 py-1>
              <div class="w-1/3">序号</div>
              <div class="w-1/3">能量(MeV)</div>
              <div class="w-1/3">效率</div>
            </div>
            <!-- 表身 -->
            <div flex-1 overflow-y-auto flex flex-col>
              <div
                @click="selectCalPointIndex = index"
                v-for="(item, index) in calPoint"
                flex
                flex-1
                items-center
                max-h-9
                px-2
                py-1
                class="detectorListItem"
                :class="[
                  index == selectCalPointIndex
                    ? 'bg-blue hover:bg-blue-light'
                    : index % 2
                    ? `bg-card-strip hover:bg-card-hover`
                    : `bg-card-stripDark hover:bg-card-hover`,
                ]"
              >
                <div class="w-1/3">{{ index + 1 }}</div>
                <div flex items-center class="w-1/3">
                  <input
                    type="text"
                    text-sm
                    border-none
                    w-16
                    p-0
                    focus:outline-none
                    focus:ring-0
                    focus:border-none
                    rounded-sm
                    v-model="item.energy"
                    bg-transparent
                  />
                </div>
                <div class="w-1/3">{{ item.efficiency }}</div>
              </div>
            </div>
            <!-- 表底 -->
            <!-- 操作 -->
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
                <div i-carbon-task-add w-5 h-5></div>
              </div>
              <div flex-1></div>
              <!-- 添加 -->
              <div
                rounded-md
                px-2
                py-1
                hover="bg-input"
                cursor-pointer
                @click="addCalData"
              >
                <div i-carbon-add w-5 h-5></div>
              </div>
              <div
                rounded-md
                px-2
                py-1
                hover="bg-input"
                cursor-pointer
                @click="removeCalData"
              >
                <div i-carbon-subtract w-5 h-5></div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-2/5" bg-card rounded-md></div>
      </div>
      <div class="w-1/2" bg-card rounded-md></div>
    </div>
  </div>
</template>
