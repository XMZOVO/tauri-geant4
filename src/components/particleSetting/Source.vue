<template>
  <div class="flex flex-col pt-3 gap-2 text-xs">
    <div class="flex gap-2 items-center">
      <div class="">粒子数</div>
      <input
        type="number"
        v-model="sourceNum"
        class="w-20 h-5 p-0 pr-6 px-2 rounded-sm bg-back border-item border text-xs focus:ring-0 focus:border-input-grey"
      />
    </div>
    <div class="flex gap-2 items-center h-5">
      <div class="">粒子源</div>
      <select
        class="appearance-none h-5 rounded-sm bg-back focus:outline-none focus:border-none focus:ring-0 border-none shadow-sm text-xs p-0 pl-2 w-20 text-txt"
        v-model="selectSource"
      >
        <option v-for="item in numList">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const sourceNum = $ref(1000);
const selectSource = $ref("Cs137");
const numList = $ref(["Cs137", "Co60", "Eu152"]);
</script>
