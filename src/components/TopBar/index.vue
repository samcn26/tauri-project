<template>
  <div>
    <div class="w-full h-15 flex items-center p-4">
      <el-icon class="mr-auto cursor-pointer" @click="toggleMenu">
        <component :is="isMenuExpanded ? Fold : Expand" />
      </el-icon>
      <el-button class="ml-auto" type="primary" circle @click="$router.push('/settings')">
        <el-icon>
          <Setting />
        </el-icon>
      </el-button>
    </div>
    <el-divider class="!m-0"></el-divider>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold, Setting } from '@element-plus/icons-vue'

const props = defineProps<{
  isMenuExpanded: boolean
}>()

const emit = defineEmits(['update:isMenuExpanded'])

const toggleMenu = () => {
  emit('update:isMenuExpanded', !props.isMenuExpanded)
}
</script>
