<template>
  <el-upload ref="uploadRef" class="input-files" accept=".inp" action="/api/back/inputfiles" name="inputfile" drag
    multiple :auto-upload="false" :on-success="createJob">
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      Drop input file(s) here or <em>click to upload</em>
    </div>
  </el-upload>
  <el-form ref="jobFormRef" :model="jobForm" :rules="rules" label-width="120px" status-icon>
    <el-form-item label="Owner" prop="owner">
      <UserSelector v-model="jobForm.owner" placeholder="Select Job Owner" />
    </el-form-item>
    <el-form-item label="Description" prop="description">
      <el-input v-model="jobForm.description" />
    </el-form-item>
    <el-form-item label="Node" prop="node">
      <NodeSelector v-model="jobForm.node" placeholder="Select Node" />
    </el-form-item>
    <el-form-item label="Priority" prop="priority">
      <el-select v-model="jobForm.priority">
        <el-option v-for="p in JobPriority" :key="p" :label="rndHelper.priorityRenderer(p)" :value="p" />
      </el-select>
    </el-form-item>
    <el-form-item label="CPUs" prop="cpus">
      <el-select v-model="jobForm.cpus">
        <el-option label="1" value="1" />
        <el-option label="2" value="2" />
        <el-option label="4" value="4" />
        <el-option label="8" value="8" />
      </el-select>
    </el-form-item>
    <el-button type="primary" @click="invokeCreate">
      Click to upload
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, FormInstance, FormRules, UploadProps } from 'element-plus'
import mongoose from 'mongoose'
import UserSelector from '~~/components/common/UserSelector.vue'
import NodeSelector from '~~/components/common/NodeSelector.vue'
import { JobPriority } from '~~/models/api/resources/enums'
import { IJob } from '~~/models/api/job'

const emits = defineEmits<{ (e: 'created', v: IJob): void }>()

const nowCreating = ref<boolean>(false)
const uploadRef = ref<UploadInstance>()
const jobFormRef = ref<FormInstance>()
const jobForm = reactive({
  owner: '',
  description: '',
  node: '',
  priority: JobPriority.Middle,
  cpus: 2,
  priorityPasscord: ''
})

const rules = reactive<FormRules>({
  owner: [
    {
      required: true,
      message: 'Please select owner of the job.',
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: false
    }
  ],
  node: [
    {
      required: true,
      message: 'Please select a node on which run the job.',
      trigger: 'blur'
    }
  ],
  priority: [
    {
      type: 'integer',
      required: true,
      message: 'Select priority.',
      trigger: 'blur'
    }
  ],
  cpus: [
    {
      type: 'integer',
      required: true,
      message: 'Select number of CPUs.',
      trigger: 'blur'
    }
  ]
})

type IUploadJob = Pick<
  IJob,
  'name' | 'owner' | 'node' | 'description' | 'command' | 'priority' | 'input'
>;

const invokeCreate = async () => {
  if (!(await jobFormRef.value!.validate())) { return }
  if (jobForm.priority > 3) {
    const auth = await useFetch('/api/back/auth', { method: 'POST', body: { name: 'priority', pass: jobForm.priorityPasscord } })
    if (!auth.data) {
      ElMessageBox.alert('Invalid password for High priority.', 'Warning', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        type: 'warning'
      })
      return
    }
  }

  uploadRef.value!.submit()

}

interface IUploadedInfo {
  id: string,
  filename: string,
}

const createJob: UploadProps['onSuccess'] = async (uploaded: IUploadedInfo) => {
  nowCreating.value = true
  try {
    const newJob: IUploadJob = {
      name: rndHelper.baseName(uploaded.filename),
      owner: jobForm.owner,
      node: jobForm.node,
      description: jobForm.description,
      command: {
        cpus: 2,
        options: []
      },
      priority: jobForm.priority,
      input: {
        uploaded: new mongoose.Types.ObjectId(uploaded.id)
      }
    }
    const { data: created } = await $fetch<{ data: IJob }>('/api/back/jobs', {
      method: 'POST',
      body: newJob,
    })
    emits("created", created)
    // JobDriverInstance.emit(JobDriverEvent.create, created)
  } finally {
    nowCreating.value = false
  }
  uploadRef.value!.clearFiles(['success'])
}

</script>
