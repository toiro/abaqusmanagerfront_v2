<template>
  <el-form>
    <el-form-item label="Available Licence Token">
      <el-input-number v-model="settings['AvailableTokenCount']" :max="1000" :min="0" />
    </el-form-item>
    <Button type="primary" :loading="nowSaving" @click="invokeSave">
      Save
    </Button>
  </el-form>
</template>

<script setup lang="ts">
import type { IConfig } from "~~/models/api/config"

interface Settings {
  AvailableTokenCount: number
}
const settings = reactive<Settings>({
  AvailableTokenCount: 0
})

const nowLoading = ref(false)
async function loadSettings() {
  nowLoading.value = true
  try {
    const response = await $fetch<IConfig[]>('/api/back/configs')
    response.forEach(config => {
      switch (config.key) {
        case 'AvailableTokenCount':
          settings.AvailableTokenCount = parseInt(config.value)
        default:
          break
      }
    })
  } finally {
    nowLoading.value = false
  }
}
loadSettings()

const nowSaving = ref(false)
async function invokeSave() {
  nowSaving.value = true
  try {
    const key = 'AvailableTokenCount'
    await $fetch(`/back/configs/${key}`,
      {
        method: 'POST',
        body: { value: settings[key] }
      })
  } finally {
    nowSaving.value = false
  }
  loadSettings()
}

</script>
