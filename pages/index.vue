<template>
  <div>
    <h1 class="text-4xl text-white ">Welcome</h1>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth',
  layout: 'auth'
})

onMounted(() => {
  setTimeout(() => {
    if(authStore.isAuthenticated){
      navigateTo('/dashboard')
    }else{
      navigateTo('/auth/login')
    }
    
  }, 2000)
})
</script>

<style scoped>

</style>