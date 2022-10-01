<script setup lang="ts">
import { useRouter } from "vue-router";
import gsap from "gsap";
import Collapse from "./components/Collapse.vue";
import { onMounted, ref } from "vue";

const navTab = ref(null);
const navTabTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } });
const router = useRouter();
const navBarItem = $ref([
  { name: "主页", path: "/", icon: "i-carbon-home" },
  { name: "概览", path: "/overview", icon: "i-carbon-chart-rose" },
  { name: "结果", path: "/results", icon: "i-carbon-result" },
  { name: "设置", path: "/settings", icon: "i-carbon-settings" },
]);

onMounted(() => {
  gsap.from(".navBar", { x: "-100%", duration: 0.5 });
});

const navToPage = async (index: number) => {
  navTabTl.to(navTab.value, { y: index * 100 + "%", duration: 0.2 });
  await navTabTl.play();
  await router.push(navBarItem[index].path);
};
</script>

<template>
  <main text="txt" h-screen w-screen bg-back flex cursor-default>
    <!-- SideBar -->
    <div
      class="navBar"
      flex
      flex-col
      p="y-3"
      w-52
      max-w-52
      items-center
      bg-card
    >
      <!-- App标题 -->
      <div flex items-center justify-center gap-3 p="b-5">
        <div i-carbon-chart-bubble-packed w-10 h-10></div>
        <div text-2xl>TauriG4</div>
      </div>
      <!-- 导航栏 -->
      <div flex flex-col w-full relative overflow-hidden>
        <!-- 指示条 -->
        <div
          absolute
          w-full
          ml-3
          class="h-1/4"
          top-0
          rounded="xl r-none"
          bg-back
          ref="navTab"
        ></div>
        <div
          v-for="(item, index) in navBarItem"
          flex
          items-center
          gap-3
          p="y-3 x-3"
          ml-3
          z-50
          @click="navToPage(index)"
        >
          <div :class="item.icon" w-6 h-6></div>
          <div>{{ item.name }}</div>
        </div>
      </div>
      <!-- 占位 -->
      <div flex flex-grow></div>
      <!-- 用户 -->
      <div flex items-center gap-3 p="x-2 t-3" border="t back" w-full>
        <img w-10 h-10 rounded-full src="/assets/avatar_male.png" />
        <div flex flex-col>
          <div text-sm font-bold>Roy</div>
          <div text-xs op50 whitespace-nowrap>Admin Account</div>
        </div>
        <div
          i-carbon-logout
          flex
          flex-grow
          justify-end
          hover:op100
          op50
          cursor-pointer
        ></div>
      </div>
    </div>
    <!-- 路由 -->
    <RouterView overflow-hidden />
  </main>
</template>
