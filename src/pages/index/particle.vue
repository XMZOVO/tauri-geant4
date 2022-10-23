<script setup lang="ts">
import { useStore } from '~/stores/store'
import Collapse from '~/components/Collapse.vue'
import UInput from '~/components/ui/UInput.vue'
import USelect from '~/components/ui/USelect.vue'

const emit = defineEmits(['particlePositionChange', 'gpsChange', 'gpsVolumeChange'])
const store = useStore()
const sourceList = $ref(['Co60', 'Cs137', 'Eu152', 'Am241'])
const particlePositionChange = () => {
  emit('particlePositionChange', store.marco.particle.pos)
}
const sourceType = $ref(['point', 'volume'])
let selectedSourceType = $ref(store.marco.particle.type)

const gpsChange = (value: string) => {
  store.marco.particle.type = selectedSourceType = value
  emit('gpsChange', value)
}

const gpsVolumeChange = () => {
  emit('gpsVolumeChange', store.marco.particle.radius, store.marco.particle.halfZ)
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
          <div relative flex items-center>
            <UInput v-model="store.marco.particle.pos.x" text-xs rounded-sm h-5 w-16 @update:model-value="particlePositionChange" />
            <div absolute right-1>
              mm
            </div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Y
          </div>
          <div relative flex items-center>
            <UInput v-model="store.marco.particle.pos.y" text-xs rounded-sm h-5 w-16 @update:model-value="particlePositionChange" />
            <div absolute right-1>
              mm
            </div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Z
          </div>
          <div relative flex items-center>
            <UInput v-model="store.marco.particle.pos.z" text-xs rounded-sm h-5 w-16 @update:model-value="particlePositionChange" />
            <div absolute right-1>
              mm
            </div>
          </div>
        </div>
      </div>
    </Collapse>
    <Collapse title="粒子源" item-count="3">
      <div flex flex-col justify-center pt-3 gap-2 text-xs w-full>
        <div flex px-3>
          <div
            grid="~ cols-2"
            rounded-sm
            w-full
            items-center
            justify-center
            bg-input
          >
            <div
              v-for="(item, index) in sourceType"
              :key="item"
              text-center
              whitespace-nowrap
              :class="[
                {
                  'px-2 rounded-l border-r border-card-item': index === 0,
                  ' rounded-r border-l border-card-item': index === 1,
                },
                selectedSourceType === item
                  ? 'bg-blue-light hover:bg-blue-light'
                  : ' hover:bg-input-hover',
              ]"
              @click="gpsChange(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <!--  -->
        <div flex gap-2 items-center>
          <div text-end class="w-1/2">
            粒子数
          </div>
          <UInput v-model="store.marco.particle.number" text-xs rounded-sm h-5 w-16 />
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
    <Collapse title="体源参数" :class="store.marco.particle.type === 'point' ? 'pointer-events-none op-40' : ''" item-count="2">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            半径
          </div>
          <div relative flex items-center>
            <UInput v-model="store.marco.particle.radius" text-xs rounded-sm h-5 w-16 @update:model-value="gpsVolumeChange" />
            <div absolute right-1>
              mm
            </div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            半高
          </div>
          <div relative flex items-center>
            <UInput v-model="store.marco.particle.halfZ" text-xs rounded-sm h-5 w-16 @update:model-value="gpsVolumeChange" />
            <div absolute right-1>
              mm
            </div>
          </div>
        </div>
      </div>
    </Collapse>
  </div>
</template>
