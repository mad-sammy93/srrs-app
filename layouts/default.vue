<template>
  <div>
    <UINavBar />
    <div class="flex flex-row justify-between items-start">
      <UIContainerSidebar />

      <!-- /sidebar -->
      <slot />
      <div class="w-15"></div>
    </div>
  </div>
  <!-- <UIFooter /> -->
</template>
<script setup lang="ts"></script>
