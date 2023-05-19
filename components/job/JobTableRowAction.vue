<template>
  <div>
    <el-button @click="emits('showDetail', props.index, props.job)">
      Details
    </el-button>
    <el-button v-if="canBeDeleted(props.job)" type="danger" :loading="nowDeleting" @click="handleDelete()">
      Delete
    </el-button>
    <el-button v-if="canBeTerminated(props.job)" type="warning" :loading="nowTerminating" @click="handleTerminate()">
      Terminate
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { IJob } from '~/sharedDefinitions/model/job'
import { JobStatus } from '~/sharedDefinitions/model/resources/enums'

interface Props {
  index: number,
  job: IJob
}
const props = withDefaults(defineProps<Props>(), {
  index: -1
})

const emits = defineEmits<{
  (e: 'showDetail', index: number, job: IJob): void
  (e: 'delete', index: number, job: IJob): void
  (e: 'terminate', index: number, accepted: boolean): void
}>()

const nowDeleting = ref(false)
const nowTerminating = ref(false)

async function handleTerminate() {
  if (!await MsgBox.confirmWarning('Terminate the job?', 'Terminate')) return

  nowTerminating.value = true
  try {
    const res = await jobFetch.terminate(props.job, nowTerminating)
    if (res.accept) {
      await MsgBox.success('Send terminate Signal...')
    } else {
      await MsgBox.warning('Missed the Job for terminate.')
    }
    emits('terminate', props.index, res.accept)

  } catch (e) {
    await MsgBox.debugError(e)
  } finally {
    nowTerminating.value = false
  }

}
async function handleDelete() {
  if (!await MsgBox.confirmWarning('Delete the job?', 'Delete')) return

  nowDeleting.value = true
  try {
    const res = await jobFetch.delete(props.job, nowDeleting)
    await MsgBox.success(`Job "${res.name}" is deleted.`)
    emits('delete', props.index, res)
  } catch (e) {
    await MsgBox.debugError(e)
  } finally {
    nowDeleting.value = false
  }

}

function canBeDeleted(job: IJob) {
  return ([JobStatus.Waiting, JobStatus.Completed, JobStatus.Failed, JobStatus.Missing, JobStatus.Disposed] as JobStatus[]).includes(
    job.status.code,
  )
}

function canBeTerminated(job: IJob) {
  return ([JobStatus.Running] as JobStatus[]).includes(job.status.code)
}
</script>
