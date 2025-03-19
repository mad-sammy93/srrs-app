<template>
  <div class="flex flex-col items-center justify-between p-8 bg-slate-200">
    <div class="w-full p-8 bg-white border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <NuxtLink to="https://smartshore.com" class="text-white font-medium text-4xl hover:underline dark:text-white"><UIAtomsLogo /></NuxtLink>
      
    </div>  
    <slot />
    <div class="w-full  p-8 bg-transparent ">
    </div>  
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>