import { useAuthStore } from '@/stores/authStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // logMessage(from.path);

  const authStore = useAuthStore();
  const refreshToken = useCookie('refreshToken');
  // Check if access token exists
  if (authStore.token) {
    const isValid = authStore.validateToken?.(); // Optional helper in your store
    if (!isValid) {
      logMessage('Access token is invalid, trying to refresh...', 'warning');
    } else {
      return;
    }
  }

  //if you go to login or signup with token existing, redirect to home
  if (authStore.token && (to.path === '/auth/login' || to.path === '/auth/signup')) {
    console.log('Access token exists, redirecting to home...');

    return navigateTo('/');
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
