<template>
  <UserSelector v-model="selected" placeholder="Select User" />
</template>

<script setup lang="ts">
import UserSelector from './common/UserSelector.vue';
const store = useSpecifiedUser();
const initUser = store.name ?? '';
const selected = ref(initUser);
watchEffect(() => {
  store.setUser(selected.value);
});
</script>
