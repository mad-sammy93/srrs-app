<template>
  <div class="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-300">
    <div
      class="w-full p-4 flex  items-center justify-center"
    >
      <NuxtLink
        to="https://smartshore.com"
        class="text-white font-medium text-4xl hover:underline dark:text-white mb-[40px]"
        >
        <UIAtomsLogo color="#000" width="480" />
      </NuxtLink>
    </div>
    <slot />
    <div class="w-full p-8 bg-transparent"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
