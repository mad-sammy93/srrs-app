<template>
  <div class="flex justify-center items-center h-screen">
    <p class="text-lg font-bold">Processing Google SSO...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

definePageMeta({ layout: 'auth' })

onMounted(async () => {
  const code = route.query.code

  if (!code) {
    logMessage('No code found ', 'error')
    return router.push('/login') // Redirect if no code is found
  }

  try {
    await authStore.googleSSOCallback(code)
    logMessage('SSO Login successful.', 'success')
    router.push('/dashboard') // Redirect after successful login
  } catch (error) {
    logMessage(error.message || 'SSO Login failed. Please try again.', 'error')
    router.push('/auth/login') // Redirect on failure
  }
})
</script>
