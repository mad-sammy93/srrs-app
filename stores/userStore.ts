import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import type { User, FetchUserResponse } from '@/types'

export const useUserStore = defineStore('users', () => {
  const authStore = useAuthStore()
  const token = authStore.token
  const usersList = ref<User[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchUsers = async (params: { pageNo: number; limit: number; userStatusId?: number }) => {
    loading.value = true
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('pageNo', params.pageNo.toString());
      searchParams.append('limit', params.limit.toString());
      if (params.userStatusId !== undefined) {
        searchParams.append('userStatusId', params.userStatusId.toString());
      }
      const response = await $fetch<FetchUserResponse>(`/api/users?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '' // Add token if available
          }
        }
      ) 
      usersList.value = response.data.list
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }
  return { usersList, loading, error, fetchUsers }
})
