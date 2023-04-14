<template>
  <NuxtLayout>
    <div>
      <TokenIndicator ref="tokenIndicator" />
      <el-divider />
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="Job List" :name="TabName.View_Table">
          <JobTable ref="table" @job-modified="reload" />
        </el-tab-pane>
        <el-tab-pane label="Uploade Input File(s)" :name="TabName.Register_Upload">
          <JobUpload @on-create="reload" />
        </el-tab-pane>
        <el-tab-pane label="Import From Directory" :name="TabName.Register_Shared">
          <JobImportFromDirectory @on-register="reload" />
        </el-tab-pane>
        <el-tab-pane label="Use Abaqus Externally" :name="TabName.Register_External">
          <JobExternal @on-register="reload" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import TokenIndicator from '~~/components/job/TokenIndicator.vue';
import JobTable from '~/components/job/JobTable.vue'
import JobUpload from '~/components/job/JobUpload.vue'
import JobImportFromDirectory from '~~/components/job/JobImportFromDirectory.vue'

const TabName = {
  View_Table: "table",
  Register_Upload: "upload",
  Register_Shared: "shared",
  Register_External: "external"
} as const
type TabName = (typeof TabName)[keyof typeof TabName]

const userStore = useSpecifiedUser()
const route = useRoute()

const activeTab = ref<TabName>(TabName.View_Table)
const table = ref<InstanceType<typeof JobTable> | null>(null)
const tokenIndicator = ref<InstanceType<typeof TokenIndicator> | null>(null)

function reload() {
  table.value?.refresh()
  activeTab.value = TabName.View_Table
}

// クエリパラメータ
const queryUserId = route.query.user
if (queryUserId) {
  userStore.setUser(queryUserId as string)
}
</script>
