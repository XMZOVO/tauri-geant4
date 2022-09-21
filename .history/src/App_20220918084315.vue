<script setup lang="ts">
let shown = $ref(false);
//设置延迟遮盖启动错乱
setTimeout(() => {
  shown = true;
}, 200);
</script>

<template>
  <div v-show="shown">
    <RouterView />
  </div>
</template>
