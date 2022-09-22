<script setup lang="ts">
let show = $ref(false);

setTimeout(() => {
  show = true;
}, 250);
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
