import { ref } from 'vue'

export function useApi<T>(endpoint: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const fetchData = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await $fetch<T>(endpoint)
      data.value = response
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetchData }
}
