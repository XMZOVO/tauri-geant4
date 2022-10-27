<script setup lang="ts">
import axios from 'axios'
import { onMounted } from 'vue'

let modelFileSize = $ref(0)

onMounted(async () => {
  await fetchModelFileSize()
})

const clearModelFiles = async () => {
  await axios.get('http://localhost:8080/clearModelFiles')
  await fetchModelFileSize()
}

async function fetchModelFileSize() {
  const res = await axios.get('http://localhost:8080/modelFileSize')
  modelFileSize = res.data.size
}
</script>

<template>
  <div flex flex-col gap-3 w="5/7" relative>
    <div text-xl font-bold>
      数据库
    </div>
    <div flex justify-between items-center>
      <div flex gap-2 items-center>
        <div op60 text-lg>
          清空模型文件缓存
        </div>
        <div text="lg op60">
          <span text-green>{{ modelFileSize }}</span>
          Mb
        </div>
      </div>
      <button bg="card-item" px-10 rounded-md text-lg hover="bg-input" @click="clearModelFiles">
        清空
      </button>
    </div>
  </div>
</template>
