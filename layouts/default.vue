<template>
  <div>
    <UINavBar />
      <slot />
    <UIFooter />
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
// console.log('api url', config.public.apiBaseUrl ) // config.public.API_URL

// await $fetch(config.public.API_URL + '/api/items')
</script>