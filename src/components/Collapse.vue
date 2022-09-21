<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

onUnmounted(() => {
  if (arrowAnime) arrowAnime.revert();
});

let isCollapse = true;
let arrowAnime: gsap.core.Tween;

const test = () => {
  isCollapse
    ? gsap.to("#test", { height: 200, duration: 0.3 })
    : gsap.to("#test", { height: "1.25rem", duration: 0.3 });
  isCollapse
    ? (arrowAnime = gsap.to("#arrow", { rotation: 90, duration: 0.3 }))
    : (arrowAnime = gsap.to("#arrow", { rotation: 0, duration: 0.3 }));
  isCollapse = !isCollapse;
};
</script>

<template>
  <div class="flex flex-col text-center justify-start h-full p-10">
    <div
      @click="test"
      id="test"
      class="h-5 overflow-hidden w-40 shadow-md border border-gray-300 rounded-md bg-gray-200"
    >
      <div
        class="rounded-md flex items-center justify-between w-full h-5 cursor-default"
      >
        <div class="flex items-center gap-1 ml-2">
          <div id="arrow" class="i-carbon-arrow-right"></div>
          <label class="text-xs font-sans">折叠窗口</label>
        </div>
        <div class="i-carbon-draggable rotate-90 mr-2"></div>
      </div>
      <div class="w-full h-60 bg-gray-200 relative">
        <p class="absolute top-1">hidden label</p>
        <p class="absolute top-1/3">hidden label</p>
        <p class="absolute bottom-1">hidden label</p>
      </div>
    </div>
  </div>
</template>
