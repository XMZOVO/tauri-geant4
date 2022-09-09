<template>
  <div class="w-full py-10 px-10">
    <ul class="steps steps-vertical w-full">
      <li class="step step-primary w-full">
        <div class="flex flex-col items-start">
          <div class="flex gap-5">
            <div>
              <span class="countdown font-mono text-2xl">
                <span :style="'--value: ' + time1.d"></span>
              </span>
              days
            </div>
            <div>
              <span class="countdown font-mono text-2xl">
                <span style="--value: 9"></span>
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
                <span :style="'--value: ' + time1.m"></span>
              </span>
              sec
            </div>
          </div>
          <span class="text-gray-500">sss</span>
        </div>
      </li>
      <li class="step">Choose plan</li>
      <li class="step">Purchase</li>
      <li class="step">Receive Product</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const time1 = ref({ d: 1, h: 1, m: 1, s: 1 });
const time2 = ref({ d: 1, h: 1, m: 1, s: 1 });
const time3 = ref({ d: 1, h: 1, m: 1, s: 1 });
const time4 = ref({ d: 1, h: 1, m: 1, s: 1 });

const plan = ref([
  { time: "2022 12 9", plan: "拿下JLPT N2等级考试" },
  { time: "2022 12 31", plan: "完成毕设" },
  { time: "2023 6", plan: "顺利毕业" },
  { time: "???? ?? ??", plan: "新人生" },
]);

setInterval(() => {
  let timeNow = getISOTime();
  console.log(timeNow);

  time1.value.d = DifferDayTime(timeNow, "2022-12-09 00:00:00");
});

const DifferDayTime = function (startDate: string, endDate: string) {
  // 一天等于86400000毫秒
  return Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
  );
};

const DifferHourTime = function (startDate: string, endDate: string) {
  // 一小时等于3600000毫秒
  return Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 3600000
  );
};

const DifferMinuteTime = function (startDate: string, endDate: string) {
  // 一分钟等于60000毫秒
  return Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 60000
  );
};

const DifferSecondTime = function (startDate: string, endDate: string) {
  // 一秒等于1000毫秒
  return Math.floor(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000
  );
};

const getISOTime = () => {
  let time = new Date();
  time.setHours(time.getHours() + 8);
  let timeString: string = time.toISOString();
  timeString = timeString.substring(0, 10);
  return timeString;
};
</script>
