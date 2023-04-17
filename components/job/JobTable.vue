<template>
  <client-only>
    <el-table ref="tableRef" v-loading="pending" :data="tableData" style="width: 100%">
      <el-table-column v-for="col in columns" :key="col.label" :label="col.label" :prop="col.prop"
        :sortable="col.sortable" :filters="col.filters" :filter-method="col['filter-method']"
        :formatter="col.formatter" />
      <el-table-column align="right">
        <template #header>
          Actions
          <el-button size="small" circle :loading="pending" @click="refresh()">
            <el-icon>
              <Refresh />
            </el-icon>
          </el-button>
        </template>
        <template #default="scope">
          <JobTableRowAction :index="scope.$index" :job="(scope.row as JobRow).raw"
            @show-detail="(index, job) => showDetail(job)" @delete="emits('jobModified')" />
        </template>
      </el-table-column>
    </el-table>
  </client-only>
  <el-dialog v-if="detailTarget" v-model="detailVisible" :title="'Detail of ' + detailTarget.name" width="60%" draggable>
    <el-tabs v-model="selectedTab" type="border-card" class="job-detail">
      <el-tab-pane name="status" label="Status">
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item label="Status">{{ detailTarget.status.code }}</el-descriptions-item>
          <el-descriptions-item label="Message">{{ detailTarget.status.message }}</el-descriptions-item>
          <el-descriptions-item label="Last Status Update">{{ rndHelper.dateformat(detailTarget.status.at)
          }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ rndHelper.dateformat(detailTarget.createdAt)
          }}</el-descriptions-item>
          <el-descriptions-item label="Execution Directory Path">{{ detailTarget.status.executeDirectoryPath
          }}</el-descriptions-item>
          <el-descriptions-item label="Result Directory Path">{{ detailTarget.status.resultDirectoryPath
          }}</el-descriptions-item>
          <el-descriptions-item label="ID">{{ detailTarget._id }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane v-if="!detailTarget.input.external" label="Script" name="script">
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item label="Json">
            <pre><code>{{ convertToConfig(detailTarget) }}</code></pre>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane v-for="ext of detailShowFileExts" :key="ext" :label="ext" :name="`file-${ext}`">
        <JobOutputFileView :job="detailTarget" :ext="ext as OutputFileExt"
          :show="detailVisible && selectedTab === `file-${ext}`" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { TableInstance } from 'element-plus';
import { ColumnDef, OutputFileExt } from '../utils/Types';
import { JobStatus, JobPriority } from '~/models/api/resources/enums'
import { IJob } from '~~/models/api/job'
import { useActiveUsers } from '~/composables/ActiveUsers';

const emits = defineEmits<{
  (e: 'jobModified'): void
}>()

const tableRef = ref<TableInstance>()

type JobRow = {
  name: string;
  status: JobStatus;
  owner: string;
  node: string;
  priority: JobPriority;
  createdAt: Date;
  raw: IJob;
};

const {
  data: jobs,
  pending,
  refresh: refreshData
} = jobFetch.lazyFetch()

async function refresh() {
  await refreshData()
  tableRef.value!.clearFilter([]) // apply fiter after reflesh
}

defineExpose({
  refresh
})

const tableData = computed<JobRow[]>(() =>
  jobs.value
    ? jobs.value.map(_ => ({
      name: _.name,
      status: _.status.code,
      owner: _.owner,
      node: _.node,
      priority: _.priority,
      createdAt: _.createdAt,
      raw: _
    }))
    : []
)

const activeUsers = useActiveUsers()
const activeNodes = useActiveNodes()
const userFilter = computed(() => {
  // pull up specified user to top
  const sName = useSpecifiedUser().name
  const labels = activeUsers.labels
  if (!labels) return []
  return labels.sort((a, b) =>
    !sName || a.value === b.value ? 0
      : a.value === sName ? -1
        : b.value === sName ? 1
          : 0)
})

const columns = computed<ColumnDef<JobRow>[]>(() => [
  {
    label: 'Name',
    prop: 'name',
    sortable: true
  },
  {
    label: 'Status',
    prop: 'status',
    filters: [...Object.values(JobStatus)].map(_ => ({
      text: _,
      value: _
    })),
    'filter-method': (value, row) => {
      return row.status === value
    }
  },
  {
    label: 'Owner',
    prop: 'owner',
    filters: userFilter.value,
    'filter-method': (value, row) => {
      return row.owner === value
    }
  },
  {
    label: 'Node',
    prop: 'node',
    filters: activeNodes.labels,
    'filter-method'(value, row) {
      return row.node === value
    }
  },
  // Priority
  {
    label: 'Priority',
    prop: 'priority',
    sortable: true,
    formatter: (row: JobRow) => rndHelper.priorityRenderer(row.priority)
  },
  {
    label: 'Created At',
    prop: 'createdAt',
    sortable: true,
    formatter: (row: JobRow) => rndHelper.dateformat(row.createdAt)
  }
])

const selectedTab = ref('status')
const detailTarget = ref<IJob | undefined>()
const detailVisible = ref(false)
const detailShowFileTabs = computed(() => {
  if (!detailTarget.value) return false
  const job = detailTarget.value
  return !([JobStatus.Waiting, JobStatus.Starting] as JobStatus[]).includes(job.status.code) && !job.input.external
})
const detailShowFileExts = computed(() => detailShowFileTabs.value ? Object.values(OutputFileExt) : [])

function showDetail(job: IJob) {
  detailTarget.value = job
  detailVisible.value = true
  selectedTab.value = 'status'
}
function convertToConfig(job: IJob) {
  return JSON.stringify(job,
    (key, value) => {
      if (['_id', '__v', 'createdAt', 'input', 'status', 'priority', 'node', 'owner'].includes(key)) {
        return undefined
      }
      return value
    },
    2)
}

</script>
