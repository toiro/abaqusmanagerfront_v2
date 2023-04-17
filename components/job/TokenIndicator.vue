<template>
  <div v-loading="nowLoading">
    License Tokens in Use
    <PopInfo v-if="stats">
      {{ stats.InUse }} is in Use and {{ stats.Capacity - stats.InUse }} is Available.<br>
      {{ stats.InUseDsls }} tokens is in Use actually according to DSLS.
    </PopInfo>
    <el-progress v-if="stats" :percent="ratio" :color="color" :text-inside="true" :stroke-width="26">
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

// To not block first page loading, set "server: false".
const { data: stats, pending: nowLoading, refresh: _refresh } = useLazyFetch<Stats>('/api/back/stats/license', { server: false })

function refresh() {
  stats.value = null
  _refresh()
}

defineExpose({
  refresh
})

const ratio = computed(() => {
  if (!stats.value || stats.value.Capacity === 0) return 100
  return stats.value.InUse / stats.value.Capacity * 100
})

const color = computed(() => {
  return (ratio.value < 80) ? '#1188ee' : '#ee5533'
})

</script>
