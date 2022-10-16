<script setup lang="ts">
import UInput from '~/components/ui/UInput.vue'
import { useStore } from '~/stores/store'

const store = useStore()
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      结果
    </div>
    <div op60>
      最小能量值
    </div>
    <div flex gap-2 items-center>
      <UInput v-model="store.specParams.minEn" w="1/2" p-2 rounded-md />
      <div op60>
        MeV
      </div>
    </div>
    <div op60>
      最大能量值
    </div>
    <div flex gap-2 items-center>
      <UInput v-model="store.specParams.maxEn" w="1/2" p-2 rounded-md />
      <div op60>
        MeV
      </div>
    </div>
    <div op60>
      总道址数
    </div>
    <UInput v-model="store.specParams.ch" w="1/2" p-2 rounded-md />
  </div>
</template>
