<template>
  <transition name="fade">
    <div
      v-if="logger.message"
      :class="alertClass"
      class="fixed top-5 left-5 text-white px-4 py-3 rounded-md shadow-lg z-50"
    >
      {{ logger.message }}
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";
import { logger } from "@/utils/logger"; // Import the logger state

const alertClass = computed(() => ({
  "bg-green-500 text-white": logger.value.type === "success",
  "bg-red-500 text-white": logger.value.type === "error",
  "bg-yellow-500 text-black": logger.value.type === "warning",
  "bg-blue-500 text-white": logger.value.type === "info",
}));
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
