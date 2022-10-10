<script setup lang="ts">
import USwitch from '~/components/ui/USwitch.vue'
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      参数
    </div>
    <div flex justify-between items-center>
      <div op60 text-lg>
        效率显示科学记数法
      </div>
      <USwitch />
    </div>
  </div>
</template>
