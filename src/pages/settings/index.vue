<script setup lang="ts">
import UInput from '~/components/ui/UInput.vue'
import { useStore } from '~/stores/store'

const store = useStore()

const trimName = () => {
  store.trimSdLogVolName()
}
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      模拟
    </div>
    <div op60>
      晶体名称(统计能量沉积的Volume,仅在导入GDML模式下生效)
    </div>
    <UInput v-model="store.gdmlMarco.detector.sdLogVolName" h-10 rounded-md @update:model-value="trimName" />
  </div>
</template>
