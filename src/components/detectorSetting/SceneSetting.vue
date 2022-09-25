<template>
  <div class="flex flex-col align-top pt-3 gap-2">
    <div
      class="flex justify-center items-start gap-2 text-xs"
      v-for="item in settings"
    >
      <div>{{ item.name }}</div>
      <div class="flex flex-col gap-2">
        <div
          class="flex items-center gap-1"
          v-for="(child, i) in item.children"
        >
          <!-- checkBox -->
          <div
            @click="checkChanged(i)"
            class="bg-input-grey hover:bg-input-hover w-3 h-3 flex items-center justify-center rounded-sm"
          >
            <div :class="child.value ? 'i-carbon-checkmark bg-txt' : ''"></div>
          </div>
          <div>{{ child.name }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div
    class="flex items-start justify-center text-xs text-txt gap-3 pt-4"
    v-for="items in settings"
  >
    <div>{{ items.name }}</div>
    <div class="space-y-1">
      <div class="flex items-center gap-1" v-for="item in items.children">
        <div
          class="i-carbon-checkbox w-4 h-4 bg-input-grey hover:bg-input-hover"
        ></div>
        <div class="">{{ item.name }}</div>
      </div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const settings = $ref([
  {
    name: "显示",
    children: [
      { name: "坐标辅助线", value: true },
      { name: "世界卷", value: true },
    ],
  },
]);
const emit = defineEmits(["axeVisibleChange", "worldVisibleChange"]);

const checkChanged = (index: number) => {
  switch (index) {
    case 0: {
      emit("axeVisibleChange", !settings[0].children[0].value);
      settings[0].children[0].value = !settings[0].children[0].value;
      break;
    }
    case 1: {
      emit("worldVisibleChange", !settings[0].children[1].value);
      settings[0].children[1].value = !settings[0].children[1].value;
      break;
    }
  }
};
</script>
