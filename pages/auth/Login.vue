<template>
  <div class="bg-transparent">

    <UIModalLogger :message="logger.message" :type="logger.type"/>
    <form class="min-w-[300px] mx-auto" @submit.prevent="handleSubmit">
      <div v-if="!showOtpScreen">
        <!-- Email Input -->
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            autocomplete="section-red shipping street-address"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light outline-none"
            placeholder="name@example.com"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="*******"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light outline-none"
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
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light outline-none"
            placeholder="Enter OTP"
            required
          />
        </div>
      </div>

      <!-- Error Message -->
      <!-- <p v-if="error" class="relative rounded border-rose-500 p-1 bg-white text-red-500 text-sm mb-3">
        {{ error }}
      </p> -->

      <!-- Login / Verify OTP Button -->

      <div class="flex flex-col gap-3"> 
      <button
        type="submit"
        :disabled="loading"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {{ loading ? "Processing..." : showOtpScreen ? "Verify OTP" : "Sign In" }}
      </button>

      <NuxtLink
        to="/auth/signup"
        class="text-sm text-center font-medium text-gray-500 hover:underline dark:text-gray-400"
        >Don't have an account? Sign up</NuxtLink>
        </div>  
      <!-- Google Sign-In Button -->
      
      <hr class="my-[40px] border-gray-700">
      <button
        type="button"
        @click="handleGoogleLogin"
        :disabled="loading"
        class="w-full mt-3 flex items-center justify-center gap-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg class="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8c0-14.9-1.3-29.2-3.8-43.1H250.3v81.9h134.2c-6 32.4-23.7 59.9-50.3 78.4v65.2h81.2c47.5-43.8 74.6-108.4 74.6-182.4zM250.3 500c67.6 0 124.2-22.4 165.6-60.5l-81.2-65.2c-22.2 15-50.5 23.9-84.4 23.9-65.2 0-120.3-44.1-140-103.5H3.9v64.7C44.8 437.3 140 500 250.3 500zM110.3 303.1c-5.1-15-7.8-31-7.8-47.5s2.8-32.5 7.8-47.5V144H3.9C-8 172.4-16 205.3-16 240s8 67.6 19.9 96h106.4v-32.9zM250.3 100c36.3 0 68.4 12.5 93.9 33.1l69.7-69.7C374.5 22.4 317.9 0 250.3 0 140 0 44.8 62.7 3.9 160.1l106.4 64.7c19.7-59.4 74.8-103.5 140-103.5z"/>
        </svg>
        Sign in with Google
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
const logger = ref({
  message: '' as string | undefined,
  type: 'error',
  duration: 3000,})

const handleSubmit = async () => {
  loading.value = true
  logger.value.message = undefined

  try {
    if (showOtpScreen.value) {
      // OTP Step
      await authStore.verifyOtp(otp.value)
      router.push('/dashboard') // Redirect after OTP verification
    } else {
      // Login Step
      const needsOtp = await authStore.login(form.value)
      if (needsOtp) {
        showOtpScreen.value = true
      } else {
        router.push('/dashboard') // Redirect after successful login
      }
    }
  } catch (err: any) {
    // console.log(err);
    logMessage(err.message || 'Login failed. Please try again.', 'error');
    // logger.value.message = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  loading.value = true
  logger.value.message = undefined

  try {
    await authStore.googleSSOLogin()
    logger.value.type = 'success'
    logger.value.message = 'Login successful.'

    // router.push('/dashboard') // Redirect after successful Google login
  } catch (err: any) {
    logger.value.message = err.message || 'Google login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
