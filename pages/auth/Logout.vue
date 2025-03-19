<template>
  <div>
    <h3 v-show="logout">Please wait.Logging you out..</h3>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const logout  = () => {

   authStore.logout().then(() => {
    navigateTo('/auth/login')
})
}

logout()
</script>

