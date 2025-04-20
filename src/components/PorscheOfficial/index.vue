<template>
  <div class="relative">
    <el-input v-model="code" placeholder="code" class="mr-4 !w-36" />
    <el-button circle @click="handleConfirm">
      <el-icon><Search /></el-icon>
    </el-button>
    <el-button circle @click="code = ''">
      <el-icon><RefreshLeft /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { open } from '@tauri-apps/plugin-shell'
import { ElMessage } from 'element-plus'
const preFix = 'https://configurator.porsche.com/zh-CN/model/'
const code = ref('')

const handleConfirm = async () => {
  const url = preFix + code.value
  try {
    await open(url)
  } catch (error) {
    console.error(error)
    ElMessage.error('无法打开浏览器')
  }

  //   window.open(url, '_blank')
}
</script>
