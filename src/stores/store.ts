import { defineStore } from 'pinia'

interface Marco {
  detector: NaIDetect
  particle: Particle
  runtimeInfo: RuntimeInfo
}

interface GdmlMarco {
  detector: string
  particle: Particle
  runtimeInfo: RuntimeInfo
}

interface Particle {
  source: string
  number: string
  pos: Pos
  dir: Pos
}

interface NaIDetect {
  cylinderH: string
  cylinderR: string
  reflectTT: string
  reflectST: string
  reflectMat: string
  pmtT: string
}

interface RuntimeInfo {
  trackingVb: string
  printModulo: string
  analysisVb: string
}

interface LastSimulationInfo {
  totalParticles: string
  detectorTemplate: string
  source: string
  totalTime: string
  detectorParams: NaIDetect | null
  particlePos: Pos
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
        pos: { x: '25.0', y: '0.0', z: '0.0' },
        dir: { x: '0.0', y: '0.0', z: '-1.0' },
      },
      runtimeInfo: {
        trackingVb: '0',
        printModulo: '100000',
        analysisVb: '0',
      },
    } as Marco,
    gdmlMarco: {} as GdmlMarco,
    lastSimulationInfo: {} as LastSimulationInfo,
    detectorTemplate: '0',
    totalTime: '00:00:00',
    detectorOpacity: 0.6,
    showAxes: true,
    showWorldVolume: true,
    dirLightIntensity: 1.0,
    dirLightPos: { x: '0', y: '10', z: '0' } as Pos,
    spectrumData: {} as spectrumData,
    nuclideList: [] as nuclide[],
    clibrateMethod: '线性',
    showCalibrateCurve: true,
    gdmlParser: 'Vtk',
    currentSceneUrl: '',
  }),
  getters: {},
})
