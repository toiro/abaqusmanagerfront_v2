<template>
  <NuxtLayout>
    <div>
      <h1>Admin Configuration</h1>
      <div v-if="!isAuthenticated">
        <el-form ref="authFormRef" :model="authForm" label-width="120px" @submit.native.prevent="authenticate">
          <el-form-item label="Password" prop="password">
            <el-input v-model="authForm.password" type="password" style="width:300px"
              placeholder="Input password for high priority." show-password :prefix-icon="Lock" />
          </el-form-item>
          <el-button type="primary" @click="authenticate">
            Continue
          </el-button>
        </el-form>
      </div>
      <!-- 設定画面 -->
      <div v-else>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="User Editor" name="user-editor">
            <UserEditor />
          </el-collapse-item>
          <el-collapse-item title="Node Editor" name="node-editor">
            <NodeEditor />
          </el-collapse-item>
          <el-collapse-item title="Settings" name="settings">
            <SettingsEditor />
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus';
import { Lock } from '@element-plus/icons-vue';
import UserEditor from '~~/components/admin/UserEditor.vue';
import NodeEditor from '~~/components/admin/NodeEditor.vue';
import SettingsEditor from '~~/components/admin/SettingsEditor.vue';

const authFormRef = ref<FormInstance>()
const authForm = reactive({
  password: ''
})
const isAuthenticated = ref(false)
async function authenticate() {
  if (isAuthenticated.value) {
    return
  }
  isAuthenticated.value = await $fetch('/api/back/auth', {
    method: 'POST',
    body: {
      name: 'admin',
      pass: authForm.password
    }
  }) as boolean
  if (isAuthenticated.value) {
    ElMessage({
      message: 'Authentication Succeeded!',
      type: 'success',
    })
  } else {
    ElMessage({
      message: 'Authentication Failed!',
      type: 'warning',
    })
  }
}

const activeNames = ref<string[]>([])


</script>
