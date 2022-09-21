<template>
  <!-- <div class="flex flex-col text-center justify-center h-full">[Test]</div> -->
  <div ref="ThreeDom" class="w-full h-full"></div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

import { renderer, scene } from "../core/renderer";
import { fpsGraph, gui } from "../core/gui";
import { camera } from "../core/camera";
import { controls } from "../core/orbit-control";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const ThreeDom = ref(null) as any;

let dirLight: THREE.DirectionalLight;
let ambient: THREE.AmbientLight;
let timer: number;
let loader = new OBJLoader();

loadLight();
loadAsset("test111");
animate();

function loadLight() {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 10, 0);
  scene.add(dirLight);

  ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
}

function loadAsset(asset: string) {
  loader.load("src/assets/" + asset + ".obj", function (object) {
    console.log(object);

    scene.add(object);
    controls.reset();
  });
}

function animate() {
  fpsGraph.begin();
  controls.update();
  renderer.render(scene, camera);
  fpsGraph.end();
  timer = requestAnimationFrame(animate);
}

onMounted(() => {
  gui.hidden = false;
  ThreeDom.value.appendChild(renderer.domElement);
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
</script>
