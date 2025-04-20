<template>
  <el-dialog v-model="visible" width="80%" :before-close="handleClose">
    <CodeDiff
      :old-string="oldString"
      :new-string="newString"
      output-format="side-by-side"
      :style="{ maxHeight: '70vh', overflowY: 'auto' }"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CodeDiff } from 'v-code-diff'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const oldString = ref('')
const newString = ref('')

const open = (oldStr: string, newStr: string) => {
  if (oldStr === newStr) {
    ElMessage.info('新旧内容一致')
    return
  }
  oldString.value = oldStr
  newString.value = newStr
  visible.value = true
}

const handleClose = () => {
  visible.value = false
}

defineExpose({
  open
})
</script>
