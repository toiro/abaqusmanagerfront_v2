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
        <!-- <el-menu-item index="tool">
          <el-icon>
            <Odometer />
          </el-icon>
          Tools
        </el-menu-item> -->
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
import { Grid, Setting } from '@element-plus/icons-vue'
import UserSwitcher from '~~/components/UserSwitcher.vue'

const MenuItems = {
  job: 'job',
  tool: 'tool',
  admin: 'admin',
} as const
type MenuItems = (typeof MenuItems)[keyof typeof MenuItems]

const navigationPaths: { [key in MenuItems]: string } = {
  job: '/',
  tool: '/tool',
  admin: '/admin'
}

const route = useRoute()
const activeIndex = computed<MenuItems>(() => {
  const path = route.path
  if (path.startsWith('/tool')) { return MenuItems.tool }
  else if (path.startsWith('/admin')) { return MenuItems.admin }
  else if (path === '/') { return MenuItems.job }
  throw new Error('never')
})

const handleSelect = (key: string, _keyPath: string[]) => {
  // console.log(key, keyPath)
  const selected = key as MenuItems
  return navigateTo({
    path: navigationPaths[selected]
  })
}
</script>
