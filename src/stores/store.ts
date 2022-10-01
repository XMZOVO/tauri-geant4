import { defineStore } from "pinia";

interface NaIDetect {
  cylinderH: number;
  cylinderR: number;
  reflectTT: number;
  reflectST: number;
  reflectMat: string;
  pmtT: number;
}

interface LastSimulationInfo {
  totalParticles: number;
  detectorTemplate: string;
  source: string;
  totalTime: string;
  detectorParams: NaIDetect | null;
  particlePos: number[];
}
interface spectrumData {
  countList: number[];
  energyList: number[];
  fwhmCountList: number[];
}
interface nuclide {
  id: number;
  nuclide: string;
  energy: number;
  percent: number;
  halfLife: string;
  halfLifeUnit: string;
}

interface Pos {
  x: number;
  y: number;
  z: number;
}

const defaultNaIDetect: NaIDetect = {
  cylinderH: 7.6,
  cylinderR: 3.8,
  reflectTT: 0.3,
  reflectST: 0.2,
  reflectMat: "G4_ALUMINUM_OXIDE",
  pmtT: 3,
};

export const useStore = defineStore("stores", {
  state: () => ({
    naIDetector: {
      cylinderH: 7.6,
      cylinderR: 3.8,
      reflectTT: 0.3,
      reflectST: 0.2,
      reflectMat: "G4_ALUMINUM_OXIDE",
      pmtT: 3,
    } as NaIDetect,
    lastSimulationInfo: {} as LastSimulationInfo,
    detectorTemplate: "NaI",
    source: "Co60",
    totalParticles: 1e6,
    totalTime: "00:00:00",
    detectorPos: { x: 0, y: 0, z: 0 } as Pos,
    particlePos: { x: 25.0, y: 0, z: 0 } as Pos,
    detectorOpacity: 0.6,
    showAxes: true,
    showWorldVolume: true,
    dirLightIntensity: 1.0,
    dirLightPos: { x: 0, y: 10, z: 0 } as Pos,
    spectrumData: {} as spectrumData,
    nuclideList: [] as nuclide[],
  }),
  getters: {},
});
