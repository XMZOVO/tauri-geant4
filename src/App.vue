<script setup lang="ts">
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
import Collapse from './components/Collapse.vue'

const navTab = ref(null)
const navTabTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const navBarTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const router = useRouter()
const navBarItem = $ref([
  { name: '主页', path: '/', icon: 'i-carbon-home' },
  { name: '概览', path: '/overview', icon: 'i-carbon-chart-rose' },
  { name: '结果', path: '/results', icon: 'i-carbon-result' },
  { name: '设置', path: '/settings', icon: 'i-carbon-settings' },
])

let isLoading = $ref(false)

onMounted(() => {
  navBarTl.from('.navBar', { x: '-100%', duration: 0.5, delay: 0.4 })
  navBarTl.play()
})

const navToPage = async (index: number) => {
  navTabTl.to(navTab.value, { y: `${index * 100}%`, duration: 0.2 })
  await navTabTl.play()
  await router.push(navBarItem[index].path)
}

const executeSimulate = async () => {
  await navBarTl.reverse()
}

const simulationComplete = async (nav: boolean) => {
  navBarTl.play()
  if (nav)
    navTabTl.to(navTab.value, { y: '100%', duration: 0.2 })

  navTabTl.play()
}

// 模拟终止
const simulationStop = () => {
  navBarTl.play()
  navTabTl.play()
}

const onLoading = (flag: boolean) => {
  isLoading = flag
}
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
        <div i-carbon-chart-bubble-packed w-10 h-10 />
        <div text-2xl>
          TauriG4
        </div>
      </div>
      <!-- 导航栏 -->
      <div flex flex-col w-full relative overflow-hidden>
        <!-- 指示条 -->
        <div
          ref="navTab"
          absolute
          w-full
          ml-3
          class="h-1/4"
          top-0
          rounded="xl r-none"
          bg-back
        />
        <div
          v-for="(item, index) in navBarItem"
          :key="item.name"
          flex
          items-center
          gap-3
          p="y-3 x-3"
          ml-3
          z-50
          @click="navToPage(index)"
        >
          <div :class="item.icon" w-6 h-6 />
          <div>{{ item.name }}</div>
        </div>
      </div>
      <!-- 占位 -->
      <div flex flex-grow />
      <!-- 用户 -->
      <div flex items-center gap-3 p="x-2 t-3" border="t card-item" w-full>
        <img w-10 h-10 rounded-full src="/assets/avatar_male.png">
        <div flex flex-col>
          <div text-sm font-bold>
            Roy
          </div>
          <div text-xs op50 whitespace-nowrap>
            Admin Account
          </div>
        </div>
        <div
          i-carbon-logout
          flex
          flex-grow
          justify-end
          hover:op100
          op50
          cursor-pointer
        />
      </div>
    </div>
    <!-- 路由 -->
    <RouterView @execute-simulate="executeSimulate" @simulation-complete="simulationComplete" @on-loading="onLoading" @simulation-stop="simulationStop" />

    <div v-if="isLoading" absolute w-full h-full z-50 bg-back op80 items-center text-txt flex flex-col justify-center transition-all duration-10>
      <div i-eos-icons-bubble-loading h-10 w-10 />
      <div>加载中</div>
    </div>
  </main>
</template>

