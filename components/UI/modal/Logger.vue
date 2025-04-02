<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed top-5 left-5  text-white px-4 py-3 rounded-md shadow-lg z-50"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-yellow-500 text-yellow-800': type === 'warning',
        'bg-blue-500 text-white': type === 'info',
      }"
    >
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  message: String, // logger message
  type: {
    name: String as PropType<"success" | "error" | "warning" | "info">,
    default: "error",
  },
  duration: { type: Number, default: 3000 }, // Time before fade-out (default: 3s)
});

const show = ref(false);

// Watch for changes in the message and trigger the modal
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      show.value = true;
      setTimeout(() => {
        show.value = false;
      }, props.duration);
    }
  }
);
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
