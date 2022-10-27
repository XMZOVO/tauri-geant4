<script setup lang="ts">
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import gsap from 'gsap'
import { onMounted } from 'vue'
import { useStore } from '~/stores/store'

const store = useStore()
const navBarTl = gsap.timeline({ paused: true, defaults: { duration: 0.2 } })
const router = useRouter()
const navBarItem = $ref([
  { name: '', path: '/', icon: 'i-carbon-home' },
  { name: '', path: '/overview', icon: 'i-carbon-chart-rose' },
  { name: '', path: '/results', icon: 'i-carbon-result' },
  { name: '', path: '/settings', icon: 'i-carbon-settings' },
])

let isLoading = $ref(false)

onMounted(() => {
  navBarTl.from('.navBar', { x: '-100%', duration: 0.5, delay: 0.4 })
  navBarTl.play()
})

const navToPage = async (index: number) => {
  store.selectedTab = index
  await router.push(navBarItem[index].path)
}

const executeSimulate = async () => {
  await navBarTl.reverse()
}

const simulationComplete = async (nav: boolean) => {
  navBarTl.play()
  if (nav)
    store.selectedTab = 1
}

// 模拟终止
const simulationStop = () => {
  navBarTl.play()
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
      w-18
      max-w-52
      items-center
      bg-card
    >
      <!-- App标题 -->
      <div flex items-center justify-center gap-3 p="b-5">
        <div i-carbon-chart-bubble-packed w-8 h-8 />
        <!-- <div text-2xl>
          TauriG4
        </div> -->
      </div>
      <!-- 导航栏 -->
      <div flex flex-col w-full relative overflow-hidden>
        <div
          v-for="(item, index) in navBarItem"
          :key="item.name"
          flex
          justify-center
          items-center
          gap-3
          p="y-3 x-3"
          z-50
          @click="navToPage(index)"
        >
          <div
            :class="[item.icon, index === store.selectedTab ? 'op100' : 'op60 hover-op80']" w-6 h-6
          />
          <!-- <div>{{ item.name }}</div> -->
        </div>
      </div>
      <!-- 占位 -->
      <div flex flex-grow />
      <!-- 用户 -->
      <div flex items-center justify-center p="x-2 t-3" border="t card-item" w-full>
        <div rounded-full w-5 h-5 op80 hover="op100" cursor-pointer i-carbon-earth-southeast-asia-filled />
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

