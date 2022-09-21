<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, reactive } from "vue";
import { useMouseInElement, useElementBounding } from "@vueuse/core";

import { renderer, scene, axesHelper } from "../core/renderer";
// import * as gui from "../core/gui";
import { camera } from "../core/camera";
import { controls } from "../core/orbit-control";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
//three.js的MTL加载器会把mtl文件的Tr属性的值(n)解析为透明度(1-n)
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
//这个版本的VRML加载器无法解析Anchor节点,更换github新版
import { VRMLLoader } from "threejs-vrml-loader";

import { GDMLLoader } from "threejs-gdml-loader";
import { InputBindingApi } from "tweakpane";
import gsap from "gsap";

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
const mtlLoader = new MTLLoader();
const vrmlLoader = new VRMLLoader();
const gdmlLoader = new GDMLLoader();
const jsonLoader = new OBJLoader();

const detectorParameters = ref([
  { name: "变形", isCollapse: true },
  { name: "param2", isCollapse: true },
  { name: "param3", isCollapse: true },
  { name: "param4", isCollapse: true },
  { name: "param5", isCollapse: true },
  { name: "param6", isCollapse: true },
  { name: "param7", isCollapse: true },
]);

let isLoaded = false;
let intersectedObject: THREE.Object3D | null;
let detector: THREE.Group;
let vrmlScene: THREE.Group;
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let dirLight: THREE.DirectionalLight;
let ambient: THREE.AmbientLight;
let timer: number;
let loader = new OBJLoader();

interface CollapseItem {
  name: string;
  isCollapse: boolean;
}

//灯光
const createLight = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 50, 0);
  scene.add(dirLight);

  ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
};

const loadObjAsset = (asset: string) => {
  mtlLoader.load("src/assets/model/obj/test111.mtl", (materials) => {
    materials.preload();
    for (const t in materials.materials) {
      materials.materials[t].transparent = true;
      materials.materials[t].opacity = 0.6;
    }
    loader.setMaterials(materials);

    loader.load("src/assets/model/obj/" + asset + ".obj", function (object) {
      detector = object;
      scene.add(object);
      controls.reset();
      animate();
    });
  });
};

//加载GDML模型
const loadGDMLAsset = async (asset: string) => {
  const object: THREE.Group = await gdmlLoader.loadAsync(
    "src/assets/model/gdml/" + asset + ".gdml"
  );
  // detector = object;
  // pickableObjects.push(object.children[3] as THREE.Mesh);
  // originalMaterials[object.children[3].name] = (
  //   object.children[3] as THREE.Mesh
  // ).material;
  scene.add(object);
  isLoaded = true;
};

//加载VRML场景
const loadVRMLAsset = async (asset: string) => {
  const object = await vrmlLoader.loadAsync(
    "src/assets/model/vrml/" + asset + ".wrl"
  );
  scene.add(object);
};

const loadJsonAssets = async (asset: string) => {
  jsonLoader.load("src/assets/geometry.json", (obj) => {
    scene.add(obj);
  });
};

//创建GUI事件
// const createGuiItem = () => {
//   //透明度事件
//   gui.opacity.on("change", (ev) => {
//     detector.children.forEach((element: any) => {
//       element.material.opacity = ev.value;
//     });
//   });
//   //随机颜色事件
//   gui.randomColor.on("change", (ev) => {
//     if (ev.value) {
//       detector.children.forEach((element: any) => {
//         element.material.emissive.setHex(Math.random() * 0xffffff);
//       });
//     } else {
//       detector.children.forEach((element: any) => {
//         element.material.emissive.setHex(0x000000);
//       });
//     }
//   });
//   //预览结果事件
//   gui.viewRsult.on("click", () => {
//     scene.remove(detector);
//     loadVRMLAsset("g4_01");
//   });
//   //灯光强度
//   gui.dirlightIntens.on("change", (ev) => {
//     dirLight.intensity = ev.value;
//   });
//   //坐标显示
//   gui.axeVisible.on("change", (ev) => {
//     axesHelper.visible = ev.value;
//   });
// };

//刷新画布渲染尺寸
const updateRenderer = () => {
  camera.aspect = elSizeInfo.width / elSizeInfo.height;
  camera.updateProjectionMatrix();
  renderer.setSize(elSizeInfo.width, elSizeInfo.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// const onPointerMove = (event: PointerEvent) => {
//   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
// };

//交互事件
const render = () => {
  if (isLoaded) {
    pointer.x = (mouse.elementX / elSizeInfo.width) * 2 - 1;
    pointer.y = -(mouse.elementY / elSizeInfo.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(pickableObjects);

    if (intersects.length > 0) {
      intersectedObject = intersects[0].object;
    } else {
      intersectedObject = null;
    }

    pickableObjects.forEach((o: THREE.Mesh, i) => {
      if (intersectedObject && intersectedObject.name === o.name) {
        pickableObjects[i].material = highlightedMaterial;
      } else {
        pickableObjects[i].material = originalMaterials[o.name];
      }
    });

    //   if (intersectedObject != intersects[0].object) {
    //     if (intersectedObject)
    //       intersectedObject.material.emissive.setHex(intersectedObject.currentHex);

    //     intersectedObject = intersects[0].object;
    //     intersectedObject.currentM = intersectedObject.material.emissive.getHex();
    //     intersectedObject.material.emissive.setHex(0xff0000);
    //   }
    // } else {
    //   if (intersectedObject)
    //     intersectedObject.material.emissive.setHex(intersectedObject.currentHex);

    //   intersectedObject = null;
  }
};

const animate = () => {
  timer = requestAnimationFrame(animate);
  // gui.fpsGraph.begin();
  controls.update();
  // gui.fpsGraph.end();
  // render();
  renderer.render(scene, camera);
};

onMounted(() => {
  // gui.pane.hidden = false;
  //挂载Dom
  ThreeDom._value.appendChild(renderer.domElement);
  updateRenderer();
  //更新摄像机aspect
  camera.aspect = elSizeInfo.width / elSizeInfo.height;
  camera.updateProjectionMatrix();

  window.addEventListener("resize", updateRenderer);
});

onUnmounted(() => {
  // gui.pane.hidden = true;
  renderer.renderLists.dispose();
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  cancelAnimationFrame(timer);
});

createLight();
loadGDMLAsset("Par02FullDetector");
// loadVRMLAsset("g4_01");
// createGuiItem();
animate();

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
  <div class="flex w-full h-full bg-dark-800">
    <!-- 中间 -->
    <div class="flex flex-grow p-3">
      <div ref="ThreeDom" class="w-full h-full"></div>
    </div>
    <!-- 侧边 -->
    <div class="w-52 p-3 pl-0 flex flex-col">
      <!-- 卡1 -->
      <div
        class="h-max-1/2 h-1/2 w-full bg-dark-200 items-stretch rounded-md mb-2"
      >
        <div class="rounded-md">2</div>
      </div>
      <!-- 卡2 -->
      <div
        class="h-max-1/2 h-1/2 w-full pt-2 bg-dark-200 overflow-x-hidden overflow-y-auto no-scrollbar rounded-md space-y-1"
      >
        <div
          class="w-11/12 mx-auto"
          v-for="(item, index) in detectorParameters"
        >
          <!-- 标题 -->
          <div
            :id="`title` + item.name"
            @click="expand(item)"
            class="flex items-center justify-between w-full h-7 cursor-pointer text-light-800 bg-dark-100"
            :class="
              item.isCollapse ? `rounded-md` : `rounded-md rounded-b-none`
            "
          >
            <div class="flex items-center gap-1 ml-2">
              <div
                :id="`arrow` + item.name"
                class="i-ic-round-keyboard-arrow-right"
              ></div>
              <label class="text-xs font-sans text">{{ item.name }}</label>
            </div>
            <div class="i-carbon-draggable rotate-90 mr-2"></div>
          </div>
          <!-- 内容 -->
          <div
            :id="`content` + item.name"
            class="w-full h-0 justify-center flex flex-col items-center bg-dark-100 text-light-800 rounded-b-md relative overflow-hidden"
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
