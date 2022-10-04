<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const navBarItems = $ref([
  { name: '我的账号', path: '/settings/' },
  { name: '个人资料', path: '/settings/profile' },
  { name: '输出信息', path: '/settings/output' },
  { name: '结果', path: '/settings/result' },
  { name: '参数', path: '/settings/parameters' },
  { name: '数据库', path: '/settings/database' }, // TODO添加http请求超时选项

])

let selectNavItem = $ref(0)

const navToSettingContent = (index: number) => {
  selectNavItem = index
  router.push(navBarItems[index].path)
}
</script>

<template>
  <div flex w-full h-full text-sm>
    <!-- 设置NavBar -->
    <div w="1/5" flex flex-col items-end p-3>
      <div flex="~ col" w-45 gap-1>
        <div v-for="item, index in navBarItems" :key="item.name">
          <div v-if="[0, 2, 4].includes(index)" set-nav-info>
            {{ index === 0 ? '用户设置' : index === 2 ? '模拟设置' : index === 4 ? '刻度设置' : '' }}
          </div>
          <div set-nav-btn :class=" { 'bg-card': index === selectNavItem }" @click="navToSettingContent(index)">
            {{ item.name }}
          </div>
          <div v-if="[1, 3].includes(index)" set-nav-divide />
        </div>
      </div>
    </div>
    <!-- 设置内容 -->
    <div flex-1 bg-card p-3>
      <RouterView />
    </div>
  </div>
</template>
