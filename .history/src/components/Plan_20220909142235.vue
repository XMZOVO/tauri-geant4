<template>
  <div class="py-6 px-10">
    <ul class="steps steps-vertical">
      <li class="step step-primary">Register</li>
      <li class="step step-primary">Choose plan</li>
      <li class="step">Purchase</li>
      <li class="step">Receive Product</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
const timeNow = ref("")
const plan = ref([{time:timeNow, plan:""}, {time:,plan:"拿下JLPT N2等级考试"},{time:, plan:"完成毕设"},{time:, plan:"顺利毕业"},{time:"???? ?? ??",plan:"新人生"}])
</script>
