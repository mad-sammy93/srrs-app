<template>
  <div>
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3335 7H7.66683C6.9315 7 6.3335 7.598 6.3335 8.33333V17.6667C6.3335 18.402 6.9315 19 7.66683 19H18.3335C19.0688 19 19.6668 18.402 19.6668 17.6667V8.33333C19.6668 7.598 19.0688 7 18.3335 7ZM7.66683 17.6667V9.66667H18.3335L18.3342 17.6667H7.66683Z"
        :fill="color"
      />
      <path
        d="M15.4715 12.138L14.5288 11.1953L13.0001 12.724L11.4715 11.1953L10.5288 12.138L12.0575 13.6666L10.5288 15.1953L11.4715 16.138L13.0001 14.6093L14.5288 16.138L15.4715 15.1953L13.9428 13.6666L15.4715 12.138Z"
        :fill="color"
      />
      <circle
        cx="12.5"
        cy="12.5"
        r="12"
        :stroke="color"
      />
    </svg>
  </div>
</template>
<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "350",
  },
  height: {
    type: String,
    default: "70",
  },
  color: {
    type: String,
    default: "#888888",
  },
});
</script>
