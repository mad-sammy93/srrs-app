<template>
  <div>
    <UISplitLayout >
      <template #left>
        <UIContainerForm>
          <slot />
        </UIContainerForm>
      </template> 
      <template #right>
        <UIJumbotron />
      </template>
    </UISplitLayout>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>