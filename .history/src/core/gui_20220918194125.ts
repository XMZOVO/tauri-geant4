import { BladeApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { BladeController, View } from "@tweakpane/core";

interface FPSGraph extends BladeApi<BladeController<View>> {
  begin(): void;
  end(): void;
}

const PARAMS = {
  separate_x: 0,
  opacity: 0.6,
};

// Debug
export const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);

export const separateX = pane.addInput(PARAMS, "separate_x", {
  min: 0,
  max: 100,
});

export const opacity = pane.addInput(PARAMS, "opacity", {
  min: 0,
  max: 1,
});

export const fpsGraph = pane.addBlade({
  view: "fpsgraph",
  label: "fpsgraph",
}) as FPSGraph;
