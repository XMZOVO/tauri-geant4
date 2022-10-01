<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Base3D from "~/three/Base3D";
import gsap from "gsap";
import { Vector3 } from "three";

const navTab = ref(null);
const navTabTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } });
const cardTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } });
const router = useRouter();
const ThreeDom = ref() as any;
const cardTabBarItem = $ref([
  { name: "探测器几何", icon: "i-carbon-3d-mpr-toggle", path: "/" },
  { name: "粒子枪", icon: "i-carbon-webhook", path: "/particle" },
  { name: "其他", icon: "i-carbon-lightning", path: "/execute" },
]);

let strucListSelect = $ref(-1);
let base3D: Base3D;
let gdmlStructureList = $ref<GdmlStructure[]>([]);

interface GdmlStructure {
  name: string;
  visible: boolean;
}
onMounted(async () => {
  cardTl.from(".card", { x: "100%", stagger: 0.1, delay: 0.3 });
  cardTl.play();
  // 初始化three
  base3D = new Base3D(ThreeDom.value);
  await base3D.init();
  gsap.from(".canvas", { opacity: 0, duration: 1 });
  // 填充gdml结构列表
  for (const item in base3D.detector) {
    if (item == "world")
      gdmlStructureList.unshift({ name: item, visible: true });
    else gdmlStructureList.push({ name: item, visible: true });
  }
  await nextTick();
  gsap.from(".structureListItem", { x: "200%", stagger: 0.05 });
});

onUnmounted(() => {
  // dispose threejs资源
  base3D.renderer.renderLists.dispose();
  base3D.renderer.dispose();
  base3D.renderer.forceContextLoss();
  while (base3D.scene.children.length > 0) {
    base3D.scene.remove(base3D.scene.children[0]);
  }
  cancelAnimationFrame(base3D.timer);
});

const selecListItem = (index: number) => {
  strucListSelect = index;
  base3D.highlightSelect(gdmlStructureList[index].name);
};

const structVisibleChange = (item: GdmlStructure) => {
  base3D.visibleChange(item.name);
  item.visible = !item.visible;
};

const navToAction = (index: number) => {
  navTabTl
    .to(navTab.value, { scaleX: 0, transformOrigin: "right" })
    .to(navTab.value, {
      y: index * 100 + "%",
      duration: 0,
    })
    .to(navTab.value, { scaleX: 1, transformOrigin: "right" }, "<");
  navTabTl.play();
  router.push(cardTabBarItem[index].path);
};

const positionChange = (pos: { x: number; y: number; z: number }) => {
  base3D.positionChange(new Vector3(pos.x, pos.y, pos.z));
};

const opacityChange = (opacity: number) => {
  base3D.opacityChange(opacity);
};

const axisVisibleChange = (visible: boolean) => {
  base3D.axisVisibleChange(visible);
};

const worldVisibleChange = (visible: boolean) => {
  base3D.worldVisibleChange(visible);
};

const dirLightIntensityChange = (intensity: number) => {
  base3D.dirLightIntensityChange(intensity);
};

const dirLightPosChange = (pos: { x: number; y: number; z: number }) => {
  base3D.dirLightPosChange(new Vector3(pos.x, pos.y, pos.z));
};
</script>

<template>
  <div flex w-full>
    <!-- 中部 -->
    <div flex-grow>
      <!-- 渲染窗口 -->
      <canvas ref="ThreeDom" class="canvas"></canvas>
    </div>
    <!-- 右侧 -->
    <div w-60 flex flex-col>
      <!-- 卡1 -->
      <div class="h-1/2 card" p-2 pb-1>
        <div bg-card h-full rounded-md overflow-x-hidden>
          <div grid grid-cols-1 text-xs>
            <div
              v-for="(item, index) in gdmlStructureList"
              px-2
              flex
              items-center
              gap-1
              py-1
              class="structureListItem"
              :class="[
                index == strucListSelect
                  ? 'bg-blue'
                  : index % 2
                  ? `bg-card-strip`
                  : `bg-card-stripDark`,
              ]"
            >
              <div
                flex-grow
                flex
                h-full
                :class="index == 0 ? `pl-2` : `pl-6`"
                @click="selecListItem(index)"
              >
                <div i-carbon-caret-right></div>
                <div>{{ item.name.slice(0, 10) }}</div>
              </div>

              <div
                @click="structVisibleChange(item)"
                h-3
                w-3
                :class="[
                  item.visible
                    ? 'i-teenyicons-eye-solid'
                    : 'i-teenyicons-eye-closed-solid',
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 卡2 -->
      <div class="h-1/2 card" p-2 pt-1>
        <div h-full bg-card rounded-md flex>
          <!-- 侧边tab栏 -->
          <div w-8 bg-card-tabBar rounded-r-none rounded-md>
            <div flex flex-col items-center relative>
              <!-- 指示条 -->
              <div
                ref="navTab"
                class="h-1/3"
                bg-card
                absolute
                w-8
                rounded="r-none md"
              ></div>
              <div
                p-1
                v-for="(item, index) in cardTabBarItem"
                @click="navToAction(index)"
              >
                <div
                  :class="[
                    item.icon,
                    {
                      'text-yellow': index == 0,
                      'text-red': index == 1,
                      'text-green': index == 2,
                    },
                  ]"
                ></div>
              </div>
            </div>
          </div>
          <!-- tab内容页 -->
          <div flex-grow p-2 overflow-auto>
            <RouterView
              @positionChange="positionChange"
              @opacityChange="opacityChange"
              @axisVisibleChange="axisVisibleChange"
              @worldVisibleChange="worldVisibleChange"
              @dirLightIntensityChange="dirLightIntensityChange"
              @dirLightPosChange="dirLightPosChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
