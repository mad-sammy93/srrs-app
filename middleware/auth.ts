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
  const authStore = useAuthStore()
  const refreshToken = useCookie('refreshToken') // ✅ Reads refresh token from cookies

  // If access token exists OR refresh token is in cookies, allow access
  if (authStore.token || refreshToken.value) {
    return
  }

  return navigateTo('/auth/login')
})