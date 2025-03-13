import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

interface Item {
 id: number;
 email: string;
 fullName: string;
 userStatusId: number;
}

export const useUserStore = defineStore('users', () => {
  const authStore = useAuthStore()
  const token = authStore.token
  const usersList = ref<Item[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  console.log(token);
  

  const fetchUsers = async (params: { pageNo: number; limit: number; userStatusId?: number })=> {
    loading.value = true
    try { 
      const response = await $fetch<Item[]>(`/api/users?${ params.pageNo ? `pageNo=${params.pageNo}` : '' }${ params.limit ? `&limit=${params.limit}` : '' }${ params.userStatusId ? `&userStatusId=${params.userStatusId}` : '' }`,
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
