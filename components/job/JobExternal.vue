<template>
  <h3>
    Step 1: Arrange job directories and Fetch them.
    <PopInfo>Job directories must be placed below user import directory.</PopInfo>
  </h3>
  <el-form ref="fetchFormRef" :model="fetchForm" :rules="rules" label-width="120px" status-icon>
    <el-form-item label="Owner" prop="owner">
      <UserSelector v-model="fetchForm.owner" placeholder="Select or Fetch for All Users" />
    </el-form-item>
    <el-button type="primary" :loading="nowFetching" @click="fetchDirs">
      Fetch
    </el-button>
  </el-form>
  <el-divider />
  <h3>
    Step 2: Select directories and Register jobs.
    <PopInfo>To register jobs, directory is required.<br>
      Don't place config file.</PopInfo>
  </h3>
  <client-only>
    <el-table ref="dirTableRef" v-loading="nowFetching" :data="tableData" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="(row, index) => !row._disabled" />
      <el-table-column v-for="col in columns" :key="col.label" :label="col.label" :prop="col.prop"
        :sortable="col.sortable" :filters="col.filters" :filter-method="col['filter-method']"
        :formatter="col.formatter" />
    </el-table>
  </client-only>
  <el-divider border-style="dashed" />
  <el-form ref="externalFormRef" :model="externalForm" :rules="rules" label-width="240px" status-icon>
    <el-form-item label="Priority" prop="priority">
      <el-select v-model="externalForm.priority">
        <el-option v-for="p in JobPriority" :key="p" :label="rndHelper.priorityRenderer(p)" :value="p" />
      </el-select> <el-input v-if="externalForm.priority > 3" v-model="externalForm.priorityPassword" type="password"
        style="width:300px" placeholder="Input password for high priority." show-password :prefix-icon="Lock" />
    </el-form-item>
    <el-form-item label="Cpus per Job" prop="cpus">
      <el-input-number v-model="externalForm.cpus" :max="4" :min="1" />
    </el-form-item>
    <el-form-item label="Max Concurrent Jobs" prop="maxConcurrentJobs">
      <el-input-number v-model="externalForm.maxConcurrentJobs" :max="5" :min="1" />
    </el-form-item>

    <el-form-item label="Timeout for Starting(min)" prop="readyTimeout">
      <el-input-number v-model="externalForm.readyTimeout" :max="60" :min="1" />
    </el-form-item>

    <el-button type="primary" :disabled="selectedDir.length === 0" @click="createJobs">
      Register Jobs
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import type { ElTable, FormInstance, FormRules } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import { ColumnDef } from '../utils/Types'
import PopInfo from '../common/PopInfo.vue'
import UserSelector from '~~/components/common/UserSelector.vue'
import { JobPriority } from '~~/models/api/resources/enums'
import { IJob } from '~~/models/api/job'

const emits = defineEmits<{ (e: 'onRegister', v: IJob[]): void }>()
type DirResponse = IJob & { error: unknown, inputfiles: string[], config: string }
type DirData = DirResponse & { registered: boolean }

const rules = reactive<FormRules>({
  owner: [
    {
      required: false,
    }
  ],
  priority: [
    {
      type: 'integer',
      required: true,
      message: 'Select priority.',
      trigger: 'change'
    }
  ],
  cpus: [
    {
      type: 'integer',
      required: true,
      message: 'Input number of CPUs per one abaqus job.',
      trigger: 'blur'
    }
  ],
  maxConcurrentJobs: [
    {
      type: 'integer',
      required: true,
      message: 'Input number of jobs executed at once.',
      trigger: 'blur'
    }
  ],
  readyTimeout: [
    {
      type: 'integer',
      required: true,
      message: 'Input timeout for starting job.',
      trigger: 'blur'
    }
  ],
})

// *** Step 1 ***
const nowFetching = ref<boolean>(false)
const fetchFormRef = ref<FormInstance>()
const fetchForm = reactive({
  owner: useSpecifiedUser().name,
  node: '',
})

const nowCreating = ref<boolean>(false)
const externalFormRef = ref<FormInstance>()
const externalForm = reactive({
  priority: JobPriority.Middle,
  priorityPassword: '',
  cpus: 2,
  maxConcurrentJobs: 1,
  readyTimeout: 30
})

const dirs = ref<DirData[]>([])
const fetchDirs = async () => {
  if (!(await fetchFormRef.value!.validate())) { return }
  nowFetching.value = true
  try {
    const uri = fetchForm.owner
      ? `/api/back/externaljobs?owner=${fetchForm.owner}`
      : '/api/back/externaljobs'
    const response = await $fetch<DirResponse[]>(uri)
    dirs.value = response.map(_ => Object.assign(_, { registered: false }))
  } finally {
    nowFetching.value = false
  }
}

// *** Step 2 ***
type DirRow = {
  _disabled: boolean
  _raw: DirData,
  owner: string,
  node: string,
  inputDir: string
};

const dirTableRef = ref<InstanceType<typeof ElTable>>()
const tableData = computed<DirRow[]>(() =>
  dirs.value
    ? dirs.value.filter((_) => !_.registered).map((dir) => ({
      _disabled: Boolean(dir.error),
      _raw: dir,
      owner: dir.owner,
      node: dir.node,
      inputDir: dir.input && dir.input.sharedDirectory && dir.input.sharedDirectory.path
    })) as DirRow[]
    : []
)

const columns: ColumnDef<DirRow>[] = [
  {
    label: 'Owner',
    prop: 'owner',
    filters: [], // mounted() で初期化
    'filter-method'(value, row) {
      return row.owner === value
    }
  },
  {
    label: 'Node',
    prop: 'node',
    filters: [], // mounted() で初期化
    'filter-method'(value, row) {
      return row.node === value
    }
  },
  {
    label: 'Path of Directory',
    prop: 'inputDir'
  },
]

const selectedDir = ref<DirRow[]>([])
const handleSelectionChange = (val: DirRow[]) => {
  selectedDir.value = val
}

const createJobs = async () => {
  if (externalForm.priority > 3) {
    const auth = await useFetch('/api/back/auth', { method: 'POST', body: { name: 'priority', pass: externalForm.priorityPassword } })
    if (!auth.data) {
      ElMessageBox.alert('Invalid password for High priority.', 'Warning', {
        confirmButtonText: 'OK',
        type: 'warning'
      })
      return
    }
  }

  // uploadRef.value!.submit()
  nowCreating.value = true
  try {
    type IExternalJob = Pick<
      IJob,
      'name' | 'owner' | 'node' | 'description' | 'priority' | 'input'
    >;
    const registered: IJob[] = []
    for (const dirRow of selectedDir.value) {
      const rawData = dirRow._raw
      const newJob: IExternalJob = {
        name: '',
        owner: rawData.owner,
        node: rawData.node,
        description: rawData.description,
        input: rawData.input,
        priority: externalForm.priority,
      }
      if (!newJob.input.external) throw new Error('input.external is invalide.')
      newJob.input.external.cpus = externalForm.cpus
      if (!newJob.input.sharedDirectory) return

      const list = (rawData.inputfiles.length === 1) ?
        [{ name: rawData.name, inputfile: rawData.inputfiles[0] }]
        :
        rawData.inputfiles.map((inputfile, id) => ({
          name: `${rawData.name}-${id + 1}`, inputfile
        }))

      for (const record of list) {
        newJob.name = record.name
        newJob.input.sharedDirectory.inputfile = record.inputfile
        const responseJob = await $fetch<IJob>('/api/back/jobs', { method: 'POST', body: newJob })
        registered.push(responseJob)
      }

      dirRow._raw.registered = true
    }
    emits("onRegister", registered)
  } finally {
    dirTableRef.value!.clearSelection()
    nowCreating.value = false
  }
}
</script>
