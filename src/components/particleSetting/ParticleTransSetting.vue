<template>
  <div class="flex flex-col pt-3 gap-2">
    <div class="flex flex-col" v-for="item in settings">
      <div
        class="flex justify-end gap-2 text-xs items-center"
        v-for="pos in item.children"
      >
        <div>{{ pos.name }}</div>
        <div class="relative shadow-sm">
          <input
            type="number"
            v-model="pos.value"
            class="w-20 h-5 p-0 pr-6 px-2 rounded-sm bg-back border-item border text-xs focus:ring-0 focus:border-input-grey"
          />
          <div class="absolute right-2 top-0">cm</div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="flex items-center justify-center text-xs text-txt gap-3 pt-4"> -->
  <!-- <div class="items-end flex flex-col gap-2">
      <div v-for="items in settings">{{ items.name }}</div>
    </div>
    <div></div> -->

  <!-- <div>{{ items.name }}</div>
    <div class="space-y-1">
      <div class="flex items-center gap-1">
        <input
          type="number"
          class="w-10 px-1 py-0 h-5 text-xs rounded-md"
          :value="items.value"
        />
      </div>
    </div> -->
  <!-- </div> -->
</template>

<script setup lang="ts">
import { emit } from "process";
import { Vector3 } from "three";

const settings = $ref([
  {
    name: "坐标",
    children: [
      {
        name: "坐标 X",
        value: 0,
      },
      {
        name: "Y",
        value: 0,
      },
      {
        name: "Z",
        value: 0,
      },
    ],
  },
]);
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
