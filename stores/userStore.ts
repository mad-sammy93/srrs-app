import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import type { UserItem } from '@/types'

export const useUserStore = defineStore('users', () => {
  const authStore = useAuthStore()
  const token = authStore.token
  const usersList = ref<UserItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)  

  const fetchUsers = async (params: { pageNo: number; limit: number; userStatusId?: number })=> {
    loading.value = true
    try { 
      const response = await $fetch<UserItem[]>(`/api/users?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '' // Add token if available
          }
        }
      ) // Updated endpoint
      usersList.value = response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { usersList, loading, error, fetchUsers }
})
