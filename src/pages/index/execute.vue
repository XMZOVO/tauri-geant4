<script setup lang="ts">
import Collapse from "~/components/Collapse.vue";
</script>

<template>
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="输出结果" itemCount="3"></Collapse>
    <button
      bg-card-item
      px-2
      h-7
      rounded-md
      flex
      items-center
      justify-center
      gap-2
    >
      <div i-carbon-lightning></div>
      开始计算
    </button>
  </div>
</template>
