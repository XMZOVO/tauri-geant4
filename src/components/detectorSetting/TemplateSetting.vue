<script setup lang="ts">
let selectedTemplate = $ref(0);
const detectorTemplates = $ref(["碘化钠", "溴化镧", "高纯锗"]);

const changeTemplate = (index: number) => {
  if (index == 0) selectedTemplate = index;
};

const importGDML = () => {
  selectedTemplate = -1;
};
</script>

<template>
  <div class="flex flex-col gap-2 text-xs w-full items-center pt-3">
    <div class="flex w-11/12 justify-center">
      <div
        class="grid grid-cols-3 rounded-sm w-full items-center justify-center bg-input-grey cursor-default"
      >
        <div
          @click="changeTemplate(index)"
          v-for="(item, index) in detectorTemplates"
          :class="[
            'text-center hover:bg-input-hover',
            {
              'px-2 rounded-l border-r border-item': index == 0,
              ' rounded-r border-l border-item': index == 2,
              'bg-light-blue hover:bg-light-blue':
                selectedTemplate == 0 && index == 0,
            },
          ]"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div
      :class="[
        'flex bg-input-grey justify-center items-center px-2 h-5 rounded-sm w-11/12 relative hover:bg-input-hover',
        {
          'bg-light-blue hover:bg-light-blue': selectedTemplate == -1,
        },
      ]"
    >
      <div class="i-carbon-add absolute left-2 w-4 h-4"></div>
      <button @click="importGDML">导入GDML模型</button>
    </div>
  </div>
</template>
