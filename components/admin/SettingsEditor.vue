<template>
  <el-form>
    <el-form-item label="Available Licence Token">
      <el-input-number v-model="settings.availableTokenCount" :max="1000" :min="0" />
    </el-form-item>
    <el-form-item label="Licence Server">
      <NodeSelector v-model="settings.licenseServer.hostname" placeholder="Select Node" />
    </el-form-item>
    <Button type="primary" :loading="nowSaving" @click="invokeSave">
      Save
    </Button>
  </el-form>
</template>

<script setup lang="ts">
import { Types, Require_id as WithId } from 'mongoose';
import NodeSelector from '../common/NodeSelector.vue';
import { ISetting as ISettingWithApplyingFlag } from '~/sharedDefinitions/model/setting';

type ISetting = Omit<ISettingWithApplyingFlag, 'onApplying'>

const settings = reactive<ISetting>({
  availableTokenCount: 0,
  licenseServer: { hostname: '' },
})

const id = ref<Types.ObjectId>()
const nowLoading = ref(false)
async function loadSettings() {
  nowLoading.value = true
  try {
    const response = await $fetch<WithId<ISetting>>('/api/back/settings/applying')
    id.value = response._id
    settings.availableTokenCount = response.availableTokenCount
    settings.licenseServer = response.licenseServer
  } finally {
    nowLoading.value = false
  }
}
loadSettings()

const nowSaving = ref(false)
async function invokeSave() {
  nowSaving.value = true
  try {
    await $fetch(`/api/back/settings/${id.value?.toString()}`,
      {
        method: 'POST',
        body: settings
      })
  } finally {
    nowSaving.value = false
  }
  loadSettings()
}

</script>
