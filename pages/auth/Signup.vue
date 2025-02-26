<template>
  <div class="bg-transparent">
    <form class="min-w-[300px] mx-auto" @submit.prevent="authStore.step === 1 ? handleSignup() : handleOTP()">
      <div v-if="authStore.step === 1">
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input type="email" id="email" v-model="email" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" required />
        </div>
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input type="password" id="password" v-model="password"  class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" required />
        </div>
        <div class="mb-5">
          <label for="fullName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
          <input type="text" id="fullName" v-model="fullName" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" required />
        </div>
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="terms"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >I agree with the
            <a
              href="#"
              class="text-blue-600 hover:underline dark:text-blue-500"
              >terms and conditions</a
            ></label
          >
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Continue Signup</button>
      </div>

      <!-- Step 2: 2FA Verification -->
      <div v-else-if="authStore.step === 2">
        <div class="mb-5">
          <p class="text-center text-gray-900 dark:text-white">Scan this QR code for 2FA</p>
          <img :src="authStore.qrCode as string | undefined" alt="2FA QR Code" class="mx-auto w-40 h-40" />
        </div>
        <div class="mb-5">
          <label for="otp" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter OTP</label>
          <input type="number" id="otp" v-model="otp" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"  required />
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verify & Complete Signup</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Sign Up' })

const router = useRouter()
const authStore = useAuthStore()

// Form Data
const email = ref('')
const password = ref('')
const fullName = ref('')
const otp = ref('')

const loading = ref(false)
const error = ref<string | null>(null)

// Step 1: Handle Signup
const handleSignup = async () => {
  loading.value = true
  error.value = null

  try {
    const success = await authStore.signup(email.value, password.value, fullName.value)
   
    if (success) {
      authStore.step = 2
    }
  } catch (error) {


    console.error(error)
  }
}

// Step 2: Verify OTP
const handleOTP = async () => {
  const success = await authStore.signup(email.value, password.value, fullName.value ,String(otp.value) )
  if (success) {
    router.push('/auth/signin')
  }
}
</script>
