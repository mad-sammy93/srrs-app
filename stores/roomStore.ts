import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

interface RoomItem {
  id: number
  agenda: string
  meetingDate: string
  startDateTime: string
  endDateTime: string
  isRecurring: boolean
  createdAt: string
  room: {
    id: number
    roomName: string
    hexColor: string
  }
  paxCount: number
}

export const useRoomStore = defineStore('room', () => {

  const authStore = useAuthStore()
  const roomList = ref<RoomItem[]>([])

  const fetchBookedMeetingRooms = async (params: {
    myBookingsOnly?: boolean
    pageNo: number
    limit: number
    fromDate?: string
    toDate?: string
    status?: string
    searchTerm?: string
  }) => {
    try {
      const token = authStore.token // Get token from auth store

      // Convert params to a Record<string, string>
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        )
      ).toString()

      const response = await fetch(`/api/booked-meeting-rooms?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '' // Add token if available
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data);

        roomList.value = data
      }

      if (!response.ok) throw new Error('Failed to fetch meeting rooms')

      return await response.json()
    } catch (err) {
      console.error('Error fetching meeting rooms:', err)
      return null
    }
  }

  return { roomList, fetchBookedMeetingRooms }
})
