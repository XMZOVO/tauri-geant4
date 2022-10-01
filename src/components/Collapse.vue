<script setup lang="ts">
import gsap from "gsap";
import { onMounted, ref } from "vue";

const collapseTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } });
const collapseTitle = ref(null);
const collapseContent = ref(null);
const collapseArrow = ref(null);

let isCollapsed = $ref(true);

const props = defineProps<{ title: string; itemCount: string }>();

onMounted(() => {
  collapseTl
    .to(collapseTitle.value, {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      duration: 0,
    })
    .to(collapseArrow.value, { rotation: 90 })
    .to(
      collapseContent.value,
      {
        height: (1 + 1.75 * parseFloat(props.itemCount)).toString() + "rem",
      },
      "<"
    );
});

const expand = () => {
  if (isCollapsed) {
    collapseTl.play();
    isCollapsed = false;
  } else {
    collapseTl.reverse();
    isCollapsed = true;
  }
};
</script>

<template>
  <div overflow-auto>
    <div
      flex
      items-center
      w-full
      h-7
      bg-card-collapse
      rounded-md
      text-xs
      px-2
      gap-1
      relative
      ref="collapseTitle"
      @click="expand"
    >
      <div i-carbon-chevron-right ref="collapseArrow"></div>
      <div>{{ title }}</div>
      <div flex-grow></div>
      <div i-carbon-draggable rotate-90></div>
    </div>
    <!-- 内容 -->
    <div h-0 overflow-hidden rounded-b bg-card-collapse ref="collapseContent">
      <slot />
    </div>
  </div>
</template>
