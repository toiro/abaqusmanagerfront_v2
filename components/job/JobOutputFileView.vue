<template>
  <div>
    <el-card v-loading="nowLoading">
      <template #header>
        <div class="card-header">
          <el-button size="small" circle @click="loadContent(true)">
            <el-icon>
              <Refresh />
            </el-icon>
          </el-button>
        </div>
      </template>
      <div v-if="nowLoading" style="color:#666666;">
        loading...
      </div>
      <pre v-else-if="showContent">{{ content }}</pre>
      <div v-else style="color:#888888;">
        No content.
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue';
import { IJob } from '~~/models/api/job';
import { OutputFileExt } from '../utils/Types';

type Props = {
  job: IJob,
  ext: OutputFileExt,
  show: boolean
}

const props = defineProps<Props>()
const nowLoading = ref(false)
const content = ref('')

const showContent = computed(() => props.show && content.value)

watch(props, () => {
  if (props.show) {
    loadContent()
  }
})

async function loadContent(force: boolean = false) {
  if (content.value && !force) { return }

  let newContent = ''
  nowLoading.value = true
  try {
    newContent = String(await $fetch(`/back/jobs/${props.job._id.toString()}/${props.ext}`))
  } finally {
    // this.$Loading.finish()
    content.value = newContent
    nowLoading.value = false
  }

}

</script>