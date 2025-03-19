import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import type { MeetingItem, FetchMeetingResponse, BookMeeting, BookMeetingRoomResponse } from '@/types'


export const useMeetingStore = defineStore('meetingStore', () => {
  const authStore = useAuthStore();
  const token = authStore.token;
  const meetings = ref<MeetingItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch meeting data with dynamic parameters
  const fetchBookedMeeting = async (params: { 
    roomId?: number;
    fromDate?: string;
    toDate?: string;
    status?: string;
    searchTerm?: string;
    myBookingsOnly?: boolean;
    pageNo?: number;
    limit?: number;
  }) => {
    loading.value = true;
    error.value = null;

    // Default values
    const defaultParams = {
      pageNo: 1,
      limit: 10,
    };

    const queryParams = { ...defaultParams, ...params };

    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(queryParams).map(([key, value]) => [key, String(value)])
        )
      ).toString();

      const response = await $fetch<FetchMeetingResponse>(`/api/booked-meeting-rooms?${query}`, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '' // Add token if available
        }
      });
      if (response) {
        const data = await response.data.list
        console.log(data);

        meetings.value = data
      }

      if (!response) throw new Error('Failed to fetch meeting rooms')
      
      // meetings.value = data.value?.data?.list || [];
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch meetings';
    } finally {
      loading.value = false;
    }
  };


  const bookMeetingRoom = async (agenda: string, meetingDate: string, startTime: string, endTime: string, roomId: number, userId: number, memberIds: number[], isRecurring: boolean, recurrencePatternId: number, frequency: number, weekdayId: number) => {
    try {
      const response = await $fetch<BookMeetingRoomResponse>('/api/booked-meeting-rooms', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '' // Add token if available
        },
        body: {
          agenda,
          meetingDate,
          startTime,
          endTime,
          roomId,
          userId,
          memberIds,
          isRecurring,
          recurrencePatternId,
          frequency,
          weekdayId
        }
      });
      if (!response) throw new Error('Failed to book meeting room')
    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

  const editBookedMeetingRoom = async (meetingId: number) => {
    try {
      const response = await $fetch(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '' // Add token if available
        }
      });
      if (!response) throw new Error('Failed to book meeting room')
    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

  return {
    meetings,
    loading,
    error,
    fetchBookedMeeting,
    bookMeetingRoom,
    editBookedMeetingRoom
  };
});
