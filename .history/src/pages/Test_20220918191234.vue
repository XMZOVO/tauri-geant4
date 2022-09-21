<template>
  <!-- <div class="flex flex-col text-center justify-center h-full">[Test]</div> -->
  <div ref="ThreeDom" class="w-full h-full"></div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, reactive } from "vue";
import { useMouseInElement, useElementBounding } from "@vueuse/core";

import { renderer, scene } from "../core/renderer";
import { fpsGraph, gui } from "../core/gui";
import { camera } from "../core/camera";
import { controls } from "../core/orbit-control";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
//three.js的MTL加载器会把mtl文件的Tr属性的值(n)解析为透明度(1-n)
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
//这个版本的VRML加载器无法解析Anchor节点,更换github新版
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader";

const ThreeDom = ref(null) as any;
const mouse = reactive(useMouseInElement(ThreeDom));
const elSizeInfo = reactive(useElementBounding(ThreeDom));

let INTERSECTED: any;
let detector: THREE.Object3D;
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let dirLight: THREE.DirectionalLight;
let ambient: THREE.AmbientLight;
let timer: number;
let loader = new OBJLoader();
let mtlLoader = new MTLLoader();
let vrmlLoader = new VRMLLoader();

const loadLight = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 10, 0);
  scene.add(dirLight);

  ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
};

const loadObjAsset = (asset: string) => {
  mtlLoader.load("src/assets/test111.mtl", (materials) => {
    materials.preload();
    for (const t in materials.materials) {
      materials.materials[t].transparent = true;
      materials.materials[t].opacity = 0.6;
    }
    loader.setMaterials(materials);

    loader.load("src/assets/" + asset + ".obj", function (object) {
      detector = object.children[0];
      scene.add(object);
      controls.reset();
      animate();
    });
  });
};

const loadVRMLAsset = (asset: string) => {
  vrmlLoader.load("src/assets/" + asset + ".wrl", (object) => {
    scene.add(object);
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
  const intersects = raycaster.intersectObject(detector);

  if (intersects.length > 0) {
    const intersect: any = intersects[0].object;
    // intersect.currentHex = intersect.material.emissive.getHex();
    intersect.material.emissive.setHex(0xff0000);
    // const face = intersect.face;

    // const linePosition = line.geometry.attributes.position;
    // const meshPosition = mesh.geometry.attributes.position;

    // linePosition.copyAt(0, meshPosition, face.a);
    // linePosition.copyAt(1, meshPosition, face.b);
    // linePosition.copyAt(2, meshPosition, face.c);
    // linePosition.copyAt(3, meshPosition, face.a);

    // detector.updateMatrix();

    // line.geometry.applyMatrix4(mesh.matrix);

    // line.visible = true;
  } else {
    // line.visible = false;
    // console.log("di");
  }
};

const animate = () => {
  timer = requestAnimationFrame(animate);
  fpsGraph.begin();
  controls.update();
  fpsGraph.end();
  render();
  renderer.render(scene, camera);
};

onMounted(() => {
  gui.hidden = false;
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
  gui.hidden = true;
  gui.children.forEach((element) => {
    gui.children.pop();
  });
  scene.children.forEach((element) => {
    scene.children.pop();
  });
  renderer.dispose();
  dirLight.dispose();
  ambient.dispose();
  cancelAnimationFrame(timer);
});

loadLight();
loadObjAsset("test111");
</script>
