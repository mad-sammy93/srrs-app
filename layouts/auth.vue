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