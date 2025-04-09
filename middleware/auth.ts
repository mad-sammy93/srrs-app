import { useAuthStore } from '@/stores/authStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // logMessage(from.path);

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
    // Optional: validate token or decode/check expiry
    const isValid = authStore.validateToken?.(); // Optional helper in your store
    logMessage(isValid?.valueOf() ? 'Access token is valid' : 'Access token is invalid', 'success');
    if (!isValid) {
      logMessage('Access token is invalid, trying to refresh...', 'warning');
    } else {
      return;
    }
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
  } else {
    return navigateTo('/auth/login');
  }


  // Clear tokens and redirect to login if refresh fails or no tokens exist
  // console.log('Redirecting to login...');
  // logMessage('Redirecting to login...', 'warning');
  authStore.clearTokens();
  return navigateTo('/auth/login');
});
