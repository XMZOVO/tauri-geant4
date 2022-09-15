<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader.js";
import { onMounted } from "vue";

let canvas: HTMLElement;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let clock: THREE.Clock;
let loader: VRMLLoader;

onMounted(() => {
  canvas = document.getElementById("webgl") as HTMLElement;
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

    camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    //添加相机
    scene.add(camera);

    // 加载模型
    loader = new VRMLLoader();
    loadAsset(params.asset);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    clock = new THREE.Clock();
    tick();
  });

  function loadAsset(asset: string) {
    loader.load("models/vrml/" + asset + ".wrl", function (object) {
      vrmlScene: THREE.Scene = object;
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
});
</script>

<template>
  <canvas id="webgl" class="h-full w-full"></canvas>
</template>
