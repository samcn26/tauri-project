<template>
  <el-menu :default-active="activeIndex" class="el-menu-vertical" :collapse="isCollapse" router>
    <template v-for="item in menuData" :key="item.index">
      <el-menu-item v-if="!item.children" :index="item.url || item.index">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
      <el-sub-menu v-else :index="item.index">
        <template #title>
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.index"
          :index="child.url || child.index"
        >
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export interface MenuItem {
  index: string
  title: string
  icon?: string
  url?: string
  children?: MenuItem[]
}

const props = defineProps<{
  menuData: MenuItem[]
  activeIndex?: string
  isCollapse?: boolean
}>()

const route = useRoute()
const activeIndex = ref('')

// 根据path查找对应的index
const findIndexByPath = (path: string) => {
  const findItem = (items: MenuItem[]): string | undefined => {
    for (const item of items) {
      if (item.url === path) return item.url || item.index
      if (item.children) {
        const childIndex = findItem(item.children)
        if (childIndex) return childIndex
      }
    }
  }
  return findItem(props.menuData)
}

// 初始化时设置 activeIndex
onMounted(() => {
  activeIndex.value = findIndexByPath(route.path) || props.activeIndex || ''
})

// 监听路由变化，更新activeIndex
watch(
  () => route.path,
  (newPath) => {
    const index = findIndexByPath(newPath)
    if (index) {
      activeIndex.value = index
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.el-menu-vertical {
  height: 100vh;
  /* width: v-bind('isCollapse ? "64px" : "200px"'); */
  /* transition: all 0.3s; */
}
</style>
