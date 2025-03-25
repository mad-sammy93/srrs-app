import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import type { Meeting, FetchMeetingResponse, BookMeeting, BookMeetingRoomResponse } from '@/types'


export const useMeetingStore = defineStore('meetingStore', () => {
  const authStore = useAuthStore();
  const token = authStore.token;
  const bookings = ref<Meeting[]>([]);
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
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      });
      if (response) {
        const data = response.data.list
        console.log(data);

        bookings.value = data
      }

      if (!response) throw new Error('Failed to fetch meeting rooms')

      // bookings.value = data.value?.data?.list || [];
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookings';
    } finally {
      loading.value = false;
    }
  };

  const fetchBookedMeetingWithId = async (meetingId: number) => {
    try {
      const response = await $fetch<BookMeeting>(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'GET',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      })
      if (!response) throw new Error('Failed to fetch meeting room')
      return { data: response, error: null }; // Return the response data and null error
    } catch (err: any) {

    }
  }

  const bookMeetingRoom = async (formData: {
    agenda: string;
    meetingDate: string;
    meetingEndDate?: string;
    startTime: string;
    endTime: string;
    roomId: number;
    userId: number;
    memberIds: number[];
    isRecurring: boolean;
    recurrencePatternId?: number | null;
    frequency?: number | null;
    weekdayId?: number | null;
  }) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) =>
          value !== null && value !== undefined && value !== ''
        )
      );
      const response = await $fetch<BookMeetingRoomResponse>('/api/booked-meeting-rooms', {
        body: cleanData,
        method: 'POST',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      });
      if (!response) throw new Error('Failed to book meeting room')
      return { data: response, error: null }; // Return the response data and null error


    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

  const editBookedMeetingRoom = async (meetingId: number) => {
    try {
      const response = await $fetch(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'PATCH',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      });
      if (!response) throw new Error('Failed to book meeting room')
    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

  const deleteBookedMeetingRoom = async (meetingId: number) => {
    try {
      const response = await $fetch(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      });
      if (!response) throw new Error('Failed to book meeting room')
    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookedMeetingWithId,
    fetchBookedMeeting,
    bookMeetingRoom,
    editBookedMeetingRoom,
    deleteBookedMeetingRoom
  };
});
