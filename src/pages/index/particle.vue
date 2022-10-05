<script setup lang="ts">
import { useStore } from '~/stores/store'
import Collapse from '~/components/Collapse.vue'
import UInput from '~/components/ui/UInput.vue'
import USelect from '~/components/ui/USelect.vue'

const store = useStore()
const sourceList = $ref(['Co60', 'Cs137', 'Eu152'])

const sourcePositionChange = () => {

}
</script>

<template>
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="变换" item-count="3">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            坐标 X
          </div>
          <UInput v-model="store.marco.particle.pos.x" @update:model-value="sourcePositionChange">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Y
          </div>
          <UInput v-model="store.marco.particle.pos.y" @update:model-value="sourcePositionChange">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Z
          </div>
          <UInput v-model="store.marco.particle.pos.z" @update:model-value="sourcePositionChange">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
      </div>
    </Collapse>
    <Collapse title="粒子源" item-count="2">
      <div flex flex-col justify-center pt-3 gap-2 text-xs w-full>
        <div flex gap-2 items-center>
          <div text-end class="w-1/2">
            粒子数
          </div>
          <UInput v-model="store.marco.particle.pos.x" />
        </div>
        <div flex gap-2 items-center h-5>
          <div class="w-1/2" text-end>
            粒子源
          </div>
          <USelect v-model="store.marco.particle.source">
            <option v-for="item in sourceList" :key="item">
              {{ item }}
            </option>
          </USelect>
        </div>
      </div>
    </Collapse>
  </div>
</template>
