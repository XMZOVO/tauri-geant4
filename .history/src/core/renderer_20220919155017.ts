import {
  WebGLRenderer,
  Scene,
  AxesHelper,
  sRGBEncoding,
  PCFShadowMap,
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  AmbientLight,
} from "three";

export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

const axesHelper = new AxesHelper(100);
scene.add(axesHelper);

export default {
  renderer,
  axesHelper,
};
