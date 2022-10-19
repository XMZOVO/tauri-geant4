<script setup lang="ts">
import Collapse from '~/components/Collapse.vue'
import UCheck from '~/components/ui/UCheck.vue'
import { useStore } from '~/stores/store'

const emits = defineEmits(['executeSimulate'])

const store = useStore()

const executeSimulate = () => {
  emits('executeSimulate')
}
</script>

<template>
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="输出结果" item-count="1">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex items-center justify-between>
          <div flex gap-1 items-center>
            <div>
              记录Trajectory
            </div>
            <div op60 hover="op100" text-red i-carbon-warning-filled />
          </div>
          <UCheck v-model="store.marco.runtimeInfo.enableTajectory" />
        </div>
        <div flex items-center justify-between>
          <div flex gap-1 items-center>
            <div>
              实时输出
            </div>
            <div op60 hover="op100" text-red i-carbon-warning-filled />
          </div>
          <UCheck v-model="store.marco.runtimeInfo.enableTajectory" />
        </div>
      </div>
    </Collapse>
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
