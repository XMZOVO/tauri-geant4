<script setup lang="ts">
import { useStore } from '~/stores/store'
import USwitch from '~/components/ui/USwitch.vue'
import USlide from '~/components/ui/USlide.vue'
const store = useStore()
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      渲染
    </div>
    <div op60>
      GDML解析器
    </div>
    <div flex flex-col gap-2>
      <div
        cursor-pointer bg-card-item items-center gap-2 flex px-3 h-10 rounded-md hover="bg-input/"
      >
        <div
          w-5 h-5
          :class="store.gdmlParser === 'VRML' ? 'i-carbon-radio-button-checked' : 'i-carbon-radio-button'"
        />
        <div>VRML</div>
      </div>
      <div
        cursor-pointer bg-card-item items-center gap-2 flex px-3 h-10 rounded-md hover="bg-input/"
      >
        <div
          w-5 h-5
          :class="store.gdmlParser === 'System' ? 'i-carbon-radio-button-checked' : 'i-carbon-radio-button'"
        />
        <div>System</div>
      </div>
    </div>
    <div flex gap-2>
      <div op60>
        渲染精细度（lineSegmentsPerCircle）
      </div>
      <div op100>
        {{ store.lineSegmentsPerCircle }}
      </div>
    </div>
    <USlide v-model="store.lineSegmentsPerCircle" min="100" max="1000" step="100" />
    <div b="b" op10 py-1 />
    <div flex justify-between items-center>
      <div op60 text-lg>
        随机着色
      </div>
      <USwitch />
    </div>
  </div>
</template>
