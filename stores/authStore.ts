import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { UserDetail, LoginResponse, RefreshResponse, GoogleSSOCallbackResponse } from '@/types'

interface Logger {
  type: string
  message: string | undefined
  duration: number
}

export const useAuthStore = defineStore('auth', () => {
  const myDetails = ref<UserDetail | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null);
  const showOtpScreen = ref(false);
  const tempToken = ref<string | null>(null);
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const logger = ref<Logger>({
    type: '',
    message: '' as string | undefined,
    duration: 3000
  })
  const user = ref<UserDetail | null>(null)
  const qrCode = ref<string | null>(null)
  const step = ref<number>(1) // 🔥 Explicitly defining step
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  const setUserDetailsFromToken = (jwtToken: string) => {
    try {
      const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
      myDetails.value = { id: decodedToken.id, fullName: decodedToken.fullName, email: decodedToken.email };
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const setTokens = (newAccessToken: string) => {
    console.log('[SET TOKEN]');

    token.value = newAccessToken
    localStorage.setItem('token', newAccessToken)
    setUserDetailsFromToken(newAccessToken);
  };

  const clearTokens = () => {
    token.value = null;
    refreshToken.value = null;
  };

  const googleSSOLogin = async () => {
    try {
      // const response = await $fetch('/api/auth/google-sso');
      window.open('/api/auth/google-sso', '_self', 'noopener,noreferrer');//open in the same tab
      // if (response && response.data.url) {
      //   // Open Google SSO page in a new tab
      //   window.open(response.data.url, '_blank', 'noopener,noreferrer');
      // }
    } catch (err: any) {
      throw new Error(err.message || 'Login failed.');
    }
  };

  const googleSSOCallback = async (code: string) => {
    try {
      const response = await $fetch<GoogleSSOCallbackResponse>('/api/auth/google-sso/callback', {
        method: 'POST',
        body: { code },
      })

      if (response.data.accessToken) {
        setTokens(response.data.accessToken)
      }
    } catch (err) {
      throw new Error((err as Error).message || 'SSO callback failed.')
    }
  }

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
        console.log(response);

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
      router.push('/auth/login')
      throw new Error(err.message || 'Logout failed.')
    }
  }


  const refreshAuthToken = async () => {
    try {
      const response = await $fetch<RefreshResponse>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      if (response?.data.accessToken) {
        // token.value = response.data.accessToken;
        setTokens(response.data.accessToken)

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
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
    } catch (err: any) {
      console.error('Signup failed:', error)
      throw new Error(err.message || 'Signup failed.')
    }
  }

  // Reset store
  const resetAuth = () => {
    user.value = null
    qrCode.value = null
    step.value = 1
  }

  return {
    myDetails,
    user,
    token,
    loading,
    error,
    isAuthenticated,
    qrCode,
    step,
    tempToken,
    refreshToken,
    setUserDetailsFromToken,
    refreshAuthToken,
    setTokens,
    clearTokens,
    login,
    googleSSOLogin,
    googleSSOCallback,
    logout,
    signup,
    resetAuth,
    verifyOtp
  }
}, {
  persist: true // Ensures tokens persist across page reloads
})