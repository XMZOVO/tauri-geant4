import { readBinaryFile } from '@tauri-apps/api/fs'
import type { BufferGeometry } from 'three'
import {
  AmbientLight,

  AxesHelper,

  Box3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PMREMGenerator,
  PerspectiveCamera,
  Plane,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,

  sRGBEncoding,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GDMLLoader } from 'threejs-gdml-loader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader'
import gsap from 'gsap'
interface Sizes {
  width: number
  height: number
}

export default class Base3D {
  canvas: HTMLCanvasElement
  camera!: PerspectiveCamera
  camera2!: OrthographicCamera
  renderer!: WebGLRenderer
  sizes!: Sizes
  scene!: Scene
  controls!: OrbitControls
  timer!: number
  detector: { [name: string]: Mesh } = {}
  detectorGroup!: Group | Scene
  world!: Mesh
  detectorGeometry!: BufferGeometry
  particle!: Mesh
  vrmlScene!: Scene
  clipPlane = [new Plane(new Vector3(-1, 0, 0), 0), new Plane(new Vector3(0, 1, 0), 0), new Plane(new Vector3(0, 0, -1), 0)]
  highlightMaterial = new MeshStandardMaterial({
    color: 0x00FF00,
    transparent: true,
    roughness: 0,
    wireframe: true,
  })

  originalMaterial = new MeshStandardMaterial({
    color: 0x222222,
    transparent: true,
    roughness: 1,
    metalness: 0,
    side: DoubleSide,
  })

  particleMaterial = new MeshStandardMaterial({
    color: new Color(0.5, 0, 0),
    transparent: true,
    roughness: 0.5,
  })

  sdLogMatertial = new MeshStandardMaterial({
    color: new Color(0xFA9C1E),
    transparent: true,
    roughness: 0.5,
    side: DoubleSide,
  })

  worldMaterial = new MeshStandardMaterial({
    color: 0x222222,
    transparent: true,
    roughness: 1,
    metalness: 0,
    side: DoubleSide,
  })

  pointMesh = new Mesh(new SphereGeometry(2, 20, 20), this.particleMaterial)
  cylinderMesh = new Mesh(new CylinderGeometry(5, 5, 10, 20), this.particleMaterial)
  axesHelper!: AxesHelper
  dirLight!: DirectionalLight
  gdmlLoader = new GDMLLoader()
  mtlLoader = new MTLLoader()
  objLoader = new OBJLoader()
  vrmlLoader = new VRMLLoader()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.cylinderMesh.rotation.x = Math.PI / 2
  }

  async init() {
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initWindowSizes()
    this.initGPS()
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

    this.camera2 = new OrthographicCamera(
      75,
      this.canvas.parentElement!.clientWidth
        / this.canvas.parentElement!.clientHeight,
      0.1,
      1e10)
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
    // ??????resize??????
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
      '/assets/model/gdml/init.gdml',
    )
    const group = new Group()
    this.detectorGroup = group.add(...object.children.slice(0, -1))
    this.world = object.children[object.children.length - 1] as Mesh
    this.scene.add(this.detectorGroup, this.world)

    this.detector[this.world.name] = this.world
    this.detector[this.world.name].material = this.worldMaterial
    this.detectorGroup.children.forEach((element) => {
      const el = element as Mesh
      this.detector[element.name] = el
      this.detector[element.name].material = this.originalMaterial
    })
  }

  initGPS() {
    this.pointMesh.position.set(0, 0, 50)
    this.scene.add(this.pointMesh)
    this.particle = this.pointMesh
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

  highlightSelect(name: string) {
    if (this.detector[name].material === this.sdLogMatertial)
      this.sdLogMatertial.wireframe = true
    else
      this.detector[name].material = this.highlightMaterial

    for (const item in this.detector) {
      if (item !== name) {
        if (this.detector[item].material === this.sdLogMatertial)
          this.sdLogMatertial.wireframe = false
        else
          this.detector[item].material = this.originalMaterial
      }
    }
  }

  visibleChangeAll(flag: boolean) {
    for (const item in this.detector)
      this.detector[item].visible = flag
  }

  visibleChange(name: string, flag: boolean) {
    this.detector[name].visible = flag
  }

  // ??????
  async importGdml(path: string) {
    this.cleanCurrentScene()
    const imgContent = await readBinaryFile(path)
    const blob = URL.createObjectURL(new Blob([imgContent.buffer]))
    const object: Group = await this.gdmlLoader.loadAsync(blob)
    // this.scene.add(object)
    this.detectorGroup = object
    object.children.forEach((element) => {
      const el = element as Mesh
      this.detector[element.name] = el
    })
  }

  // ??????
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

  async importVrml(path: string, meshList: string[], randomColor = false) {
    this.cleanCurrentScene()
    const vrml = await this.vrmlLoader.loadAsync(path)
    const group = new Group()
    this.world = vrml.children[0] as Mesh
    this.detectorGroup = group.add(...vrml.children.slice(1, vrml.children.length))
    this.scene.add(this.detectorGroup, this.world)

    this.detector[meshList[0]] = this.world
    this.detector[meshList[0]].material = this.worldMaterial
    this.detectorGroup.children.forEach((element, index) => {
      this.detector[meshList[index + 1]] = element as Mesh
      if (randomColor) {
        this.detector[meshList[index + 1]].material = new MeshStandardMaterial({
          color: new Color(Math.random() * 0xFFFFFF),
          transparent: true,
          clipShadows: true,
          side: DoubleSide,
        })
      }
      else {
        this.detector[meshList[index + 1]].material = this.originalMaterial
      }
    })
  }

  cleanCurrentScene() {
    this.scene.remove(this.detectorGroup, this.world)
    this.detector = {}

    if (this.vrmlScene)
      this.scene.remove(this.vrmlScene)
  }

  axisVisibleChange(flag: boolean) {
    this.axesHelper.visible = flag
  }

  worldVisibleChange(flag: boolean) {
    this.world.visible = flag
  }

  opacityChange(value: number) {
    for (const item in this.detector) {
      const mat = this.detector[item].material as MeshStandardMaterial
      mat.opacity = value
    }
  }

  dirLightIntensityChange(value: number) {
    this.dirLight.intensity = value
  }

  dirLightPosChange(value: Vector3) {
    this.dirLight.position.copy(value)
  }

  particlePositionChange(value: Vector3) {
    this.particle.position.copy(value)
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

  setRoughness(value: number) {
    for (const item in this.detector) {
      const mat = this.detector[item].material as MeshStandardMaterial
      mat.roughness = value
    }
  }

  setClip(flag: boolean) {
    for (const item in this.detector) {
      const mat = this.detector[item].material as MeshStandardMaterial
      if (mat !== this.worldMaterial) {
        mat.clippingPlanes = flag ? [...this.clipPlane] : []
        mat.clipShadows = flag
      }
    }
  }

  setClipConstant(index: number, value: number) {
    this.clipPlane[index].constant = value
  }

  size = new Vector3()
  center = new Vector3()
  box = new Box3()
  fitCameraToSelection(camera: PerspectiveCamera, controls: OrbitControls, selection: any, fitOffset = 1.2) {
    this.box.makeEmpty()
    for (const object of selection)
      this.box.expandByObject(object)

    this.box.getSize(this.size)
    this.box.getCenter(this.center)

    const maxSize = Math.max(this.size.x, this.size.y, this.size.z)
    const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360))
    const fitWidthDistance = fitHeightDistance / camera.aspect
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance)

    const direction = controls.target.clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance)

    controls.maxDistance = distance * 20
    controls.target.copy(this.center)

    camera.near = distance / 1000
    camera.far = distance * 100
    camera.updateProjectionMatrix()

    camera.position.copy(controls.target).sub(direction)

    gsap.from(this.camera.position, { x: camera.position.x * 3, y: camera.position.y * 3, z: -camera.position.z, duration: 1, ease: 'circ' })

    controls.update()
  }

  highLightSDLogVolume(name: string) {
    if (this.detector[name])
      this.detector[name].material = this.sdLogMatertial
  }

  gpsChange(sourceType: string) {
    switch (sourceType) {
      case 'point':{
        this.pointMesh.position.copy(this.particle.position)
        this.scene.remove(this.cylinderMesh)
        this.scene.add(this.pointMesh)
        this.particle = this.pointMesh
        break
      }
      case 'volume': {
        this.cylinderMesh.position.copy(this.particle.position)
        this.scene.remove(this.pointMesh)
        this.scene.add(this.cylinderMesh)
        this.particle = this.cylinderMesh
        break
      }
    }
  }

  gpsVolumeChange(radius: number, halfZ: number) {
    this.cylinderMesh.scale.set(radius / 5, halfZ / 5, radius / 5)
  }
}
