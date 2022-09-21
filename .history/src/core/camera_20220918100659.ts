import { PerspectiveCamera } from "three";
import { scene, sizes } from "./renderer";
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
const VERTICAL_FIELD_OF_VIEW = 75; // degrees 45 is the normal

export const camera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
  0.1,
  1e10
);

camera.position.set(18, 490, -492);

window.addEventListener("resize", () => {
  sizes.width = width.value;
  sizes.height = height.value;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

scene.add(camera);

export default camera;
