import {
  AmbientLight, AxesHelper, Color, DirectionalLight,
  PMREMGenerator, PerspectiveCamera, Scene, WebGLRenderer, sRGBEncoding,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader'

interface Sizes {
  width: number
  height: number
}

export default class ResultScene {
  canvas: HTMLCanvasElement
  camera!: PerspectiveCamera
  renderer!: WebGLRenderer
  sizes!: Sizes
  scene!: Scene
  timer!: number
  vrmlScene!: any
  controls!: OrbitControls
  axesHelper!: AxesHelper
  dirLight!: DirectionalLight
  vrmlLoader = new VRMLLoader()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  async init() {
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initWindowSizes()
    this.initLight()
    this.initAnimateTick()
  }

  initScene() {
    this.scene = new Scene()
    this.scene.background = new Color('#161616')
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.canvas.parentElement!.clientWidth
        / this.canvas.parentElement!.clientHeight,
      0.1,
      1e10,
    )
    this.camera.position.set(100, 100, 100)
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(
      this.canvas.parentElement!.clientWidth,
      this.canvas.parentElement!.clientHeight,
    )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio))
    this.renderer.shadowMap.enabled = true
    this.renderer.localClippingEnabled = true
    this.renderer.outputEncoding = sRGBEncoding
    // this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.75

    const pmremGenerator = new PMREMGenerator(this.renderer)
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture

    this.axesHelper = new AxesHelper(100)
    this.axesHelper.setColors(
      new Color('#E06C75'),
      new Color('#71C48E'),
      new Color('#61AFEF'),
    )
    this.scene.add(this.axesHelper)
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
  }

  initWindowSizes() {
    const sizes: Sizes = {
      width: this.canvas.parentElement!.clientWidth,
      height: this.canvas.parentElement!.clientHeight,
    }
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
    // 窗口resize监听
    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = this.canvas.parentElement!.clientWidth
      sizes.height = this.canvas.parentElement!.clientHeight
      // Update camera
      this.camera.aspect = sizes.width / sizes.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(sizes.width, sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    this.sizes = sizes
  }

  initLight() {
    this.dirLight = new DirectionalLight(0xFFFFFF, 1)
    this.scene.add(this.dirLight)

    this.scene.add(new AmbientLight(0x222222))
  }

  initAnimateTick() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
      this.controls.update()
    }
    this.timer = requestAnimationFrame(this.initAnimateTick.bind(this))
  }

  async importScene(path: string) {
    const vrml = await this.vrmlLoader.loadAsync(path)
    this.vrmlScene = vrml
    this.scene.add(this.vrmlScene)
  }

  clearScene() {
    this.scene.remove(this.vrmlScene)
  }
}
