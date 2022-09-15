import { PerspectiveCamera } from "three";
import { scene, sizes } from "./renderer";

const VERTICAL_FIELD_OF_VIEW = 75; // degrees 45 is the normal

export const camera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
  0.1,
  1e10
);

camera.position.set(10, 100, -100);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

scene.add(camera);

export default camera;
