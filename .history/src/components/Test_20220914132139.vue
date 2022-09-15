<script lang="ts" setup>
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Scene } from "@babylonjs/core/scene";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { onMounted } from "vue";

onMounted(() => {
  // Get the canvas element from the DOM.
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

  // Associate a Babylon Engine to it.
  const engine = new Engine(canvas);

  // Create our first scene.
  var scene = new Scene(engine);

  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Create a grid material
  var material = new GridMaterial("grid", scene);

  SceneLoader.ImportMesh("", "", "house.wrl", scene, function (newMeshes) {
    // Set the target of the camera to the first imported mesh
    camera.target = newMeshes[0].position;
  });

  // Render every frame
  engine.runRenderLoop(() => {
    scene.render();
  });
});
</script>

<template>
  <canvas id="renderCanvas" touch-action="none" class="h-full w-full"></canvas>
</template>
