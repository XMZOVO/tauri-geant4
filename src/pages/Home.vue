<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, reactive, nextTick, markRaw } from "vue";
import { useMouseInElement, useElementBounding } from "@vueuse/core";
import { InputBindingApi } from "tweakpane";
import gsap from "gsap";
import Base3D from "../core/Base3D";
import DetectorTransSetting from "../components/detectorSetting/DetectorTransSetting.vue";
import SceneSetting from "../components/detectorSetting/SceneSetting.vue";
import ParticleTransSetting from "../components/particleSetting/ParticleTransSetting.vue";
import Source from "../components/particleSetting/Source.vue";
import TemplateSetting from "../components/detectorSetting/TemplateSetting.vue";
import { Vector3 } from "three";

const ThreeDom = ref(null) as any;
const mouse = reactive(useMouseInElement(ThreeDom));
const elSizeInfo = reactive(useElementBounding(ThreeDom));
const highlightedMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});
const pickableObjects: THREE.Mesh[] = [];
const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } =
  {};
const guiInput: InputBindingApi<unknown, unknown>[] = [];
const selectedIndex = ref<number>();

const allParameters = $ref<CollapseItem[]>([
  // 场景

  {
    name: "模版",
    component: markRaw(TemplateSetting),
    isCollapse: true,
    itemCounts: 2,
  },
  {
    name: "变换",
    component: markRaw(DetectorTransSetting),
    isCollapse: true,
    itemCounts: 3,
  },
  {
    name: "场景",
    component: markRaw(SceneSetting),
    isCollapse: true,
    itemCounts: 2,
  },
  {
    name: "param3",
    component: "TransformSetting",
    isCollapse: true,
    itemCounts: 2,
  },
  {
    name: "param4",
    component: "TransformSetting",
    isCollapse: true,
    itemCounts: 2,
  },
  {
    name: "param5",
    component: "TransformSetting",
    isCollapse: true,
    itemCounts: 2,
  },
  {
    name: "param6",
    component: "TransformSetting",
    isCollapse: true,
    itemCounts: 2,
  },
  // 粒子枪
  {
    name: "变换",
    component: markRaw(ParticleTransSetting),
    isCollapse: true,
    itemCounts: 3,
  },
  {
    name: "粒子源",
    component: markRaw(Source),
    isCollapse: true,
    itemCounts: 2,
  },
  // 执行
  {
    name: "输出结果",
    component: "TransformSetting",
    isCollapse: true,
    itemCounts: 2,
  },
]);

const detectorParameters = allParameters.slice(0, 7);

const particleParameters = allParameters.slice(7, 9);

const simulationParameters = allParameters.slice(9, 10);

const tabActions = ref([
  { name: "探测器几何", icon: "i-carbon-3d-mpr-toggle" },
  { name: "粒子枪", icon: "i-carbon-webhook" },
  { name: "其他", icon: "i-carbon-lightning" },
]);

let base3D: Base3D;
let structureList = $ref<DetectorScructure[]>([]);
let activeSettingTab = $ref(0);

interface CollapseItem {
  name: string;
  component: any;
  isCollapse: boolean;
  itemCounts: number;
}

interface DetectorScructure {
  name: string;
  visible: boolean;
}

//交互事件
// const render = () => {
//   if (isLoaded) {
//     pointer.x = (mouse.elementX / elSizeInfo.width) * 2 - 1;
//     pointer.y = -(mouse.elementY / elSizeInfo.height) * 2 + 1;
//     raycaster.setFromCamera(pointer, camera);
//     const intersects = raycaster.intersectObjects(pickableObjects);

//     if (intersects.length > 0) {
//       intersectedObject = intersects[0].object;
//     } else {
//       intersectedObject = null;
//     }

//     pickableObjects.forEach((o: THREE.Mesh, i) => {
//       if (intersectedObject && intersectedObject.name === o.name) {
//         pickableObjects[i].material = highlightedMaterial;
//       } else {
//         pickableObjects[i].material = originalMaterials[o.name];
//       }
//     });
//   }
// };

onMounted(async () => {
  // gui.pane.hidden = false;
  gsap.from(".side", {
    x: "200%",
    duration: 0.5,
    opacity: 0,
    stagger: 0.2,
    delay: 0.3,
  });
  setTimeout(async () => {
    base3D = new Base3D(ThreeDom._value);
    await base3D.init();
    for (const item in base3D.detector) {
      if (item == "world") structureList.unshift({ name: item, visible: true });
      else structureList.push({ name: item, visible: true });
    }

    await nextTick();
    gsap.from(".canvas", { opacity: 0, duration: 0.8 });
    gsap.from(".struct-list", {
      duration: 0.1,
      x: 100,
      opacity: 0,
      delay: 0.3,
      stagger: 0.02,
      ease: "power4",
    });
  }, 300);

  const item = document.querySelectorAll(".collapse");
  item.forEach((item, index) => {
    const collapseTl = gsap
      .timeline({ paused: true })
      .to(item.querySelector(".title"), {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        duration: 0,
      })
      .to(
        item.querySelector(".content"),
        {
          height:
            (1 + 1.75 * allParameters[index].itemCounts).toString() + "rem",
          duration: 0.15,
        },
        "<"
      )
      .to(item.querySelector(".arrow"), { rotation: 90, duration: 0.2 }, "<");
    item.querySelector(".title")!.addEventListener("mousedown", () => {
      if (allParameters[index].isCollapse) {
        collapseTl.play();
      } else {
        collapseTl.reverse();
      }
      allParameters[index].isCollapse = !allParameters[index].isCollapse;
    });
  });
});

onUnmounted(() => {
  // gui.pane.hidden = true;
  base3D.renderer.renderLists.dispose();
  base3D.renderer.dispose();
  base3D.renderer.forceContextLoss();
  while (base3D.scene.children.length > 0) {
    base3D.scene.remove(base3D.scene.children[0]);
  }
  cancelAnimationFrame(base3D.timer);
});

// ----- -----

const tabChange = async (index: number) => {
  activeSettingTab = index;
  await nextTick();
  const tl = gsap
    .timeline({ paused: true })
    .from(".collapse", { y: 450, stagger: 0.03, duration: 0.2 })
    .to(
      ".tab-item",
      {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.15,
      },
      "<"
    )
    .to(".tab-item", { y: index.toString() + "00%", duration: 0 })
    .to(".tab-item", { scaleX: 1, duration: 0.15 }, "<");
  tl.play();
};

const selectItem = (index: number) => {
  selectedIndex.value = index;
  base3D.highlightSelect(structureList[index].name);
};

const structVisibleChange = (item: DetectorScructure) => {
  if (item.name == "world") {
    const visible = item.visible;
    structureList.forEach((element) => {
      element.visible = !visible;
    });
  } else {
    item.visible = !item.visible;
  }
  base3D.visibleChange(item.name);
};

// ------ emits ------

const axeVisibleChange = (flag: boolean) => {
  base3D.axeVisibleChange(flag);
};

const worldVisibleChange = (flag: boolean) => {
  base3D.worldVisibleChange(flag);
};

const positionChange = (position: Vector3) => {
  base3D.positionChange(position);
};
</script>

<template>
  <div class="flex w-full h-full bg-back">
    <!-- 中间 -->
    <div class="flex flex-grow p-3">
      <div class="w-full h-full">
        <!-- 渲染窗口 -->
        <canvas class="canvas" ref="ThreeDom"></canvas>
      </div>
    </div>
    <!-- 侧边 -->
    <div class="w-60 p-2 pl-0 flex flex-col">
      <!-- 卡1 -->
      <div
        class="side h-max-1/2 h-1/2 w-full bg-card items-stretch rounded-md mb-2 overflow-auto no-scrollbar"
      >
        <div class="grid grid-cols-1 gap-0 rounded-md">
          <!-- 结构item -->
          <div
            v-for="(item, index) in structureList"
            class="struct-list hover:bg-grey"
            :class="[
              ' w-full text-txt px-2 text-xs flex items-center',
              selectedIndex == index
                ? 'bg-blue hover:bg-blue'
                : index % 2
                ? 'bg-strip'
                : 'bg-stripDark',
              index == 0 ? 'pl-2' : 'pl-6',
            ]"
          >
            <div
              class="flex items-center gap-1 flex-grow py-1"
              @click="selectItem(index)"
            >
              <div class="i-carbon-caret-right"></div>
              <div class="select-none cursor-default">
                {{ item.name.slice(0, 10) }}
              </div>
            </div>
            <!-- 显示按钮 -->
            <div
              @click="structVisibleChange(item)"
              :class="
                item.visible
                  ? 'i-teenyicons-eye-solid'
                  : 'i-teenyicons-eye-closed-solid'
              "
            ></div>
          </div>
        </div>
      </div>
      <!-- 卡2 -->
      <div
        class="side h-max-1/2 h-1/2 w-full overflow-x-hidden overflow-y-auto no-scrollbar rounded-md select-none flex bg-e-black"
      >
        <!-- tab切换栏 -->
        <div class="w-8 h-full">
          <div class="relative">
            <!-- tab选中背景 -->
            <div
              class="tab-item absolute top-0 right-0 bg-card z-0 w-full rounded-md rounded-r-none h-1/3"
            ></div>
            <!-- tab item -->
            <div
              class="p-1 flex justify-center items-center cursor-pointer z-50 py-2"
              v-for="(item, index) in tabActions"
              @click="tabChange(index)"
            >
              <div :alt="item.name" :class="item.icon"></div>
            </div>
          </div>
        </div>
        <div
          class="space-y-1 flex-grow pt-2 bg-card overflow-auto no-scrollbar"
        >
          <!-- 模型场景选项卡 -->
          <div
            v-show="activeSettingTab == 0"
            class="w-11/12 mx-auto collapse"
            v-for="(item, index) in detectorParameters"
          >
            <!-- 标题 -->
            <div
              class="title flex items-center justify-between w-full h-7 text-txt bg-item rounded-md"
            >
              <div class="flex items-center gap-1 ml-2">
                <div
                  class="arrow i-heroicons-outline-chevron-right h-3 w-3"
                ></div>
                <label class="text-xs font-sans text">{{ item.name }}</label>
              </div>
              <div class="i-carbon-draggable rotate-90 mr-2"></div>
            </div>
            <!-- 内容 -->
            <div
              class="content w-full h-0 justify-start flex flex-col items-center bg-item text-txt rounded-b-md relative overflow-hidden"
            >
              <!-- <TransformSetting :is=""></TransformSetting> -->
              <component
                :ref="item.name"
                @axeVisibleChange="axeVisibleChange"
                @worldVisibleChange="worldVisibleChange"
                @positionChange="positionChange"
                :is="item.component"
              ></component>
            </div>
          </div>
          <!-- 粒子源选项卡 -->
          <div
            v-show="activeSettingTab == 1"
            class="w-11/12 mx-auto collapse"
            v-for="(item, index) in particleParameters"
          >
            <!-- 标题 -->
            <div
              class="title flex items-center justify-between w-full h-7 text-txt bg-item rounded-md"
            >
              <div class="flex items-center gap-1 ml-2">
                <div
                  class="arrow i-heroicons-outline-chevron-right h-3 w-3"
                ></div>
                <label class="text-xs font-sans text">{{ item.name }}</label>
              </div>
              <div class="i-carbon-draggable rotate-90 mr-2"></div>
            </div>
            <!-- 内容 -->
            <div
              class="content w-full h-0 justify-start flex flex-col items-center bg-item text-txt rounded-b-md relative overflow-y-hidden"
            >
              <!-- <TransformSetting :is=""></TransformSetting> -->
              <component :ref="item.name" :is="item.component"></component>
            </div>
          </div>
          <!-- 执行选项卡 -->
          <div
            v-show="activeSettingTab == 2"
            class="flex flex-col items-center justify-center gap-2"
          >
            <div
              class="w-11/12 mx-auto collapse"
              v-for="(item, index) in simulationParameters"
            >
              <!-- 标题 -->
              <div
                class="title flex items-center justify-between w-full h-7 text-txt bg-item rounded-md"
              >
                <div class="flex items-center gap-1 ml-2">
                  <div
                    class="arrow i-heroicons-outline-chevron-right h-3 w-3"
                  ></div>
                  <label class="text-xs font-sans text">{{ item.name }}</label>
                </div>
                <div class="i-carbon-draggable rotate-90 mr-2"></div>
              </div>
              <!-- 内容 -->
              <div
                class="content w-full h-0 justify-start flex flex-col items-center bg-item text-txt rounded-b-md relative overflow-hidden"
              >
                <!-- <TransformSetting :is=""></TransformSetting> -->
                <component :ref="item.name" :is="item.component"></component>
              </div>
            </div>
            <div
              class="bg-item text-txt h-7 w-11/12 items-center justify-center text-xs flex rounded-md hover:bg-grey relative"
            >
              <div
                class="i-carbon-lightning bg-txt w-3 h-3 absolute left-2"
              ></div>
              <button>开始计算</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
