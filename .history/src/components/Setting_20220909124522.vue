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

  <div class="h-full w-2/3 space-y-6 border-r py-6 px-16">
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
        <div class="flex justify-between pl-1 pt-1">
          <span class="label-text">刻度完成显示刻度曲线</span>
          <div class="flex flex-col">
            <input
              type="range"
              min="0"
              max="100"
              value="25"
              class="range"
              step="25"
            />
            <div class="flex w-full justify-between px-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
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
      <input type="checkbox" />
      <div class="collapse-title text-xl font-medium">探测器结构数据</div>
      <div class="collapse-content">
        <div class="flex space-x-5">
          <!-- 1 -->
          <div class="card w-1/2 bg-base-100">
            <div class="card-body justify-between">
              <div class="form-control w-full max-w-full">
                <label class="label">
                  <span class="label-text">井筒内径层次</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  class="input input-bordered input-sm w-full max-w-xs focus:outline-none"
                />
              </div>
              <div class="form-control w-full max-w-full">
                <label class="label">
                  <span class="label-text">深度</span>
                </label>
                <input
                  type="text"
                  placeholder="单位(m)"
                  class="input input-bordered input-sm w-full max-w-full focus:outline-none"
                />
              </div>
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">内径</span>
                </label>
                <input
                  type="text"
                  placeholder="单位(m)"
                  class="input input-bordered input-sm w-full max-w-full focus:outline-none"
                />
              </div>
            </div>
          </div>
          <!-- 2 -->
          <div class="card w-1/2 bg-base-100">
            <div class="card-body justify-between">
              <div class="form-control w-full max-w-full">
                <label class="label">
                  <span class="label-text">钻具外径层次</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  class="input input-bordered input-sm w-full max-w-xs focus:outline-none"
                />
              </div>
              <div class="form-control w-full max-w-full">
                <label class="label">
                  <span class="label-text">深度</span>
                </label>
                <input
                  type="text"
                  placeholder="单位(m)"
                  class="input input-bordered input-sm w-full max-w-full focus:outline-none"
                />
              </div>
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">内径</span>
                </label>
                <input
                  type="text"
                  placeholder="单位(m)"
                  class="input input-bordered input-sm w-full max-w-full focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 探测器设置 -->

    <!-- 底部双卡片 -->
  </div>
</template>
