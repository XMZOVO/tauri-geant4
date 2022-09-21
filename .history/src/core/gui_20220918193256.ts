import { BladeApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { BladeController, View } from "@tweakpane/core";

interface FPSGraph extends BladeApi<BladeController<View>> {
  begin(): void;
  end(): void;
}

const PARAMS = {
  separate_x: 0,
};

// Debug
export const gui = new Pane();
gui.registerPlugin(EssentialsPlugin);

export const separateX = gui.addInput(PARAMS, "separate_x", {
  min: 0,
  max: 100,
});

export const fpsGraph = gui.addBlade({
  view: "fpsgraph",
  label: "fpsgraph",
}) as FPSGraph;
