<script setup lang="ts">
import UInput from '~/components/ui/UInput.vue'
import { useStore } from '~/stores/store'

const store = useStore()
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      模拟
    </div>
    <div op60>
      晶体名称(统计能量沉积的Volume)
    </div>
    <UInput v-model="store.cylinderName" h-10 rounded-md />
  </div>
</template>
