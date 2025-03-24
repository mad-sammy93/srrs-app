import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { Room, FetchRoomResponse } from '@/types'

export const useRoomStore = defineStore('room', () => {

  const authStore = useAuthStore()
  const roomList = ref<Room[]>([])
  ///booked-meeting-rooms?myBookingsOnly=false&pageNo=1&limit=10'

  const fetchRoomsData = async () => {
    try {
      const response = await $fetch<FetchRoomResponse>('/api/rooms', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      })
      console.log(response);

      roomList.value = response.data.list
    } catch (err) {
      console.error('Error fetching rooms:', err)
    } 
  }

  return { roomList, fetchRoomsData }
})
