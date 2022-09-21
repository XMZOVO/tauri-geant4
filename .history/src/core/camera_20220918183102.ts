import { PerspectiveCamera } from "three";
import { scene } from "./renderer";

const VERTICAL_FIELD_OF_VIEW = 75; // degrees 45 is the normal

export const camera = new PerspectiveCamera(
  VERTICAL_FIELD_OF_VIEW,
  sizes.width / sizes.height,
  0.1,
  1e10
);

camera.position.set(18, 490, -492);

scene.add(camera);

export default camera;
