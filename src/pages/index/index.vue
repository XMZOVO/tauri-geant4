<script setup lang="ts">
import { onMounted } from 'vue'
import { open, save } from '@tauri-apps/api/dialog'
import { BaseDirectory, copyFile } from '@tauri-apps/api/fs'
import URange from '../../components/ui/URange.vue'
import Collapse from '~/components/Collapse.vue'
import { useStore } from '~/stores/store'
import UInput from '~/components/ui/UInput.vue'
import UCheck from '~/components/ui/UCheck.vue'

const emit = defineEmits([
  // 'positionChange',
  'opacityChange',
  'axisVisibleChange',
  'worldVisibleChange',
  'dirLightIntensityChange',
  'dirLightPosChange',
  'importGdml',
  'viewVrmlScene',
  'changeTemplate',
])

const store = useStore()
const detectorTemplates = $ref(['碘化钠', '溴化镧', '高纯锗'])

let selectedTemplate = $ref(store.detectorTemplate)

const changeTemplate = (index: number) => {
  if (index === 0) {
    selectedTemplate = store.detectorTemplate = index.toString()
    emit('changeTemplate', index)
  }
}

const importGDML = async () => {
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'Model',
      extensions: ['gdml'],
    }],
  })
  if (selected) {
    emit('importGdml', selected)
    selectedTemplate = store.detectorTemplate = '-1'
  }
}

// const positionChange = () => {
//   emit('positionChange', {
//     x: store.marco.detector.pos.x,
//     y: store.marco.detector.pos.y,
//     z: store.marco.detector.pos.z,
//   })
// }

const opacityChange = () => {
  emit('opacityChange', store.detectorOpacity)
}

const axisVisibleChange = () => {
  emit('axisVisibleChange', store.showAxes)
}

const worldVisibleChange = () => {
  emit('worldVisibleChange', store.showWorldVolume)
}

const dirLightIntensityChange = () => {
  emit('dirLightIntensityChange', store.dirLightIntensity)
}

const dirLightPosChange = () => {
  emit('dirLightPosChange', {
    x: store.dirLightPos.x,
    y: store.dirLightPos.y,
    z: store.dirLightPos.z,
  })
}

const viewVrmlScene = async () => {
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'Scene',
      extensions: ['wrl'],
    }],
  })
  if (selected)
    emit('viewVrmlScene', selected)
}
</script>

<template>
  <!-- 设置overflow为hidden防止gsap元素不更新 -->
  <div flex flex-col gap-2 text-xs overflow-hidden>
    <Collapse title="模版" item-count="2">
      <div flex flex-col gap-2 p-3>
        <div flex>
          <div
            grid="~ cols-3"
            rounded-sm
            w-full
            items-center
            justify-center
            bg-input
          >
            <div
              v-for="(item, index) in detectorTemplates"
              :key="item"
              text-center
              whitespace-nowrap
              :class="[
                {
                  'px-2 rounded-l border-r border-card-item': index === 0,
                  ' rounded-r border-l border-card-item': index === 2,
                },
                selectedTemplate === index.toString()
                  ? 'bg-blue-light hover:bg-blue-light'
                  : ' hover:bg-input-hover',
              ]"
              @click="changeTemplate(index)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <button
          flex

          justify-center
          items-center
          px-2
          h-5
          rounded-sm
          w-full
          relative
          :class="[
            selectedTemplate === '-1' ? 'bg-blue-light hover:bg-blue-light' : 'hover:bg-input-hover bg-input',
          ]"
          @click="importGDML"
        >
          <div i-carbon-add absolute left-2 w-4 h-4 />导入GDML模型
        </button>
      </div>
    </Collapse>
    <Collapse :class="store.detectorTemplate === '-1' ? 'pointer-events-none op-40' : ''" title="探测器参数" item-count="5">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            晶体高度
          </div>
          <UInput v-model="store.marco.detector.cylinderH">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            晶体半径
          </div>
          <UInput v-model="store.marco.detector.cylinderR">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            反射层顶厚
          </div>
          <UInput v-model="store.marco.detector.reflectTT">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            侧壁厚
          </div>
          <UInput v-model="store.marco.detector.reflectST">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            PMT厚
          </div>
          <UInput v-model="store.marco.detector.pmtT">
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
      </div>
    </Collapse>
    <!-- <Collapse title="变换" item-count="4">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            坐标X
          </div>
          <UInput
            v-model="store.marco.detector.pos.x"
            @update:model-value="positionChange"
          >
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Y
          </div>
          <UInput
            v-model="store.marco.detector.pos.y"
            @update:model-value="positionChange"
          >
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Z
          </div>
          <UInput
            v-model="store.marco.detector.pos.z"
            @update:model-value="positionChange"
          >
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>

      </div>
    </Collapse> -->
    <Collapse title="场景" item-count="8">
      <div flex flex-col pt-3 gap-2 text-xs text-txt px-5 w-full>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/3" text-end whitespace-nowrap text-xs>
            显示
          </div>
          <div flex gap-1 items-center justify-start flex-grow>
            <UCheck
              v-model="store.showAxes"
              @update:model-value="axisVisibleChange"
            />
            <div>坐标辅助线</div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/3" text-end whitespace-nowrap text-xs />
          <div flex gap-1 items-center justify-start flex-grow>
            <UCheck
              v-model="store.showWorldVolume"
              @update:model-value="worldVisibleChange"
            />
            <div>世界卷</div>
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/3" text-end whitespace-nowrap text-xs>
            灯光
          </div>
          <div flex gap-1 items-center justify-start flex-grow>
            <div whitespace-nowrap>
              强度
            </div>
            <URange
              v-model="store.dirLightIntensity"
              @update:model-value="dirLightIntensityChange"
            />
          </div>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            X
          </div>
          <UInput
            v-model="store.dirLightPos.x"
            @update:model-value="dirLightPosChange"
          >
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Y
          </div>
          <UInput
            v-model="store.dirLightPos.y"
            @update:model-value="dirLightPosChange"
          >
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            Z
          </div>
          <UInput
            v-model="store.dirLightPos.z"
            @update:model-value="dirLightPosChange"
          >
            <div absolute flex items-center h-full right-1>
              cm
            </div>
          </UInput>
        </div>
        <div flex gap-2 justify-end items-center>
          <div class="w-1/2" text-end whitespace-nowrap>
            透明度
          </div>
          <URange
            v-model="store.detectorOpacity"
            @update:model-value="opacityChange"
          />
        </div>
        <button
          bg-input
          px-2
          h-6
          rounded-md
          flex
          items-center
          justify-center
          gap-2
          hover:bg-input-hover
          @click="viewVrmlScene"
        >
          <div i-carbon-add />
          导入VRML场景
        </button>
      </div>
    </Collapse>
  </div>
</template>
