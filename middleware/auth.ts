// import { useAuthStore } from "@/stores/authStore";
// import { useRouter } from "vue-router";

// export async function refreshAccessToken() {
//   const authStore = useAuthStore();
//   const router = useRouter();

//   interface RefreshResponse {
//     token: string;
//     refreshToken: string;
//   }

//   if (!authStore.refreshToken) {
//     router.push("/auth/login");
//     return null;
//   }

//   try {
//     const response = await $fetch("/api/auth/refresh", {
//       method: "POST",
//       body: { refreshToken: authStore.refreshToken },
//     }) as RefreshResponse;;

//     authStore.setTokens(response.token, response.refreshToken);
//     return response.token;
//   } catch (error) {
//     authStore.clearTokens();
//     router.push("/auth/login");
//     return null;
//   }
// }

import { useAuthStore } from '@/stores/authStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // logMessage('to.path');

  const authStore = useAuthStore();
  const refreshToken = useCookie('refreshToken');
  //if you go to login or signup with token existing, redirect to home
  if (to.path === '/auth/login' || to.path === '/auth/signup') {
    if (authStore.token) {
      return navigateTo('/');
    }
  }
  // Check if access token exists
  if (authStore.token) {
    // logMessage('Access token exists');
    authStore.refreshAuthToken();

    return;
  }

  // If no access token but refresh token exists, try refreshing
  if (refreshToken.value) {
    logMessage('Refreshing access token...', 'success');

    try {
      const success = await authStore.refreshAuthToken(); // Ensure refreshAuthToken returns a success status
      if (success) {
        logMessage('Access token refreshed successfully');
        return;
      } else {
        logMessage('Token refresh failed');
      }
    } catch (error) {
      logMessage('Error refreshing token:' + error, 'error');
    }
  }


  // Clear tokens and redirect to login if refresh fails or no tokens exist
  // console.log('Redirecting to login...');
  logMessage('Redirecting to login...', 'warning');
  authStore.clearTokens();
  return navigateTo('/auth/login');
});
