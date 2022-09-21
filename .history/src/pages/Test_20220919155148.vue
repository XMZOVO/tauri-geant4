<template>
  <!-- <div class="flex flex-col text-center justify-center h-full">[Test]</div> -->
  <div ref="ThreeDom" class="w-full h-full"></div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, reactive } from "vue";
import { useMouseInElement, useElementBounding } from "@vueuse/core";

import { renderer, scene, axesHelper } from "../core/renderer";
import * as gui from "../core/gui";
import { camera } from "../core/camera";
import { controls } from "../core/orbit-control";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
//three.js的MTL加载器会把mtl文件的Tr属性的值(n)解析为透明度(1-n)
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
//这个版本的VRML加载器无法解析Anchor节点,更换github新版
import { VRMLLoader } from "threejs-vrml-loader";

import { GDMLLoader } from "threejs-gdml-loader";
import { InputBindingApi } from "tweakpane";

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
const mtlLoader = new MTLLoader();
const vrmlLoader = new VRMLLoader();
const gdmlLoader = new GDMLLoader();

//灯光
const createLight = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 15, 0);
  scene.add(dirLight);

  // ambient = new THREE.AmbientLight(0xffffff, 0.3);
  // scene.add(ambient);
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
  detector = object;
  pickableObjects.push(object.children[3] as THREE.Mesh);
  originalMaterials[object.children[3].name] = (
    object.children[3] as THREE.Mesh
  ).material;
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

//创建GUI事件
const createGuiItem = () => {
  //透明度事件
  gui.opacity.on("change", (ev) => {
    detector.children.forEach((element: any) => {
      element.material.opacity = ev.value;
    });
  });
  //随机颜色事件
  gui.randomColor.on("change", (ev) => {
    if (ev.value) {
      detector.children.forEach((element: any) => {
        element.material.emissive.setHex(Math.random() * 0xffffff);
      });
    } else {
      detector.children.forEach((element: any) => {
        element.material.emissive.setHex(0x000000);
      });
    }
  });
  //预览结果事件
  gui.viewRsult.on("click", () => {
    scene.remove(detector);
    loadVRMLAsset("g4_01");
  });
  //灯光强度
  gui.dirlightIntens.on("change", (ev) => {
    dirLight.intensity = ev.value;
  });
  //坐标显示
  gui.axeVisible.on("change", (ev) => {
    axesHelper.visible = ev.value;
  });
};

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

const disposeGui = () => {
  while (guiInput.length > 0) {
    guiInput.pop();
  }
};

const animate = () => {
  timer = requestAnimationFrame(animate);
  gui.fpsGraph.begin();
  controls.update();
  gui.fpsGraph.end();
  render();
  renderer.render(scene, camera);
};

onMounted(() => {
  gui.pane.hidden = false;
  ThreeDom._value.appendChild(renderer.domElement);
  updateRenderer();
  //更新摄像机aspect
  camera.aspect = elSizeInfo.width / elSizeInfo.height;
  camera.updateProjectionMatrix();
  window.addEventListener("resize", updateRenderer);
});

onUnmounted(() => {
  gui.pane.hidden = true;
  disposeGui();
  renderer.renderLists.dispose();
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  console.log(scene);

  cancelAnimationFrame(timer);
});

createLight();
loadGDMLAsset("wtest");
// loadVRMLAsset("g4_01");
createGuiItem();
animate();
</script>
