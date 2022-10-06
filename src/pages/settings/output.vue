<script setup lang="ts">
import USwitch from '../../components/ui/USwitch.vue'
import { useStore } from '~/stores/store'
import USlide from '~/components/ui/USlide.vue'

const store = useStore()
const changeTackVb = (index: string) => {
  store.marco.runtimeInfo.trackingVb = index
}

function test() {
}
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      输出信息
    </div>
    <!-- Raiod Group</div> -->
    <div op60>
      TrackingVerbose
    </div>
    <div flex flex-col gap-2>
      <div
        cursor-pointer bg-card-item items-center gap-2 flex px-3 h-10 rounded-md hover="bg-input/"
        @click="changeTackVb('0')"
      >
        <div
          w-5 h-5
          :class="store.marco.runtimeInfo.trackingVb === '0' ? 'i-carbon-radio-button-checked' : 'i-carbon-radio-button'"
        />
        <div>0：无tracking信息输出</div>
      </div>
      <div
        bg-card-item items-center gap-2 flex px-3 h-10 rounded-md cursor-pointer hover="bg-input/"
        @click="changeTackVb('1')"
      >
        <div
          :class="store.marco.runtimeInfo.trackingVb === '1' ? 'i-carbon-radio-button-checked' : 'i-carbon-radio-button'"
          w-5
        />
        <div>1</div>
      </div>
      <div
        bg-card-item items-center gap-2 flex px-3 h-10 rounded-md cursor-pointer hover="bg-input/"
        @click="changeTackVb('2')"
      >
        <div
          :class="store.marco.runtimeInfo.trackingVb === '2' ? 'i-carbon-radio-button-checked' : 'i-carbon-radio-button'"
          w-5 h-5
        />
        <div>2</div>
      </div>
    </div>
    <div flex gap-2>
      <div op60>
        PrintModulo
      </div>
      <div op100>
        {{ store.marco.runtimeInfo.printModulo }}
      </div>
    </div>
    <USlide v-model="store.marco.runtimeInfo.printModulo" min="10000" max="1000000" step="10000" />
    <div b="b" op10 py-1 />
    <div flex justify-between items-center>
      <div op60 text-lg>
        AnalysisVrbose
      </div>
      <USwitch v-model="store.marco.runtimeInfo.analysisVb" />
    </div>
  </div>
</template>
