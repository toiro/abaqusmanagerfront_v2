<template>
  <div>
    <el-table :data="nodes" :loading="nowLoading">
      <!-- hostname：変更不可-->
      <el-table-column label="Hostname" prop="hostname" />
      <!-- 最大同時実行数：変更可能 -->
      <el-table-column label="Max Concurrent Jobs">
        <template #default="scope">
          <el-input-number v-if="editIndex === scope.$index" v-model="editData.maxConcurrentJob" :max="99" :min="1" />
          <span v-else>{{ scope.row.maxConcurrentJob }}</span>
        </template>
      </el-table-column>
      <!-- 実行ディレクトリ：変更可能 -->
      <el-table-column label="Path of Directory for Exec Jobs">
        <template #default="scope">
          <el-input v-if="editIndex === scope.$index" v-model="editData.executeDirectoryRoot" type="text" />
          <span v-else>{{ scope.row.executeDirectoryRoot }}</span>
        </template>
      </el-table-column>
      <!-- 結果ディレクトリ：変更可能 -->
      <el-table-column label="Path of Directory for Job Results">
        <template #default="scope">
          <el-input v-if="editIndex === scope.$index" v-model="editData.resultDirectoryRoot" type="text" />
          <span v-else>{{ scope.row.resultDirectoryRoot }}</span>
        </template>
      </el-table-column>
      <!-- 投入ディレクトリ：変更可能 -->
      <el-table-column label="Path of Directory for Import Jobs">
        <template #default="scope">
          <el-input v-if="editIndex === scope.$index" v-model="editData.importDirectoryRoot" type="text" />
          <span v-else>{{ scope.row.importDirectoryRoot }}</span>
        </template>
      </el-table-column>

      <!-- ボタン -->
      <el-table-column label="Operations">
        <template #default="scope">
          <div v-if="editIndex === scope.$index">
            <el-button :loading="nowRowSaving" type="primary" @click="invokeSave(scope.$index, scope.row)">
              Save
            </el-button>
            <el-button @click="finishEdit">
              Cancel
            </el-button>
          </div>
          <div v-else>
            <el-button @click="startEdit(scope.$index, scope.row)">
              Edit
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { INode } from '~/sharedDefinitions/model/node';


// *** Load ***
const nodes = ref<INode[]>([])

const nowLoading = ref(false)
async function loadNodes() {
  nowLoading.value = true
  try {
    nodes.value = await $fetch<INode[]>('/api/back/nodes')
  } finally {
    nowLoading.value = false
  }
}
loadNodes()

// *** Edit ***
const editIndex = ref<number | undefined>()
type ModifiablePropOfNode = Pick<INode, 'maxConcurrentJob' | 'executeDirectoryRoot' | 'resultDirectoryRoot' | 'importDirectoryRoot'>
const editData: ModifiablePropOfNode = reactive({
  maxConcurrentJob: 0,
  executeDirectoryRoot: '',
  resultDirectoryRoot: '',
  importDirectoryRoot: ''
})

function startEdit(index: number, row: INode) {
  editIndex.value = index
  editData.maxConcurrentJob = row.maxConcurrentJob
  editData.executeDirectoryRoot = row.executeDirectoryRoot
  editData.resultDirectoryRoot = row.resultDirectoryRoot
  editData.importDirectoryRoot = row.importDirectoryRoot
}

const nowRowSaving = ref(false)

async function invokeSave(index: number, row: INode) {
  nowRowSaving.value = true
  try {
    const res = await $fetch<INode>(`/api/back/nodes/${row.hostname}`, {
      method: 'POST', body:
      {
        maxConcurrentJob: editData.maxConcurrentJob,
        executeDirectoryRoot: editData.executeDirectoryRoot,
        resultDirectoryRoot: editData.resultDirectoryRoot,
        importDirectoryRoot: editData.importDirectoryRoot
      }
    })
    nodes.value[index].maxConcurrentJob = res.maxConcurrentJob
    nodes.value[index].executeDirectoryRoot = res.executeDirectoryRoot
    nodes.value[index].resultDirectoryRoot = res.resultDirectoryRoot
    nodes.value[index].importDirectoryRoot = res.importDirectoryRoot
  } catch (e) {
    MsgBox.debugError(e)
  } finally {
    finishEdit()
    nowRowSaving.value = false
  }
}

function finishEdit() {
  editIndex.value = undefined
}
</script>
