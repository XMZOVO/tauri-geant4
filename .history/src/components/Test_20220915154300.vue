<script lang="ts" setup>
import * as THREE from "three";
import { renderer, scene } from "../scene/renderer";
import { fpsGraph, gui } from "../scene/gui";
import camera from "../scene/camera";
import { controls } from "../scene/orbit-control";
import VRMLLoader from "three-vrml-loader";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { load } from "@amcharts/amcharts5/.internal/core/util/Net";

const ThreeDom = ref(null);

// 灯光
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 0);
scene.add(dirLight);

var ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// 加载模型
let loader = new VRMLLoader();
loadAsset("g4_01");

let timer: number;
onBeforeUnmount(() => {
  gui.hidden = true;
  scene.children.forEach((element) => {
    scene.children.pop();
  });

  const domDiv = document.getElementById("canvas");
  if (domDiv !== null) {
    domDiv.removeChild(domDiv.firstChild!);
  }
  renderer.dispose();
  gui.children.forEach((element) => {
    gui.children.pop();
  });
  cancelAnimationFrame(timer);
});

onMounted(() => {
  gui.hidden = false;
  (ThreeDom as any)._value.appendChild(renderer.domElement);
  tick();
});

function loadAsset(asset: string) {
  loader.load("src/assets/" + asset + ".wrl", (object) => {
    scene.add(object);
    controls.reset();
  });
}

const tick = () => {
  fpsGraph.begin();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  fpsGraph.end();
  // Call tick again on the next frame
  timer = requestAnimationFrame(tick);
};

const reloadCanvas = () => {
  scene.children.pop();
  scene.add(camera);
  scene.add(ambient);
  loadAsset("g4_03");
};
</script>

<template>
  <!-- <button class="btn" @click="reloadCanvas">reload</button> -->
  <div ref="ThreeDom" class="h-full w-full overflow-hidden"></div>
</template>
