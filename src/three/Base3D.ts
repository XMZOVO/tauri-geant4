import { readBinaryFile } from '@tauri-apps/api/fs'
import type {
  Group,
  Material,
  Mesh,
  Vector3,
} from 'three'
import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GDMLLoader } from 'threejs-gdml-loader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader'
interface Sizes {
  width: number
  height: number
}

export default class Base3D {
  canvas: HTMLCanvasElement
  camera!: PerspectiveCamera
  renderer!: WebGLRenderer
  sizes!: Sizes
  scene!: Scene
  controls!: OrbitControls
  timer!: number
  detector: { [name: string]: Mesh } = {}
  detectorGroup!: Group | Scene
  vrmlScene!: Scene
  highlightMaterial = new MeshBasicMaterial({
    wireframe: true,
    color: 0x00FF00,
  })

  originalMaterial = new MeshPhongMaterial({
    color: 0xFFFFFF, // delete randomColor
    transparent: true,
    opacity: 0.6, // set opacity to 0.6
    wireframe: false,
  })

  axesHelper!: AxesHelper
  dirLight!: DirectionalLight
  gdmlLoader = new GDMLLoader()
  mtlLoader = new MTLLoader()
  objLoader = new OBJLoader()
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
    // await this.initModel()
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = PCFShadowMap;
    // renderer.physicallyCorrectLights = true;
    // renderer.outputEncoding = sRGBEncoding;
    // renderer.toneMapping = ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;

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

  async initModel() {
    this.cleanCurrentScene()
    const object: Group = await this.gdmlLoader.loadAsync(
      '/assets/model/gdml/wtest.gdml',
    )
    this.scene.add(object)
    this.detectorGroup = object
    object.children.forEach((element) => {
      this.detector[element.name] = element as Mesh
    })
  }

  initLight() {
    this.dirLight = new DirectionalLight(0xFFFFFF, 1)
    this.scene.add(this.dirLight)

    const ambient = new AmbientLight(0xFFFFFF, 0.3)
    this.scene.add(ambient)
  }

  initAnimateTick() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
      this.controls.update()
    }
    this.timer = requestAnimationFrame(this.initAnimateTick.bind(this))
  }

  // functions
  highlightSelect(name: string) {
    this.detector[name].material = this.highlightMaterial
    for (const item in this.detector) {
      if (item !== name)
        this.detector[item].material = this.originalMaterial
    }
  }

  visibleChangeAll(flag: boolean) {
    for (const item in this.detector)
      this.detector[item].visible = flag
  }

  visibleChange(name: string, flag: boolean) {
    this.detector[name].visible = flag
  }

  async importGdml(path: string) {
    this.cleanCurrentScene()
    const imgContent = await readBinaryFile(path)
    const blob = URL.createObjectURL(new Blob([imgContent.buffer]))
    const object: Group = await this.gdmlLoader.loadAsync(blob)
    this.scene.add(object)
    this.detectorGroup = object
    object.children.forEach((element) => {
      this.detector[element.name] = element as Mesh
    })
  }

  async importObj(objPath: string, mtlPath: string) {
    this.cleanCurrentScene()
    const mtl = await this.mtlLoader.loadAsync(mtlPath)
    this.objLoader.setMaterials(mtl)
    const obj = await this.objLoader.loadAsync(objPath)
    this.scene.add(obj)
    this.detectorGroup = obj
    obj.children.forEach((element) => {
      // if (index === 0)
      //   element.visible = false
      this.detector[element.name] = element as Mesh
      this.detector[element.name].material = this.originalMaterial
    })
  }

  async importVrml(path: string, meshList: string[]) {
    this.cleanCurrentScene()
    const vrml = await this.vrmlLoader.loadAsync(path)
    this.scene.add(vrml)
    this.detectorGroup = vrml
    vrml.children.forEach((element, index) => {
      this.detector[meshList[index]] = element as Mesh
      this.detector[meshList[index]].material = this.originalMaterial
    })
  }

  cleanCurrentScene() {
    this.scene.remove(this.detectorGroup)
    this.detector = {}

    if (this.vrmlScene)
      this.scene.remove(this.vrmlScene)
  }

  axisVisibleChange(flag: boolean) {
    this.axesHelper.visible = flag
  }

  worldVisibleChange(worldName: string, flag: boolean) {
    this.detector[worldName].visible = flag
  }

  // positionChange(position: Vector3) {
  //   this.detectorGroup.position.copy(position)
  // }

  opacityChange(value: number) {
    for (const item in this.detector) {
      const mat = this.detector[item].material as Material
      mat.opacity = value
    }
  }

  dirLightIntensityChange(value: number) {
    this.dirLight.intensity = value
  }

  dirLightPosChange(value: Vector3) {
    this.dirLight.position.copy(value)
  }

  async viewVrmlScene(blob: string) {
    this.cleanCurrentScene()
    const obj = await this.vrmlLoader.loadAsync(blob)
    this.vrmlScene = obj
    this.scene.add(obj)
  }

  autoRotateCamera(flag: boolean) {
    this.controls.autoRotate = flag
  }
}
