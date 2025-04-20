<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    class="curl-table"
    row-class-name="cursor-pointer"
  >
    <el-table-column prop="curl" label="CURL" width="400">
      <template #default="{ row }">
        <div class="flex items-center gap-2 min-h-[200px]">
          <el-checkbox
            v-model="row.isChecked"
            class="mr-2"
            :disabled="
              tableData.filter((item: TableRow) => item.isChecked).length >= 2 && !row.isChecked
            "
          />
          <el-input
            v-model="row.curl"
            type="textarea"
            :rows="2"
            class="flex-1 min-h-[200px]"
            placeholder="Paste curl command here"
            @input="handleCurlChange(row)"
          />
          <div class="flex flex-col gap-2 justify-center ml-4">
            <el-button
              size="small"
              :disabled="row.curl === ''"
              class="!ml-0"
              circle
              :icon="row.isSuccess ? 'CircleCheck' : 'Refresh'"
              :type="row.isSuccess ? 'success' : 'primary'"
              :loading="row.isExecuting"
              @click="handleExecute(row)"
            />
            <el-button
              size="small"
              class="!ml-0"
              circle
              icon="Close"
              @click="handleClearCurl(row)"
            />
            <el-button
              size="small"
              class="!ml-0"
              circle
              icon="Delete"
              @click="handleDeleteRow(row)"
            />
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="payload">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Payload</span>
          <el-button size="small" type="primary" @click="handleDiff('payload')"> Diff </el-button>
        </div>
      </template>
      <template #default="{ row }">
        <div v-if="row?.payload" class="relative">
          <vue-json-pretty :data="row?.payload" class="h-[200px] overflow-y-auto" />
          <el-button
            class="absolute top-0 right-0 m-2 z-999"
            size="small"
            circle
            icon="DocumentCopy"
            @click="doCopy(JSON.stringify(row?.payload))"
          />
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="response">
      <template #header>
        <div class="flex items-center justify-between">
          <span>Response</span>
          <el-button size="small" type="primary" @click="handleDiff('response')"> Diff </el-button>
        </div>
      </template>
      <template #default="{ row }">
        <div v-if="row?.response" class="relative">
          <vue-json-pretty :data="row?.response" class="h-[200px] overflow-y-auto" />
          <el-button
            class="absolute top-0 right-0 m-2 z-999"
            size="small"
            circle
            icon="DocumentCopy"
            @click="doCopy(JSON.stringify(row?.response))"
          />
        </div>
      </template>
    </el-table-column>

    <template #append>
      <div class="p-2 hover:bg-gray-100 cursor-pointer" @click="handleAddRow">
        <el-icon class="text-xl text-gray-400 hover:text-blue-500">
          <Plus />
        </el-icon>
      </div>
    </template>
  </el-table>
  <DiffDialog ref="diffDialogRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { executeCurl } from '@/utils/request'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import DiffDialog from '@/components/DiffDialog/index.vue'

interface TableRow {
  curl: string
  payload: object | null
  response: object | null
  isExecuting: boolean
  isSuccess: boolean
  isChecked?: boolean
}

const { copy, isSupported } = useClipboard()

const getEmptyRow = (): TableRow => ({
  curl: '',
  payload: null,
  response: null,
  isExecuting: false,
  isSuccess: false,
  isChecked: false
})

const tableData = ref<TableRow[]>([getEmptyRow(), getEmptyRow()])

const diffDialogRef = ref()

const handleAddRow = () => {
  tableData.value.push(getEmptyRow())
}

const handleCurlChange = (row: TableRow) => {
  row.isSuccess = false
  row.payload = null
  row.response = null
}

const handleClearCurl = (row: TableRow) => {
  row.isSuccess = false
  row.curl = ''
}

const orderFun = (a: number | string, b: number | string) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' })
}

const orderArrayOfObj = (obj: any) => {
  if (typeof obj === 'string' && obj.includes(',')) return obj.split(',').sort(orderFun).join(',')
  if (typeof obj !== 'object' || obj === null) return obj
  if (obj instanceof Array) return obj.sort(orderFun)
  Object.entries(obj).forEach(([k, v]) => {
    obj[k] = orderArrayOfObj(v)
  })

  return obj
}

const handleExecute = async (row: TableRow) => {
  row.isExecuting = true
  row.isSuccess = false
  try {
    const data = await executeCurl(row.curl, (config) => {
      const payload = config.data
      if (payload) {
        const parsedPayload = JSON.parse(payload)
        row.payload = orderArrayOfObj(parsedPayload)
      }
    })

    row.response = data
    row.isSuccess = true
  } catch (error) {
    row.isSuccess = false
    ElMessage.error('执行失败')
  } finally {
    row.isExecuting = false
  }
}

const handleDeleteRow = (row: TableRow) => {
  const index = tableData.value.findIndex((item) => item === row)
  if (index !== -1) {
    tableData.value.splice(index, 1)
  }
}

const doCopy = (content: string) => {
  if (!isSupported.value) {
    ElMessage.error('浏览器不支持剪贴板功能')
    return
  }
  copy(content).then(() => {
    ElMessage.success('复制成功')
  })
}

const getSelectedRows = (): TableRow[] => {
  const selected = tableData.value.filter((item) => item.isChecked)
  if (selected.length !== 2) {
    ElMessage.warning('请选择两行进行对比')
    return []
  }
  return selected
}

const handleDiff = (type: 'payload' | 'response') => {
  const selected = getSelectedRows()
  if (selected.length === 2) {
    const [first, second] = selected
    const firstData = first[type]
    const secondData = second[type]

    if (firstData && secondData) {
      diffDialogRef.value.open(
        JSON.stringify(firstData, null, 2),
        JSON.stringify(secondData, null, 2)
      )
    } else {
      ElMessage.warning(`请确保两行都有${type === 'payload' ? 'Payload' : 'Response'}数据`)
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-textarea) {
  textarea {
    min-height: 200px !important;
  }
}
</style>
