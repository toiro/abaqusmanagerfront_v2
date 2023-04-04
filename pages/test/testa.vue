<template>
  <el-table ref="multipleTableRef" :data="tableRow" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column label="Name">
      <template #default="scope">
        <el-input v-model="scope.row.name" :disabled="scope.$index !== editingIndex"></el-input>
      </template>
    </el-table-column>
    <el-table-column type="selection" width="55" />
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column property="name" label="Name" width="120" />
    <el-table-column property="address" label="Address" show-overflow-tooltip />
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
      </template>
    </el-table-column>

  </el-table>
  <div style="margin-top: 20px">
    <el-button type="primary" @click="addRow()">
      Create new user
    </el-button>
    <el-button @click="register()">Register</el-button>
    <el-button @click="toggleSelection()">Clear selection</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'

interface User {
  date: string
  name: string
  address: string
  registered: boolean
}

type UserRow = {
  date: string
  name: string
  address: string
  _raw: User
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<UserRow[]>([])
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: UserRow[]) => {
  multipleSelection.value = val
}

function register() {
  multipleSelection.value.forEach((_) => _._raw.registered = true)
  multipleTableRef.value!.clearSelection()
}

function addRow() {
  tableData.push({
    date: '2023-05-03',
    name: 'New',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  })
  editingIndex.value = tableData.length - 1
  ElMessage(String(tableData.length))
}

const tableRow = computed(() =>
  tableData.filter((_) => !_.registered).map((_) => ({
    date: _.date,
    name: _.name,
    address: _.address,
    _raw: _
  } as UserRow))
)

const editingIndex = ref<any | undefined>()
function handleEdit(index: any, row: any) {
  console.log(index)
  editingIndex.value = index
}

const tableData = reactive([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    registered: false
  },
])
</script>
