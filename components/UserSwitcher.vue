<template>
  <UserSelector v-model="selected" placeholder="Select User" />
</template>

<script setup lang="ts">
import UserSelector from './common/UserSelector.vue';
const userStore = useUserStore();
const initUser = userStore.name ?? '';
const selected = ref(initUser);
watchEffect(() => {
  userStore.setUser(selected.value);
});
</script>
