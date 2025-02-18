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
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: Record<string, any>): Promise<void> => {
    loading.value = true
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  const fetchUser = async (): Promise<void> => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      try {
        const response = await $fetch<User>('/api/auth/me', {
          headers: { Authorization: `Bearer ${token.value}` }
        })
        user.value = response
      } catch (err) {
        logout()
      }
    }
  }

  return { user, token, loading, error, isAuthenticated, login, logout, fetchUser }
})