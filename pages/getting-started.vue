<script setup lang="ts">
const { data } = await useAsyncData('hello', () => queryContent('/getting-started').findOne())
</script>

<template>
  <NuxtLayout>
    <template #default>
      <div class="markdown-body">
        <ContentRenderer :value="data ?? undefined" />
      </div>
    </template>
  </NuxtLayout>
</template>