<template>
  <div>
    <UIJumbotron />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth-ts',
})
</script>