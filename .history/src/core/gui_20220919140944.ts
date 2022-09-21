import { BladeApi, Pane } from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { BladeController, View } from "@tweakpane/core";

interface FPSGraph extends BladeApi<BladeController<View>> {
  begin(): void;
  end(): void;
}

const PARAMS = {
  separateX: 0,
  opacity: 0.6,
  randomColor: false,
};

// Debug
export const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);

export const fpsGraph = pane.addBlade({
  view: "fpsgraph",
  label: "fpsgraph",
}) as FPSGraph;

export const separateX = pane.addInput(PARAMS, "separateX", {
  min: 0,
  max: 100,
});

export const opacity = pane.addInput(PARAMS, "opacity", {
  min: 0,
  max: 1,
});

export const randomColor = pane.addInput(PARAMS, "randomColor");

export const viewRsult = pane.addButton({ title: "预览" });
