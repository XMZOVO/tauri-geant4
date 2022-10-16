<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/stores/store'

const router = useRouter()
const store = useStore()
const navBarItems = $ref([
  { name: '模拟', path: '/settings/' },
  { name: '渲染', path: '/settings/render' },
  { name: '输出信息', path: '/settings/output' },
  { name: '结果', path: '/settings/result' },
  { name: '参数', path: '/settings/parameters' },
  { name: '数据库', path: '/settings/database' }, // TODO添加http请求超时选项

])

router.push(navBarItems[store.activeSettingPage].path)

const navToSettingContent = (index: number) => {
  store.activeSettingPage = index
  router.push(navBarItems[index].path)
}
</script>

<template>
  <div flex w-full h-full text-sm overflow-hidden>
    <!-- 设置NavBar -->
    <div w="1/5" flex flex-col items-end p-3>
      <div flex="~ col" w-45 gap-1>
        <div v-for="item, index in navBarItems" :key="item.name">
          <div v-if="[0, 4].includes(index)" set-nav-info>
            {{ index === 0 ? '模拟设置' : index === 4 ? '刻度设置' : '' }}
          </div>
          <div set-nav-btn :class=" { 'bg-card': index === store.activeSettingPage }" @click="navToSettingContent(index)">
            {{ item.name }}
          </div>
          <div v-if="[3].includes(index)" set-nav-divide />
        </div>
      </div>
    </div>
    <!-- 设置内容 -->
    <div flex-1 bg-card p-5>
      <RouterView />
    </div>
  </div>
</template>
