import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { Room, FetchRoomResponse } from '@/types'

export const useRoomStore = defineStore('room', () => {
  const authStore = useAuthStore()
  const roomList = ref<Room[]>([])
  const fetchRoomsData = async () => {
    try {
      const response = await $fetch<FetchRoomResponse>('/api/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      })
      roomList.value = response.data.list
      // logMessage('Rooms fetched successfully', 'success')
    } catch (err) {
      // console.error('Error fetching rooms:', err)
      logMessage('Error fetching rooms', 'error')
    }
  }
  return { roomList, fetchRoomsData }
})
