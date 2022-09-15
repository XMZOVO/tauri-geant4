<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader.js";
import { onMounted, onUnmounted } from "vue";

let canvas: HTMLElement;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let clock: THREE.Clock;
let loader: VRMLLoader;
let vrmlScene: THREE.Scene;

scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1e10);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
//添加相机
scene.add(camera);

// 灯光
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 0);
scene.add(dirLight);

var ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// 加载模型
loader = new VRMLLoader();
loadAsset("g4_01");

//渲染器
renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

clock = new THREE.Clock();

onUnmounted(() => {
  scene.children.pop();
  const domDiv = document.getElementById("canvas");
  if (domDiv !== null) {
    domDiv.removeChild(domDiv.firstChild!);
  }
});

onMounted(() => {
  document.getElementById("canvas")?.appendChild(renderer.domElement);
  tick();
});

function loadAsset(asset: string) {
  loader.load("src/assets/" + asset + ".wrl", function (object) {
    console.log(object);

    vrmlScene = object;
    scene.add(object);
    controls.reset();
  });
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

const reloadCanvas = () => {
  scene.children.pop();
  scene.add(camera);
  scene.add(ambient);
  loadAsset("g4_01");
};
</script>

<template>
  <button class="btn" @click="reloadCanvas">reload</button>
  <div id="canvas" class="h-full w-full"></div>
</template>
