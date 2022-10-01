<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: "CO-60",
    disabled: false,
  }
);

const emits = defineEmits(["update:modelValue"]);

const value = useVModel(props, "modelValue", emits);
</script>
<template>
  <div class="flex relative">
    <select
      h-5
      rounded-sm
      bg-back
      focus:outline-none
      focus:border-none
      focus:ring-0
      border-none
      shadow-sm
      text-xs
      p-0
      pl-2
      w-16
      v-model="value"
    >
      <slot />
    </select>
  </div>
</template>
