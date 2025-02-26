import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: number
  name: string
  email: string
}

interface LoginResponse {
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  // const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const user = ref<{ email: string; password: string; fullName: string } | null>(null)
  const qrCode = ref<string | null>(null)
  const step = ref<number>(1) // 🔥 Explicitly defining step
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      // user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
    } catch (err: any) {
      throw new Error(err.message)
    } finally {
      loading.value = false
    }
  }

  // Step 1: Signup and receive QR Code
  const signup = async (email: string, password: string, fullName: string, otp?: string) => {
    try {
      if (otp) {
        const response = await $fetch('/api/auth/signup', {
          method: 'POST',
          body: {
            email,
            password,
            fullName,
            otp,
          },
        })

        if (response) {
          alert('Signup successful! Redirecting...')
          resetAuth() // ✅ Clear store data
          return true
        }
      } else {
        const response = await $fetch<{
          status: number
          data: { id: number; qrCode: string }
          message: string
        }>('/api/auth/signup', {
          method: 'POST',
          body: { email, password, fullName },
        })

        if (response.status === 201) {
          qrCode.value = response.data.qrCode
          user.value = { email, fullName, password }
          step.value = 2 // ✅ Move to 2FA step
        }
      }
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  // Reset store
  const resetAuth = () => {
    user.value = null
    qrCode.value = null
    step.value = 1
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    qrCode,
    step,
    login,
    signup,
    // verifyOTP,
    resetAuth
  }
})