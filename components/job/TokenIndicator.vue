<template>
  <div v-loading="nowLoading">
    License Tokens in Use
    <PopInfo>
      {{ stats.InUse }} is in Use and {{ stats.Capacity - stats.InUse }} is Available.<br>
      {{ stats.InUseDsls }} tokens is in Use actually according to DSLS.
    </PopInfo>
    <el-progress :percent="ratio" :color="color" :text-inside="true" :stroke-width="26">
      <span>{{ stats.InUse }} / {{ stats.Capacity }}</span> <el-button :loading="nowLoading" size="small" circle
        @click="refresh()">
        <el-icon>
          <Refresh />
        </el-icon>
      </el-button>

    </el-progress>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import PopInfo from '../common/PopInfo.vue';

interface Stats {
  InUseDsls: number
  InUse: number
  Capacity: number
}

const { data, pending: nowLoading, refresh } = useLazyFetch<Stats>('/api/back/stats/license', {
  default: () => ({
    InUseDsls: 0,
    InUse: 0,
    Capacity: 0
  })
})

const stats = computed(() => {
  if (!data.value) {
    throw new Error('never owing to default value.')
  } else {
    return data.value
  }
})

defineExpose({
  refresh
})

const ratio = computed(() => {
  if (stats.value.Capacity === 0) { return 100 }
  return stats.value.InUse / stats.value.Capacity * 100
})
const color = computed(() => {
  return (ratio.value < 80) ? '#1188ee' : '#ee5533'
})

</script>
