<template>
  <div>
    
  </div>
</template>

<!-- 
<script setup lang="ts">
import { useApi } from '~/composables/useApi'

interface Item {
  id: number
  name: string
  description?: string
}

const { data, error, loading, fetchData } = useApi<Item[]>('/api/items')

onMounted(fetchData)
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <ul v-else>
      <li v-for="item in data" :key="item.id">{{ item.name }} - </li>
    </ul>
  </div>
</template> -->
