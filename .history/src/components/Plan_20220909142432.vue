<template>
  <div class="py-6 px-10">
    <ul class="steps steps-vertical">
      <li class="step step-primary">
        <div class="grid auto-cols-max grid-flow-col gap-5 text-center">
          <div
            class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content"
          >
            <span class="countdown font-mono text-5xl">
              <span style="--value: 15"></span>
            </span>
            days
          </div>
          <div
            class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content"
          >
            <span class="countdown font-mono text-5xl">
              <span style="--value: 10"></span>
            </span>
            hours
          </div>
          <div
            class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content"
          >
            <span class="countdown font-mono text-5xl">
              <span style="--value: 24"></span>
            </span>
            min
          </div>
          <div
            class="rounded-box flex flex-col bg-neutral p-2 text-neutral-content"
          >
            <span class="countdown font-mono text-5xl">
              <span style="--value: 39"></span>
            </span>
            sec
          </div>
        </div>
      </li>
      <li class="step step-primary">Choose plan</li>
      <li class="step">Purchase</li>
      <li class="step">Receive Product</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const timeNow = ref("");
const plan = ref([
  { time: timeNow, plan: "" },
  { time: "2022 12 9", plan: "拿下JLPT N2等级考试" },
  { time: "2022 12 31", plan: "完成毕设" },
  { time: "2023 6", plan: "顺利毕业" },
  { time: "???? ?? ??", plan: "新人生" },
]);
</script>
