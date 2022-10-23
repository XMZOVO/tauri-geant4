<script setup lang="ts">
import Collapse from '~/components/Collapse.vue'
import UCheck from '~/components/ui/UCheck.vue'
import { useStore } from '~/stores/store'
import UInput from '~/components/ui/UInput.vue'

const emits = defineEmits(['executeSimulate', 'enableRealtimeInfoChange'])

const store = useStore()

const executeSimulate = () => {
  emits('executeSimulate')
}

const enableRealtimeInfoChange = (value: boolean) => {
  emits('enableRealtimeInfoChange', value)
}
</script>

<template>
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="输出结果" item-count="2">
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
          </div>
          <UCheck v-model="store.enableRealtimeInfo" @update:model-value="enableRealtimeInfoChange" />
        </div>
      </div>
    </Collapse>
    <Collapse title="备注信息" item-count="4">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex items-center justify-between>
          <div flex gap-1 items-center>
            <div>
              标题
            </div>
          </div>
          <UInput v-model="store.marco.additionalInfo.title" text-xs rounded-sm h-5 w-25 />
        </div>
        <div flex items-center justify-between>
          <div flex gap-1 items-center>
            <div>
              备注
            </div>
          </div>
          <textarea
            v-model="store.marco.additionalInfo.description"
            w-25 h-18 bg-back focus="outline-none ring-0 border-none"
            text-xs p="x-2 y-1" appearance-none rounded-sm border="none" sb
          />
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
