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
        <el-menu-item index="gstarted">
          <el-icon>
            <Flag />
          </el-icon>
          Getting Started
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="6">
      <UserSwitcher />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Grid, Setting, Flag } from '@element-plus/icons-vue'
import UserSwitcher from '~~/components/UserSwitcher.vue'

const MenuItems = {
  job: 'job',
  admin: 'admin',
  gstarted: 'gstarted',
} as const
type MenuItems = (typeof MenuItems)[keyof typeof MenuItems]

const navigationPaths: { [key in MenuItems]: string } = {
  job: '/',
  admin: '/admin',
  gstarted: '/getting-started',
}

const route = useRoute()
const activeIndex = computed<MenuItems>(() => {
  function inverse<K extends string, V extends string>(dict: { [key in K]: V }) {
    const ret: { [key: string]: string } = {};
    for (const key in Object.keys(dict)) {
      ret[dict[key as K]] = key;
    }
    return ret;
  }

  const path = route.path
  try {
    const key = inverse(navigationPaths)[path] as MenuItems
    return MenuItems[key] as MenuItems
  } catch (e: any) {
    throw new Error(e)
  }
})

const handleSelect = (key: string, _keyPath: string[]) => {
  // console.log(key, keyPath)
  const selected = key as MenuItems
  return navigateTo({
    path: navigationPaths[selected]
  })
}
</script>
