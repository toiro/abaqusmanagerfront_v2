<template>
  <el-select :model-value="modelValue" :placeholder="props.placeholder" style="width: 200px" filterable clearable
    @change="onChange">
    <template #prefix>
      <el-icon>
        <UserFilled />
      </el-icon>
    </template>
    <el-option v-for="user in users" :key="user.value" :label="user.label" :value="user.value" />
  </el-select>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
const { data: users } = await rndHelper.loadUserIndex();

const props = defineProps<{ modelValue: string; placeholder: string }>();
const emits = defineEmits<{ (e: 'update:modelValue', text: string): void }>();

const onChange = (selected: string) => {
  emits('update:modelValue', selected);
};
</script>
