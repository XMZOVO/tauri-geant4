<script setup lang="ts">
let show = $ref(false);

setTimeout(() => {
  show = true;
}, 300);
</script>

<template>
  <div v-show="show">
    <RouterView />
  </div>
</template>
