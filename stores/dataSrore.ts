import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Item {
  id: number
  name: string
  description?: string
}

export const useDataStore = defineStore('data', () => {
  const items = ref<Item[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchItems = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await $fetch<Item[]>('/api/items') // API call
      items.value = response
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchItems }
})
