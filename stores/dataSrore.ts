import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Item {
  id: number
  name: string
  description?: string
}

export const useDataStore = defineStore('users', () => {
  const users = ref<Item[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchUsers = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await $fetch<Item[]>('/api/users') // API call
      users.value = response
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { users, loading, error, fetchUsers }
})
