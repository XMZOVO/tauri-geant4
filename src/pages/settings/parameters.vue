<script setup lang="ts">
import USwitch from '~/components/ui/USwitch.vue'
import { useStore } from '~/stores/store'
import UInput from '~/components/ui/UInput.vue'

const store = useStore()
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      参数
    </div>
    <div op60>
      FWHM系数
    </div>
    <div grid grid-cols-3 gap-2>
      <div op60 text-md>
        fA
      </div>
      <div op60 text-md>
        fB
      </div>
      <div op60 text-md>
        fC
      </div>
      <UInput v-model="store.specParams.fA" p-2 rounded-md />
      <UInput v-model="store.specParams.fB" p-2 rounded-md />
      <UInput v-model="store.specParams.fC" p-2 rounded-md />
    </div>
    <div b="b" op10 py-1 />
    <div flex justify-between items-center>
      <div op60 text-lg>
        效率显示科学记数法
      </div>
      <USwitch v-model="store.showSciencedata" />
    </div>
  </div>
</template>
