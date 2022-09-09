<template>
  <div class="w-full py-6 px-10">
    <ul class="steps steps-vertical w-full">
      <li class="step step-primary w-full">
        <div>
          <div class="flex gap-5">
            <div>
              <span class="countdown font-mono text-2xl">
                <span style="--value: 15"></span>
              </span>
              days
            </div>
            <div>
              <span class="countdown font-mono text-2xl">
                <span style="--value: 10"></span>
              </span>
              hours
            </div>
            <div>
              <span class="countdown font-mono text-2xl">
                <span style="--value: 24"></span>
              </span>
              min
            </div>
            <div>
              <span class="countdown font-mono text-2xl">
                <span :style="'--value: ' + timeNow"></span>
              </span>
              sec
            </div>
          </div>
          <span>sss</span>
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
const timeNow = ref();
const plan = ref([
  { time: timeNow, plan: "" },
  { time: "2022 12 9", plan: "拿下JLPT N2等级考试" },
  { time: "2022 12 31", plan: "完成毕设" },
  { time: "2023 6", plan: "顺利毕业" },
  { time: "???? ?? ??", plan: "新人生" },
]);

setInterval(() => {
  let time = new Date();
  timeNow.value = time.getSeconds();
});
</script>
