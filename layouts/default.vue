<template>
  <el-container :style="{minHeight: '100vh'}">
    <el-header>
      <TopHeader />
    </el-header>
    <el-main class="container">
      <slot />
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import TopHeader from '~/components/TopHeader.vue'
</script>
