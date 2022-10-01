<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    disabled?: boolean;
  }>(),
  {
    modelValue: 1,
    disabled: false,
  }
);

const emits = defineEmits(["update:modelValue"]);

const value = useVModel(props, "modelValue", emits);
</script>
<template>
  <div class="flex relative">
    <input
      v-model.number="value"
      type="range"
      min="0.0"
      max="1.0"
      step="0.01"
      w-16
      h-5
    />
    <slot />
  </div>
</template>
