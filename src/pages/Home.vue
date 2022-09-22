<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, reactive } from "vue";
import { useMouseInElement, useElementBounding } from "@vueuse/core";
import { InputBindingApi } from "tweakpane";
import gsap from "gsap";
import Base3D from "../core/Base3D";
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

const detectorParameters = ref([
  { name: "变形", isCollapse: true },
  { name: "param2", isCollapse: true },
  { name: "param3", isCollapse: true },
  { name: "param4", isCollapse: true },
  { name: "param5", isCollapse: true },
  { name: "param6", isCollapse: true },
  { name: "param7", isCollapse: true },
]);

let base3D: Base3D;
let isLoaded = false;
let intersectedObject: THREE.Object3D | null;
let detector: THREE.Group;
let vrmlScene: THREE.Group;
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let dirLight: THREE.DirectionalLight;
let ambient: THREE.AmbientLight;
let timer: number;

interface CollapseItem {
  name: string;
  isCollapse: boolean;
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
  setTimeout(async () => {
    base3D = new Base3D(ThreeDom._value);
    await base3D.init();
    console.log(base3D.detector);
  }, 300);
});

onUnmounted(() => {
  // gui.pane.hidden = true;
  base3D.renderer.renderLists.dispose();
  while (base3D.scene.children.length > 0) {
    base3D.scene.remove(base3D.scene.children[0]);
  }
  cancelAnimationFrame(base3D.timer);
});

// ----- -----

const expand = (item: CollapseItem) => {
  console.log(item.isCollapse);
  if (item.isCollapse) {
    gsap.to("#content" + item.name, { height: "16.75rem", duration: 0.2 });
    gsap.to("#title" + item.name, {
      borderBottomLeftRadius: "0rem",
      duration: 0.1,
    });
    gsap.to("#title" + item.name, {
      borderBottomRightRadius: "0rem",
      duration: 0.1,
    });

    gsap.to("#arrow" + item.name, {
      rotation: 90,
      duration: 0.2,
    });
  } else {
    gsap.to("#content" + item.name, { height: "0rem", duration: 0.2 });
    gsap.to("#title" + item.name, {
      borderBottomLeftRadius: "0.375rem",
      duration: 0.2,
    });
    gsap.to("#title" + item.name, {
      borderBottomRightRadius: "0.375rem",
      duration: 0.2,
    });
    gsap.to("#arrow" + item.name, {
      rotation: 0,
      duration: 0.2,
    });
  }

  item.isCollapse = !item.isCollapse;
};
</script>

<template>
  <div class="flex w-full h-full bg-back">
    <!-- 中间 -->
    <div class="flex flex-grow p-3">
      <div class="w-full h-full">
        <canvas ref="ThreeDom"></canvas>
      </div>
    </div>
    <!-- 侧边 -->
    <div class="w-52 p-3 pl-0 flex flex-col">
      <!-- 卡1 -->
      <div class="h-max-1/2 h-1/2 w-full bg-card items-stretch rounded-md mb-2">
        <div class="rounded-md">2</div>
      </div>
      <!-- 卡2 -->
      <div
        class="h-max-1/2 h-1/2 w-full pt-2 bg-card overflow-x-hidden overflow-y-auto no-scrollbar rounded-md space-y-1 select-none"
      >
        <div
          class="w-11/12 mx-auto"
          v-for="(item, index) in detectorParameters"
        >
          <!-- 标题 -->
          <div
            :id="`title` + item.name"
            @click="expand(item)"
            class="flex items-center justify-between w-full h-7 text-txt bg-item"
            :class="
              item.isCollapse ? `rounded-md` : `rounded-md rounded-b-none`
            "
          >
            <div class="flex items-center gap-1 ml-2">
              <div
                :id="`arrow` + item.name"
                class="i-heroicons-outline-chevron-right h-3 w-3"
              ></div>
              <label class="text-xs font-sans text">{{ item.name }}</label>
            </div>
            <div class="i-carbon-draggable rotate-90 mr-2"></div>
          </div>
          <!-- 内容 -->
          <div
            :id="`content` + item.name"
            class="w-full h-0 justify-center flex flex-col items-center bg-item text-txt rounded-b-md relative overflow-hidden"
          >
            <p class="absolute top-1">hidden label</p>
            <p class="absolute top-1/3">hidden label</p>
            <p class="absolute bottom-1">hidden label</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
