import {
  WebGLRenderer,
  Scene,
  AxesHelper,
  sRGBEncoding,
  PCFShadowMap,
  ACESFilmicToneMapping,
  Color,
} from "three";

import { gui } from "./gui";

// Scene
export const scene = new Scene();
scene.background = new Color("#333");

// Renderer
export const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});

// More realistic shadows
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = PCFShadowMap;
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = sRGBEncoding;
// renderer.toneMapping = ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1;

// Axes Helper
const axesHelper = new AxesHelper(100);
scene.add(axesHelper);

gui.addInput(axesHelper, "visible", {
  label: "AxesHelper",
});

export default {
  renderer,
  gui,
};
