<script setup lang="ts">
import { onMounted } from "vue";
import Collapse from "~/components/Collapse.vue";
import { useStore } from "~/stores/store";
import UInput from "~/components/ui/UInput.vue";
import URange from "../../components/ui/URange.vue";
import UCheck from "~/components/ui/UCheck.vue";

let selectedTemplate = $ref(0);

const store = useStore();
const detectorTemplates = $ref(["碘化钠", "溴化镧", "高纯锗"]);
const emit = defineEmits([
  "positionChange",
  "opacityChange",
  "axisVisibleChange",
  "worldVisibleChange",
  "dirLightIntensityChange",
  "dirLightPosChange",
]);

const positionChange = () => {
  emit("positionChange", {
    x: store.detectorPos.x,
    y: store.detectorPos.y,
    z: store.detectorPos.z,
  });
};

const opacityChange = () => {
  emit("opacityChange", store.detectorOpacity);
};

const axisVisibleChange = () => {
  emit("axisVisibleChange", store.showAxes);
};

const worldVisibleChange = () => {
  emit("worldVisibleChange", store.showWorldVolume);
};

const dirLightIntensityChange = () => {
  emit("dirLightIntensityChange", store.dirLightIntensity);
};

const dirLightPosChange = () => {
  emit("dirLightPosChange", {
    x: store.dirLightPos.x,
    y: store.dirLightPos.y,
    z: store.dirLightPos.z,
  });
};
</script>

<template>
  <!-- 设置overflow为hidden防止gsap元素不更新 -->
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="模版" itemCount="2">
      <div flex flex-col gap-2 p-3>
        <div flex>
          <div
            grid="~ cols-3"
            rounded-sm
            w-full
            items-center
            justify-center
            bg-input
          >
            <div
              v-for="(item, index) in detectorTemplates"
              text-center
              whitespace-nowrap
              :class="[
                {
                  'px-2 rounded-l border-r border-card-item': index == 0,
                  ' rounded-r border-l border-card-item': index == 2,
                },
                selectedTemplate == 0 && index == 0
                  ? 'bg-blue-light hover:bg-blue-light'
                  : ' hover:bg-input-hover',
              ]"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div
          flex
          bg-input
          justify-center
          items-center
          px-2
          h-5
          rounded-sm
          w-full
          relative
          hover:bg-input-hover
          :class="[
            {
              'bg-blue-light hover:bg-blue-light': selectedTemplate == -1,
            },
          ]"
        >
          <div i-carbon-add absolute left-2 w-4 h-4></div>
          <button>导入GDML模型</button>
        </div>
      </div></Collapse
    >
    <Collapse title="探测器参数" itemCount="5">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>晶体高度</div>
          <UInput v-model="store.naIDetector.cylinderH">
            <div absolute flex items-center h-full right-1>cm</div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>晶体半径</div>
          <UInput v-model="store.naIDetector.cylinderR">
            <div absolute flex items-center h-full right-1>cm</div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>反射层顶厚</div>
          <UInput v-model="store.naIDetector.reflectTT">
            <div absolute flex items-center h-full right-1>cm</div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>侧壁厚</div>
          <UInput v-model="store.naIDetector.reflectST">
            <div absolute flex items-center h-full right-1>cm</div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>PMT厚</div>
          <UInput v-model="store.naIDetector.pmtT">
            <div absolute flex items-center h-full right-1>cm</div>
          </UInput>
        </div>
      </div>
    </Collapse>
    <Collapse title="变换" itemCount="4">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>坐标X</div>
          <UInput
            v-model="store.detectorPos.x"
            @update:model-value="positionChange"
            ><div absolute flex items-center h-full right-1>cm</div></UInput
          >
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>Y</div>
          <UInput
            v-model="store.detectorPos.y"
            @update:model-value="positionChange"
            ><div absolute flex items-center h-full right-1>cm</div></UInput
          >
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>Z</div>
          <UInput
            v-model="store.detectorPos.z"
            @update:model-value="positionChange"
            ><div absolute flex items-center h-full right-1>cm</div></UInput
          >
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>透明度</div>
          <URange
            v-model="store.detectorOpacity"
            @update:model-value="opacityChange"
          ></URange>
        </div>
      </div>
    </Collapse>
    <Collapse title="场景" itemCount="6">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/3" text-end whitespace-nowrap text-xs>显示</div>
          <div flex gap-1 items-center justify-start flex-grow>
            <UCheck
              v-model="store.showAxes"
              @update:model-value="axisVisibleChange"
            ></UCheck>
            <div>坐标辅助线</div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/3" text-end whitespace-nowrap text-xs></div>
          <div flex gap-1 items-center justify-start flex-grow>
            <UCheck
              v-model="store.showWorldVolume"
              @update:model-value="worldVisibleChange"
            ></UCheck>
            <div>世界卷</div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/3" text-end whitespace-nowrap text-xs>灯光</div>
          <div flex gap-1 items-center justify-start flex-grow>
            <div whitespace-nowrap>强度</div>
            <URange
              v-model="store.dirLightIntensity"
              @update:model-value="dirLightIntensityChange"
            ></URange>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>X</div>
          <UInput
            v-model="store.dirLightPos.x"
            @update:model-value="dirLightPosChange"
            ><div absolute flex items-center h-full right-1>cm</div></UInput
          >
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>Y</div>
          <UInput
            v-model="store.dirLightPos.y"
            @update:model-value="dirLightPosChange"
            ><div absolute flex items-center h-full right-1>cm</div></UInput
          >
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>Z</div>
          <UInput
            v-model="store.dirLightPos.z"
            @update:model-value="dirLightPosChange"
            ><div absolute flex items-center h-full right-1>cm</div></UInput
          >
        </div>
      </div>
    </Collapse>
  </div>
</template>
