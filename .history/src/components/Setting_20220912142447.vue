<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
  <!-- <div class="card">
    <input id="greet-input" v-model="name" placeholder="输入..." />
    <button type="button" @click="greet()">Greet</button>
  </div> -->

  <!-- <p>{{ greetMsg }}</p> -->

  <div class="h-full w-2/3 space-y-6 border-r border-base-300 py-6 px-16">
    <!-- 系统设置 -->
    <div
      class="collapse-arrow collapse rounded-box border border-base-300 bg-base-100"
    >
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">系统设置</div>
      <div class="collapse-content">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">模拟计算完成自动跳转</span>
            <input type="checkbox" class="toggle" checked />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">刻度完成显示刻度曲线</span>
            <input type="checkbox" class="toggle" checked />
          </label>
        </div>
        <div class="flex justify-between pl-1 pt-2">
          <span class="label-text">模拟粒子数上限</span>
          <div class="flex w-1/3 flex-col items-center">
            <input
              type="range"
              min="0"
              max="100"
              value="25"
              class="range range-xs"
              step="25"
            />
            <div class="flex w-full justify-between px-2 text-xs">
              <span>1E3</span>
              <span>1E4</span>
              <span>1E5</span>
              <span>1E6</span>
              <span>1E7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 系统设置 -->
    <!-- 探测器设置 -->
    <div
      class="collapse-arrow collapse rounded-box border border-base-300 bg-base-100"
    >
      <input type="checkbox" class="toggle" />
      <div class="collapse-title text-xl font-medium">探测器结构数据</div>
      <div class="collapse-content"></div>
    </div>
    <!-- 探测器设置 -->
    <!-- 效率刻度设置 -->
    <div
      class="collapse-arrow collapse rounded-box border border-base-300 bg-base-100"
    >
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">效率刻度设置</div>
      <div class="collapse-content">
        <div class="flex items-center justify-between">
          <span class="label-text">效率刻度方式</span>
          <select
            class="select select-bordered select-sm w-full max-w-xs focus:outline-none"
          >
            <option selected>线性拟合</option>
            <option>二次拟合</option>
            <option>多项式拟合</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 效率刻度设置 -->

    <!-- 底部双卡片 -->
  </div>
</template>
