<template>
  <div>
    <h1>{{authStore.isAuthenticated}}</h1>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()



</script>