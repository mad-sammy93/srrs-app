import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: number
  fullName: string
  email: string
}

interface LoginResponse {
  status: number;
  data: {
    isTwoFAEnabled: boolean;
    accessToken: string;
  };
  message: string;
}

interface RefreshResponse {
  data: {
    accessToken: string;
  };
  message: string;
}

export const useAuthStore = defineStore('auth', () => {
  const userName = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null);
  const showOtpScreen = ref(false);
  const tempToken = ref<string | null>(null);
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const user = ref<{ email: string; password: string; fullName: string } | null>(null)
  const qrCode = ref<string | null>(null)
  const step = ref<number>(1) // 🔥 Explicitly defining step
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  const setUsernameFromToken = (jwtToken: string) => {
    try {
      const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
      userName.value = { id: decodedToken.id, fullName: decodedToken.fullName, email: decodedToken.email };
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const setTokens = (newAccessToken: string) => {
    token.value = newAccessToken
    localStorage.setItem('token', newAccessToken)
    setUsernameFromToken(newAccessToken);
  };

  const clearTokens = () => {
    token.value = null;
    refreshToken.value = null;
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (response.data.isTwoFAEnabled) {
        tempToken.value = response.data.accessToken
        return true // Indicates OTP is needed
      } else {
        setTokens(response.data.accessToken)
        return false // No OTP required, user is logged in
      }
    } catch (err: any) {
      throw new Error(err.message || 'Login failed.')
    }
  }

  const logout = async () => { //TODO : Fix logout
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      clearTokens()
    } catch (err: any) {
      throw new Error(err.message || 'Logout failed.')
    }
  }


  const refreshAuthToken = async () => {
    try {
      const response = await $fetch<RefreshResponse>('/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      setTokens(response.data.accessToken)
    } catch (err: any) {
      throw new Error(err.message || 'Token refresh failed.')
    }
  }

  const verifyOtp = async (otp: string) => {
    try {
      const response: LoginResponse = await $fetch('/api/auth/2fa/authenticate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tempToken.value}`
        },
        body: { otp }
      })

      setTokens(response.data.accessToken)
      tempToken.value = null // Clear temp token
    } catch (err: any) {
      throw new Error(err.message || 'OTP verification failed.')
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
    userName,
    user,
    token,
    loading,
    error,
    isAuthenticated,
    qrCode,
    step,
    tempToken,
    refreshToken,
    setUsernameFromToken,
    refreshAuthToken,
    setTokens,
    clearTokens,
    login,
    logout,
    signup,
    resetAuth,
    verifyOtp
  }
}, {
  persist: true // Ensures tokens persist across page reloads
})