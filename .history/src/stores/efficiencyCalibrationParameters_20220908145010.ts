import { defineStore } from "pinia";

export const useCounterStore = defineStore("a1", {
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
