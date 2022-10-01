<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
  }
);

const emits = defineEmits(["update:modelValue"]);

const value = useVModel(props, "modelValue", emits);
</script>
<template>
  <div class="flex relative">
    <input
      type="checkbox"
      v-model="value"
      rounded-sm
      bg-input-grey
      border-item
      w-3
      h-3
      text-blue
    />
    <slot />
  </div>
</template>
