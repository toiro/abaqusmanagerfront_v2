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
  <h3>
    Step 2: Select directories and Register jobs.
    <PopInfo>To register jobs, place input file(s) and others in each job directory.<br>
      Config file defines abaqus command options is also required.</PopInfo>
  </h3>
  <client-only>
    <el-table ref="dirTableRef" v-loading="nowFetching" :data="tableData" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="(row, index) => !row._disabled" />
      <el-table-column v-for="col in columns" :key="col.label" :label="col.label" :prop="col.prop"
        :sortable="col.sortable" :filters="col.filters" :filter-method="col['filter-method']"
        :formatter="col.formatter" />
      <el-table-column align="right">
        <template #header>
          Actions
        </template>
        <template #default="scope">
          <el-button @click="showDetail(scope.$index, scope.row)">
            Details
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </client-only>
  <el-dialog v-if="detailTarget" v-model="detailVisible" :title="'Detail of ' + detailTarget.name" width="30%" draggable>
    <p v-if="detailTarget.description">{{ detailTarget.description }}</p>
    <el-descriptions class="margin-top" :column="1" border>
      <el-descriptions-item label="Node">{{ detailTarget.node }}</el-descriptions-item>
      <el-descriptions-item v-if="detailTarget.input" label="Mounted Directory">{{
        detailTarget.input.sharedDirectory?.path }}</el-descriptions-item>
      <el-descriptions-item v-if="detailTarget.error" label="Error">{{ detailTarget.error }}</el-descriptions-item>
      <el-descriptions-item v-if="detailTarget.inputfiles.length > 0" label="Input File(s)">
        <ul>
          <li v-for="f in detailTarget.inputfiles">{{ f }}</li>
        </ul>
      </el-descriptions-item>
      <el-descriptions-item v-if="detailTarget.config" label="Config File">
        <pre><code>{{ detailTarget.config }}</code></pre>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
  <el-form ref="priorityFormRef" :model="priorityForm" :rules="rules" label-width="120px" status-icon>
    <el-form-item label="Priority" prop="priority">
      <el-select v-model="priorityForm.priority">
        <el-option v-for="p in JobPriority" :key="p" :label="rndHelper.priorityRenderer(p)" :value="p" />
      </el-select> <el-input v-if="priorityForm.priority > 3" v-model="priorityForm.priorityPassword" type="password"
        style="width:300px" placeholder="Input password for high priority." show-password :prefix-icon="Lock" />
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
import UserSelector from '~~/components/common/UserSelector.vue'
import PopInfo from '../common/PopInfo.vue'
import { JobPriority } from '~~/models/api/resources/enums'
import { IJob } from '~~/models/api/job'

const emits = defineEmits<{ (e: 'created', v: IJob): void }>()
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
      trigger: 'blur'
    }
  ],
})

// *** Step 1 ***
const nowFetching = ref<boolean>(false)
const fetchFormRef = ref<FormInstance>()
const fetchForm = reactive({
  owner: '',
  node: '',
})

const nowCreating = ref<boolean>(false)
const priorityFormRef = ref<FormInstance>()
const priorityForm = reactive({
  priority: JobPriority.Middle,
  priorityPassword: ''
})

const dirs = ref<DirData[]>([])
const fetchDirs = async () => {
  if (!(await fetchFormRef.value!.validate())) { return }
  nowFetching.value = true
  try {
    const uri = fetchForm.owner
      ? `/api/back/mountedjobs?owner=${fetchForm.owner}`
      : '/api/back/mountedjobs'
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
  // description: string,
  // command: IJob['command'],
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const tableData = computed<DirRow[]>(() =>
  dirs.value
    ? dirs.value.filter((_) => !_.registered).map((dir) => ({
      _disabled: Boolean(dir.error) || dir.inputfiles.length === 0,
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

const detailTarget = ref<DirData | undefined>()
const detailVisible = ref(false)
function showDetail(index: number, row: DirRow) {
  detailTarget.value = row._raw
  detailVisible.value = true
}

const createJobs = async () => {
  if (priorityForm.priority > 3) {
    const auth = await useFetch('/api/back/auth', { method: 'POST', body: { name: 'priority', pass: priorityForm.priorityPassword } })
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

  // uploadRef.value!.submit()
  nowCreating.value = true
  try {
    type IImportedJob = Pick<
      IJob,
      'name' | 'owner' | 'node' | 'description' | 'command' | 'priority' | 'input'
    >;
    const created: IJob[] = []
    for (const dirRow of selectedDir.value) {
      const rawData = dirRow._raw
      const newJob: IImportedJob = {
        name: '',
        owner: rawData.owner,
        node: rawData.node,
        description: rawData.description,
        command: rawData.command,
        input: rawData.input,
        priority: priorityForm.priority,
      }
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
        const responseJob = await $fetch<IJob>('back/jobs', { method: 'POST', body: newJob })
        created.push(responseJob)
      }

      dirRow._raw.registered = true
    }
  } finally {
    multipleTableRef.value!.clearSelection()
    nowCreating.value = false
  }
}
</script>
