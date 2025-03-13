<template>
  <div>
    <h3 v-show="logout">rEQUEST TO LOGOUT ... pROCESSIONG</h3>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const logout  = () => {
  try{
    const response = authStore.logout()

    response.then(() => {
        localStorage.removeItem('token')
        authStore.$reset()
        navigateTo('/')
    })

  } catch (err: any) {
    
  }
   authStore.logout().then(() => {
  if (process.client) {
    localStorage.removeItem('token')
  }

  setTimeout(() => {
    navigateTo('/auth/login')
  }, 2000)
})
}

logout()
</script>

