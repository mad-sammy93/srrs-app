import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { UserDetail, LoginResponse, RefreshResponse, GoogleSSOCallbackResponse } from '@/types'

// interface Logger {
//   type: string
//   message: string | undefined
//   duration: number
// }

export const useAuthStore = defineStore('auth', () => {
  const myDetails = ref<UserDetail | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null);
  const showOtpScreen = ref(false);
  const tempToken = ref<string | null>(null);
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const user = ref<UserDetail | null>(null)
  const qrCode = ref<string | null>(null)
  const step = ref<number>(1) // 🔥 Explicitly defining step
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let refreshingPromise: Promise<boolean> | null = null;

  const setUserDetailsFromToken = (jwtToken: string) => {
    try {
      const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
      myDetails.value = { id: decodedToken.id, fullName: decodedToken.fullName, email: decodedToken.email };
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const setTokens = (newAccessToken: string) => {
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
      window.open('/api/auth/google-sso', '_self', 'noopener,noreferrer');//open in the same tab
    } catch (err: any) {
      logMessage(err.message || 'Login failed.', 'error');
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
      logMessage((err as Error).message || 'SSO callback failed.', 'error');
      throw new Error((err as Error).message || 'SSO callback failed.')
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await useFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })
      console.log('login====>', response.error.value?.data?.message);

      if (response.data.value?.status === 200) {
        if (response.data.value?.data.isTwoFAEnabled) {
          tempToken.value = response.data.value.data.accessToken
          return true // Indicates OTP is needed
        } else {
          setTokens(response.data.value.data.accessToken)
          // console.log(response.data.value?.message);
          logMessage(response.data.value?.message || 'Login successful', 'success');

          return false // No OTP required, user is logged in
        }
      } else {
        logMessage(response.error.value?.data?.message || 'Login failed', 'error');
      }
    } catch (err: any) {
      // logMessage(err.message || 'Login failed.', 'error');
      // throw new Error(err.message || 'Login failed.')
      if (err?.response?._data?.message) {
        logMessage(err.response._data.message, 'error')
        // errorMessage = err.response._data.message; // Extract API error message
      } else if (err?.message) {
        logMessage(err.message, 'error')
        // errorMessage = err.message;
      }
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
      logMessage('You have logged out successfully', 'success');
    } catch (err: any) {
      router.push('/auth/login')
      logMessage(err.message || 'Logout failed.', 'error');
      throw new Error(err.message || 'Logout failed.')
    }
  }

  const refreshAuthToken = async (): Promise<boolean> => {
    if (refreshingPromise) return refreshingPromise;

    refreshingPromise = new Promise((resolve) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(async () => {
        try {
          const response = await $fetch<RefreshResponse>('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (response?.data.accessToken) {
            setTokens(response.data.accessToken);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          logMessage('Failed to refresh token.', 'error');
          navigateTo('/auth/login');
          resolve(false);
        } finally {
          debounceTimer = null;
          refreshingPromise = null;
        }
      }, 1000); // debounce time in ms
    });
    return refreshingPromise;
  };

  const verifyOtp = async (otp: string) => {
    try {
      const response: LoginResponse = await $fetch('/api/auth/2fa/authenticate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tempToken.value}`
        },
        body: { otp }
      })
      logMessage('OTP verification successful', 'success');
      setTokens(response.data.accessToken)
      tempToken.value = null // Clear temp token
    } catch (err: any) {
      // logMessage(err.message || 'OTP verification failed.', 'error');
      // throw new Error(err.message || 'OTP verification failed.')
      if (err?.response?._data?.message) {
        logMessage(err.response._data.message, 'error')
        // errorMessage = err.response._data.message; // Extract API error message
      } else if (err?.message) {
        logMessage(err.message, 'error')
        // errorMessage = err.message;
      }
    }
  }

  // Step 1: Signup and receive QR Code
  const signup = async (email: string, password: string, fullName: string, otp?: string) => {
    try {
      if (otp) {
        const { data, error, status } = await useFetch<{
          status: number
          data: { id: number; accessToken: string }
          message: string
        }>('/api/auth/signup', {
          method: 'POST',
          body: {
            email,
            password,
            fullName,
            otp,
          },
        })
        if (status.value === 'success') {
          logMessage(data.value?.message || 'Signup successful', 'success')
          if (data.value?.data?.accessToken) {
            setTokens(data.value.data.accessToken);
          }
          navigateTo('/')
          return true
        }
        if (status.value === 'error') {
          logMessage(error.value?.data.message.toString() || 'Signup failed', 'error')
          return false
        }
      } else {
        const { data, error, status } = await useFetch<{
          status: number
          data: { id: number; qrCode: string }
          message: string
        }>('/api/auth/signup', {
          method: 'POST',
          body: { email, password, fullName },
        })
        // return 🍍🍍🍍
        if (status.value === 'success') {
          logMessage(data.value?.message || 'Signup successful', 'success',);
          qrCode.value = data.value?.data?.qrCode || null
          user.value = { email, fullName, password }
          step.value = 2 // ✅ Move to 2FA step
        }
        if (status.value === 'error') {
          logMessage(error.value?.data.message.toString() || 'Signup failed', 'error')
          return false
        }
      }
    } catch (err: any) {
      if (err?.response?._data?.message) {
        logMessage(err.response._data.message, 'error')
      } else if (err?.message) {
        logMessage(err.message, 'error')
      }
    }
  }

  const validateToken = () => {
    if (token.value !== null) {
      const payload = JSON.parse(atob(token.value.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } else {
      return false;
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
    validateToken,
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