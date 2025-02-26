<template>
  <div class="bg-transparent">
    <form class="min-w-[300px] mx-auto" @submit.prevent="handleSubmit">
      <div v-if="!showOtpScreen">
        <!-- Email Input -->
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            placeholder="name@example.com"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
          />
        </div>
      </div>

      <!-- OTP Step -->
      <div v-else>
        <div class="mb-5">
          <label for="otp" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter OTP</label>
          <input
            type="text"
            id="otp"
            v-model="otp"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            placeholder="Enter OTP"
            required
          />
        </div>
      </div>

      <!-- Error Message -->
      <p v-if="error" class="relative rounded border-rose-500 p-1 bg-white text-red-500 text-sm mb-3">
        {{ error }}
      </p>

      <!-- Login / Verify OTP Button -->
      <button
        type="submit"
        :disabled="loading"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {{ loading ? "Processing..." : showOtpScreen ? "Verify OTP" : "Sign In" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

definePageMeta({
  layout: 'auth',
})

useHead({ title: 'Sign In' })

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const otp = ref('')
const showOtpScreen = ref(false) // Controls OTP step
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (showOtpScreen.value) {
      // OTP Step
      await authStore.verifyOtp(otp.value)
      router.push('/') // Redirect after OTP verification
    } else {
      // Login Step
      const needsOtp = await authStore.login(form.value)
      if (needsOtp) {
        showOtpScreen.value = true
      } else {
        router.push('/') // Redirect after successful login
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
