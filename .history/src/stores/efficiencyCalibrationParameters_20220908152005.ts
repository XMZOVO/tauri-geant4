import { defineStore } from "pinia";

export const a1Store = defineStore("a1", {
  state: () => {
    return { value: 0 };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    set(value: number) {
      this.value = value;
    },
  },
});

export const a2Store = defineStore("a2", {
  state: () => {
    return { value: 0 };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    set(value: number) {
      this.value = value;
    },
  },
});
