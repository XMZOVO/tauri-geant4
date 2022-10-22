<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  nuclide: string
  number: string
  type: string
}>()
</script>

<template>
  <div bg-card flex w-40 flex-col rounded="md" shadow="lg back" text-sm border="~ card-item">
    <div flex justify-between border="b card-item">
      <div p-2 max-h="10" flex-1 font-bold>
        核素
      </div>
      <div p-2 max-h="10" flex-1 op80>
        {{ nuclide }}
      </div>
    </div>
    <div flex justify-between border="b card-item">
      <div p-2 max-h="10" flex-1 font-bold>
        数量
      </div>
      <div p-2 max-h="10" flex-1 op80>
        {{ number }}
      </div>
    </div>
    <div flex justify-between>
      <div p-2 max-h="10" flex-1 font-bold>
        类型
      </div>
      <div p-2 max-h="10" flex-1 op80>
        {{ type }}
      </div>
    </div>
  </div>
</template>
