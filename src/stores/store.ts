import { defineStore } from 'pinia'
interface Marco {
  detector: NaIDetect
  particle: Particle
  runtimeInfo: RuntimeInfo
  additionalInfo: AdditionalInfo
}

interface GdmlMarco {
  detector: GdmlDetector
  particle: Particle
  runtimeInfo: RuntimeInfo
  additionalInfo: AdditionalInfo
}

interface NaIDetect {
  cylinderH: string
  cylinderR: string
  reflectTT: string
  reflectST: string
  reflectMat: string
  pmtT: string
  sdVolName: string
}

interface GdmlDetector {
  fileName: string
  sdLogVolName: string
}

interface Particle {
  source: string
  number: string
  pos: Pos
  dir: Pos
  type: string
}

interface RuntimeInfo {
  trackingVb: string
  printModulo: string
  analysisVb: string
  enableTajectory: boolean
}

interface AdditionalInfo {
  title: string
  description: string
}

interface LastSimulationInfo {
  totalParticles: string
  detectorTemplate: string
  source: string
  totalTime: string
  detectorParams: NaIDetect | null
  particlePos: Pos
}

interface calibrateResult {
  energy?: number
  efficiency?: number
  fit?: number
  delta?: number
}
interface specParams {
  name: string
  ch: string
  minEn: string
  maxEn: string
  fA: string
  fB: string
  fC: string
}

interface calPoint {
  energy?: number
  efficiency?: number
}

interface spectrumData {
  countList: number[]
  energyList: number[]
  fwhmCountList: number[]
}
interface nuclide {
  id: number
  nuclide: string
  energy: number
  percent: number
  halfLife: string
  halfLifeUnit: string
}

interface Pos {
  x: string
  y: string
  z: string
}

export const useStore = defineStore('stores', {
  state: () => ({
    marco: {
      detector: {
        cylinderH: '7.6',
        cylinderR: '3.8',
        reflectTT: '0.3',
        reflectST: '0.2',
        reflectMat: 'G4_ALUMINUM_OXIDE',
        pmtT: '3',
      },
      particle: {
        source: 'Co60',
        number: '1000000',
        pos: { x: '0.0', y: '0.0', z: '50.0' },
        dir: { x: '0.0', y: '0.0', z: '-1.0' },
        type: 'point',
      },
      runtimeInfo: {
        trackingVb: '0',
        printModulo: '100000',
        analysisVb: '0',
        enableTajectory: false,
      },
      additionalInfo: {
        title: 'test1',
        description: 'test1',
      },
    } as Marco,
    gdmlMarco: { detector: { sdLogVolName: 'Cylinder' } } as GdmlMarco,
    lastSimulationInfo: {} as LastSimulationInfo,
    detectorTemplate: '0',
    totalTime: '',
    detectorOpacity: 0.6,
    showAxes: true,
    showWorldVolume: true,
    dirLightIntensity: 1.0,
    dirLightPos: { x: '0', y: '10', z: '0' } as Pos,

    calDataEnergyList: [
      0.662, 1.1732, 1.3325, 0.04012, 0.12178, 0.34428, 0.03952, 1.40801, 0.0454, 0.96413,
      1.11212, 0.7789, 1.08591, 0.2447, 0.86739, 0.41111,
    ],
    calResultList: [] as calibrateResult[],
    calPointList: [{ energy: 1.166, efficiency: 0.001339 },
      { energy: 1.324, efficiency: 0.001378 }] as calPoint[],
    specParams: {
      name: 'result',
      ch: '4096',
      minEn: '0',
      maxEn: '2.0',
      fA: '-0.0137257',
      fB: '0.0739501',
      fC: '-0.152982',
    } as specParams,
    spectrumData: {} as spectrumData,
    nucTableData: [] as nuclide[],
    nucTableDataBackup: [] as nuclide[],
    clibrateMethod: '线性',
    showCalibrateCurve: true,
    gdmlParser: 'VRML',
    lineSegmentsPerCircle: '200',
    currentSceneUrl: '',
    structureList: [] as string[],

    selectedChart: 0,
    calValue: [],

    activeSettingPage: 0,
    showSciencedata: '1',
    randomColor: '0',
    roughness: '0.5',

    clipMod: false,
    clipPanes: ['0', '0', '0'],
    autoRotate: false,
  }),
  actions: {
    setNaISDVolName() {
      this.marco.detector.sdVolName = this.gdmlMarco.detector.sdLogVolName
    },
    setGdmlMarco() {
      this.gdmlMarco.particle = this.marco.particle
      this.gdmlMarco.runtimeInfo = this.marco.runtimeInfo
      this.gdmlMarco.additionalInfo = this.marco.additionalInfo
    },
    setLastSimulationInfo() {
      if (this.detectorTemplate === '-1')
        this.lastSimulationInfo.detectorParams = null

      else
        this.lastSimulationInfo.detectorParams = this.marco.detector
      this.lastSimulationInfo.detectorTemplate = this.detectorTemplate
      this.lastSimulationInfo.source = this.marco.particle.source
      this.lastSimulationInfo.totalParticles = this.marco.particle.number
      this.lastSimulationInfo.totalTime = '00:01:00'
      this.lastSimulationInfo.particlePos = this.marco.particle.pos
    },
    initcalResult() {
      for (let i = 0; i < 15; i++) {
        this.calResultList.push({
          energy: this.calDataEnergyList[i],
          efficiency: undefined,
          delta: undefined,
        })
      }
    },
    trimSdLogVolName() {
      this.gdmlMarco.detector.sdLogVolName = this.gdmlMarco.detector.sdLogVolName.trim()
    },
  },
  getters: {},
})
