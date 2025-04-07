<template>
  <div>
    <UINavBar />
    <div class="flex flex-row justify-between items-start">
      <UIContainerSidebar  v-if="authStore.isAuthenticated"/>
      <slot />
      <div class="w-15"></div>
    </div>
  </div>
  <UIFooter />
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore"
const authStore = useAuthStore();
</script>
