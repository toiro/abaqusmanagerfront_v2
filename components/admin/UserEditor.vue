<template>
  <div>
    <client-only>
      <el-table :data="users" :loading="nowLoading">
        <!-- ユーザー名：変更不可-->
        <el-table-column label="Name" prop="name" />
        <!-- 最大同時実行数：変更可能 -->
        <el-table-column label="Max Concurrent Jobs">
          <template #default="scope">
            <el-input-number v-if="scope.$index === editIndex" v-model="editData.maxConcurrentJob" :max="99" :min="1" />
            <span v-else>{{ scope.row.maxConcurrentJob }}</span>
          </template>
        </el-table-column>

        <!-- ボタン -->
        <el-table-column label="Operations">
          <template #default="scope">
            <div v-if="editIndex === scope.$index">
              <el-button :loading="nowRowSaving" type="primary" @click="invokeSave(scope.$index, scope.row)">
                Save
              </el-button>
              <el-button :loading="nowRowDeleting" type="warning" @click="invokeDelete(scope.$index, scope.row)">
                Delete
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
    </client-only>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="registerUser()">
        Register new user
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IUser } from '~~/models/api/user'

// *** Load ***
const users = ref<IUser[]>([])

const nowLoading = ref(false)
async function loadUsers() {
  nowLoading.value = true
  try {
    users.value = await $fetch<IUser[]>('/api/back/users')
  } finally {
    nowLoading.value = false
  }
}
async function refleshCache() {
  await (await rndHelper.loadUserIndex()).refresh;
}
async function reloadUsers() {
  await refleshCache()
  await loadUsers()
}
loadUsers()

// *** Edit ***
const editIndex = ref<number | undefined>()
const editData = reactive<IUser>({
  name: '',
  maxConcurrentJob: 0
})

const nowRowSaving = ref(false)
const nowRowDeleting = ref(false)
const nowRegistering = ref(false)

function startEdit(index: number, row: IUser) {
  editData.name = row.name
  editData.maxConcurrentJob = row.maxConcurrentJob
  editIndex.value = index
}

async function invokeSave(_index: number, row: IUser) {
  if (!editIndex.value) return
  nowRowSaving.value = true
  try {
    const res = await $fetch<IUser>(`/api/back/users/${row.name}`, { method: 'POST', body: { maxConcurrentJob: editData.maxConcurrentJob } })
    users.value[editIndex.value].maxConcurrentJob = res.maxConcurrentJob
    refleshCache()
  } catch (e) {
    MsgBox.debugError(e)
  } finally {
    finishEdit()
    nowRowSaving.value = false
  }
}

async function invokeDelete(_index: number, row: IUser) {
  if (!editIndex.value) return
  // delete user on database
  if (!await MsgBox.confirmWarning(`Delete the user "${row.name}"?`, 'Delete')) {
    return
  }
  // exec delete
  nowRowDeleting.value = true
  try {
    await $fetch(`/api/back/users/${row.name}`, { method: 'DELETE' })
    reloadUsers()
  } catch (e) {
    MsgBox.debugError(e)
  } finally {
    finishEdit()
    nowRowDeleting.value = false
  }
}

function finishEdit() {
  editIndex.value = undefined
}

async function registerUser() {
  const { value } = await ElMessageBox.prompt('Please input new user name', 'Register a user', {
    confirmButtonText: 'Register',
    cancelButtonText: 'Cancel',
    inputPattern:
      /[a-z0-9_]{2,20}/,
    inputErrorMessage: 'Use only lowercase letters, numbers and underscores from 2 to 20 characters long.',
  })
  nowRegistering.value = true
  try {
    await $fetch<Response>(`/api/back/users`, { method: 'POST', body: { name: value } })
    reloadUsers()
  } catch (e) {
    MsgBox.debugError(e)
  } finally {
    nowRegistering.value = false
  }
}
</script>
