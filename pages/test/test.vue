<template>
  <div>
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
      <el-form-item
        label="Activity zone"
        prop="region"
      >
        <el-select
          v-model="ruleForm.region"
          placeholder="Activity zone"
        >
          <el-option
            label="Zone one"
            value="shanghai"
          />
          <el-option
            label="Zone two"
            value="beijing"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Activity count"
        prop="count"
      >
        <el-select-v2
          v-model="ruleForm.count"
          placeholder="Activity count"
          :options="options"
        />
      </el-form-item>
      <el-form-item
        label="Activity time"
        required
      >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              v-model="ruleForm.date1"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="text-center"
          :span="2"
        >
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker
              v-model="ruleForm.date2"
              label="Pick a time"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="Instant delivery"
        prop="delivery"
      >
        <el-switch v-model="ruleForm.delivery" />
      </el-form-item>
      <el-form-item
        label="Activity type"
        prop="type"
      >
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox
            label="Online activities"
            name="type"
          />
          <el-checkbox
            label="Promotion activities"
            name="type"
          />
          <el-checkbox
            label="Offline activities"
            name="type"
          />
          <el-checkbox
            label="Simple brand exposure"
            name="type"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="Resources"
        prop="resource"
      >
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="Sponsorship" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Activity form"
        prop="desc"
      >
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'

const ruleForm = reactive({
  name: '',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur'
    },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change'
    }
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change'
    }
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change'
    }
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ]
})

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))
</script>
