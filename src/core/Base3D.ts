import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GDMLLoader } from "threejs-gdml-loader";

interface Sizes {
  width: number;
  height: number;
}

export default class Base3D {
  canvas: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  sizes!: Sizes;
  scene!: Scene;
  controls!: OrbitControls;
  timer!: number;
  detector!: Group;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // this.init();
  }

  async init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initWindowSizes();
    await this.initModel();
    this.initLight();
    this.initAnimateTick();
  }

  initScene() {
    this.scene = new Scene();
    this.scene.background = new Color("#161616");
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.canvas.parentElement!.clientWidth /
        this.canvas.parentElement!.clientHeight,
      0.1,
      1e10
    );
    this.camera.position.set(30000, 30000, 30000);
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(
      this.canvas.parentElement!.clientWidth,
      this.canvas.parentElement!.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = PCFShadowMap;
    // renderer.physicallyCorrectLights = true;
    // renderer.outputEncoding = sRGBEncoding;
    // renderer.toneMapping = ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;

    const axesHelper = new AxesHelper(10000);
    this.scene.add(axesHelper);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  initWindowSizes() {
    const sizes: Sizes = {
      width: this.canvas.parentElement!.clientWidth,
      height: this.canvas.parentElement!.clientHeight,
    };
    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();
    //窗口resize监听
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = this.canvas.parentElement!.clientWidth;
      sizes.height = this.canvas.parentElement!.clientHeight;
      // Update camera
      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(sizes.width, sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    this.sizes = sizes;
  }

  async initModel() {
    const gdmlLoader = new GDMLLoader();
    const object = await gdmlLoader.loadAsync(
      "src/assets/model/gdml/Par02FullDetector.gdml"
    );
    this.scene.add(object);
    this.detector = object;
  }

  initLight() {
    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 50, 0);
    this.scene.add(dirLight);

    const ambient = new AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);
  }

  initAnimateTick() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    requestAnimationFrame(this.initAnimateTick.bind(this));
  }
}
