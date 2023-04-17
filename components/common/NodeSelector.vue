<template>
  <el-select :model-value="modelValue" :placeholder="props.placeholder" style="width: 200px" filterable clearable
    @change="onChange">
    <template #prefix>
      <el-icon>
        <Cpu />
      </el-icon>
    </template>
    <el-option v-for="node in activeNodes.labels" :key="node.value" :label="node.label" :value="node.value" />
  </el-select>
</template>

<script setup lang="ts">
import { Cpu } from '@element-plus/icons-vue';
const activeNodes = useActiveNodes()

const props = defineProps<{ modelValue: string; placeholder: string }>();
const emits = defineEmits<{ (e: 'update:modelValue', text: string): void }>();

const onChange = (selected: string) => {
  emits('update:modelValue', selected);
};
</script>
