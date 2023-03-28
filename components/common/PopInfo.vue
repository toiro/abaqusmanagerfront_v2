<template>
  <el-popover placement="bottom-start" label="label" :width="500" trigger="hover">
    <template #reference>
      <el-icon size="20" color="#409EFC">
        <InfoFilled />
      </el-icon>
      <el-button type="primary" :icon="InfoFilled" circle />
    </template>
    <template #default>
      <slot></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'


</script>