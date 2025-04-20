<script setup lang="ts">
import SideMenue, { MenuItem } from './components/SideMenu/index.vue'
import TopBar from './components/TopBar/index.vue'
import { FullScreen } from '@element-plus/icons-vue'
import { ref } from 'vue'

const menuData: MenuItem[] = [
  {
    index: '1',
    title: '首页',
    icon: 'HomeFilled',
    url: '/home'
  },
  {
    index: '2',
    title: '设置',
    icon: 'Setting',
    url: '/settings'
  }
]

const isFullScreen = ref(true)
const isMenuExpanded = ref(true)

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}
</script>

<template>
  <div class="flex h-screen w-screen">
    <!-- 侧边栏 -->
    <SideMenue
      :class="[
        // '!transition-all',
        {
          '!w-0  opacity-0 invisible': isFullScreen
        }
      ]"
      :menuData="menuData"
      :is-collapse="!isMenuExpanded"
    />
    <div class="flex flex-col flex-1 fle overflow-hidden">
      <!-- 顶部栏 -->
      <TopBar
        :class="{ '!h-0 !p-0 opacity-0 invisible': isFullScreen }"
        v-model:is-menu-expanded="isMenuExpanded"
      />
      <!-- 内容区域 -->
      <div class="flex-1 p-4 transition-all overflow-y-auto">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <!-- 放大按钮 -->
  <div class="fixed bottom-4 right-4 z-999">
    <el-button type="primary" :icon="FullScreen" circle @click="toggleFullScreen" />
  </div>
</template>

<style></style>
