<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    status-icon
  >
    <el-form-item
      label="Activity name"
      prop="name"
    >
      <el-input v-model="ruleForm.name" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'

const ruleForm = reactive({
  name: ''
})

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur'
    },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ]
})
</script>
