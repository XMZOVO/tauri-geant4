<template>
  <!-- <div class="flex flex-col text-center justify-center h-full">[Test]</div> -->
  <div ref="ThreeDom" class="w-full h-full"></div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, reactive } from "vue";
import { useMouseInElement, useElementBounding } from "@vueuse/core";

import { renderer, scene } from "../core/renderer";
import * as gui from "../core/gui";
import { camera } from "../core/camera";
import { controls } from "../core/orbit-control";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
//three.js的MTL加载器会把mtl文件的Tr属性的值(n)解析为透明度(1-n)
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
//这个版本的VRML加载器无法解析Anchor节点,更换github新版
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader";

import { GDMLLoader } from "../assets/js/GDMLLoader";

const ThreeDom = ref(null) as any;
const mouse = reactive(useMouseInElement(ThreeDom));
const elSizeInfo = reactive(useElementBounding(ThreeDom));

let INTERSECTED: any;
let detector: THREE.Object3D[];
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let dirLight: THREE.DirectionalLight;
let ambient: THREE.AmbientLight;
let timer: number;
let loader = new OBJLoader();
const mtlLoader = new MTLLoader();
const vrmlLoader = new VRMLLoader();
const gdmlLoader = new GDMLLoader();

const loadLight = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 10, 0);
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
      detector = object.children;
      scene.add(object);
      controls.reset();
      animate();
    });
  });
};

const loadGDMLAsset = (asset: string) => {
  gdmlLoader.load("src/assets/model/gdml/" + asset + ".gdml", (obj: any) => {
    // console.log(obj);
  });
};

const loadVRMLAsset = (asset: string) => {
  vrmlLoader.load("src/assets/" + asset + ".wrl", (object) => {
    scene.add(object);
  });
};

const createGuiItem = () => {
  gui.opacity.on("change", (ev) => {
    detector.forEach((element: any) => {
      element.material.opacity = ev.value;
    });
  });
  gui.randomColor.on("change", (ev) => {
    if (ev.value) {
      detector.forEach((element: any) => {
        element.material.emissive.setHex(Math.random() * 0xffffff);
      });
    } else {
      detector.forEach((element: any) => {
        element.material.emissive.setHex(0xfffff);
      });
    }
  });
};

const updateRenderer = () => {
  renderer.setSize(elSizeInfo.width, elSizeInfo.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// const onPointerMove = (event: PointerEvent) => {
//   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
// };

const render = () => {
  pointer.x = (mouse.elementX / elSizeInfo.width) * 2 - 1;
  pointer.y = -(mouse.elementY / elSizeInfo.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(detector[3]);

  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentM = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff0000);
    }
  } else {
    if (INTERSECTED)
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

    INTERSECTED = null;
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
  //获取鼠标在canvas内的坐标
  // document.addEventListener("pointermove", onPointerMove);
  //更新摄像机aspect
  camera.aspect = elSizeInfo.width / elSizeInfo.height;
  //刷新画布渲染尺寸
  updateRenderer();
  window.addEventListener("resize", () => {
    renderer.setSize(elSizeInfo.width, elSizeInfo.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});

onUnmounted(() => {
  gui.pane.hidden = true;
  scene.children.forEach((element) => {
    scene.children.pop();
  });
  renderer.dispose();
  dirLight.dispose();
  ambient.dispose();
  cancelAnimationFrame(timer);
});

loadLight();
// loadObjAsset("test111");
loadGDMLAsset("wtest");
createGuiItem();
</script>
