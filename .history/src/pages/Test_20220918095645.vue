<template>
  <!-- <div class="flex flex-col text-center justify-center h-full">[Test]</div> -->
  <div id="canvas" class="w-full h-full"></div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted } from "vue";

import { renderer, scene } from "../core/renderer";
import { fpsGraph, gui } from "../core/gui";
import { camera } from "../core/camera";
import { controls } from "../core/orbit-control";
import { ObjectLoader } from "three";

const ThreeDom = $ref(null);

let loader = new ObjectLoader();

const loadLight = () => {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 10, 0);
  scene.add(dirLight);

  var ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
};

const loadAsset = (asset: string) => {
  loader.load("src/assets/" + asset + ".wrl", function (object) {
    scene.add(object);
    controls.reset();
  });
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

onMounted(() => {});

onUnmounted(() => {});
</script>
