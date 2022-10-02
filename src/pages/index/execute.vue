<script setup lang="ts">
import Collapse from '~/components/Collapse.vue'

const emits = defineEmits(['executeSimulate'])
const executeSimulate = () => {
  emits('executeSimulate')
}
</script>

<template>
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="输出结果" item-count="3" />
    <button
      bg-card-item
      px-2
      h-7
      rounded-md
      flex
      items-center
      justify-center
      gap-2
      @click="executeSimulate"
    >
      <div i-carbon-lightning />
      开始计算
    </button>
  </div>
</template>
