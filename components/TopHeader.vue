<template>
  <el-row>
    <el-col :span="18">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="job">
          <el-icon>
            <Grid />
          </el-icon>
          Jobs
        </el-menu-item>
        <el-menu-item index="admin">
          <el-icon>
            <setting />
          </el-icon>
          Admin
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="6">
      <UserSwitcher />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Grid, Setting } from '@element-plus/icons-vue'
import UserSwitcher from '~~/components/UserSwitcher.vue'
import MenuElements from '~~/models/MenuElements'

const navigationPaths: { [key in MenuElements]: string } = {
  job: '/',
  admin: '/admin'
}

const activeIndex = ref<MenuElements>(MenuElements.job)
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  const selected = key as MenuElements
  activeIndex.value = selected
  return navigateTo({
    path: navigationPaths[selected]
  })
}
</script>
