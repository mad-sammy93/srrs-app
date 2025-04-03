import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import type { Meeting, FetchMeetingResponse, FetchMeetingParams, EditBookedMeetingRoomFormData, AddBookingFormData, BookMeetingRoomResponse, FetchBookingWIthIdResponse, EditBookedMeetingRoomResponse } from '@/types'


export const useMeetingStore = defineStore('meetingStore', () => {
  const authStore = useAuthStore();
  const bookings = ref<Meeting[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalPages = ref<number>(0);
  const totalItems = ref<number>(0);

  // Fetch meeting data with dynamic parameters
  const fetchBookedMeeting = async (params: FetchMeetingParams) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = { ...params };
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(queryParams).map(([key, value]) => [key, String(value)])
        )
      ).toString();

      const response = await $fetch<FetchMeetingResponse>(`/api/booked-meeting-rooms?${query}`, {
        method: "GET",
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : "",
        },
      });

      if (response) {
        bookings.value = response.data.list;
        totalPages.value = response.data.pagination.numberOfPages;
        totalItems.value = response.data.pagination.totalItemCount;
      } else {
        throw new Error("Failed to fetch meeting rooms");
      }
    } catch (err: any) {
      error.value = err.message || "Failed to fetch bookings";
    } finally {
      loading.value = false;
    }
  };

  const fetchBookedMeetingWithId = async (meetingId: number) => {
    try {
      loading.value = true;
      const { data: meeting } = await $fetch<FetchBookingWIthIdResponse>(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'GET',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      })

      // console.log('error', meeting, status, error);

      if (meeting) {
        console.log('fetchBookedMeetingWithId:', meeting);
        return { data: meeting, error: null };
      }

      if (!meeting) throw new Error('Failed to fetch meeting room')
      return { data: meeting, error: null }; // Return the response data and null error
    } catch (err: any) {

    }
  }
  const bookMeetingRoom = async (formData: AddBookingFormData) => {
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
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
        }
      });

      return { data: response, error: null }; // Return response data if successful

    } catch (err: any) {
      let errorMessage = "Failed to book meeting room"; // Default error

      // Check if error response contains a message
      if (err?.response?._data?.message) {
        errorMessage = err.response._data.message; // Extract API error message
      } else if (err?.message) {
        errorMessage = err.message;
      }

      return { data: null, error: errorMessage }; // Return the error message
    }
  };



  const editBookedMeetingRoom = async (meetingId: number, formData: EditBookedMeetingRoomFormData) => {
    try {
      const response = await $fetch<EditBookedMeetingRoomResponse>(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'PATCH',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
        },
        body: formData
      });

      return { data: response.message, error: null };
    } catch (err: any) {
      // console.log('[CATCH BLOCK ERROR]', err);

      let errorMessage = "Failed to update meeting room";
      if (err?.response?._data?.message) {
        errorMessage = err.response._data.message; // Extract API error message
      } else if (err?.message) {
        errorMessage = err.message;
      }

      return { data: null, error: errorMessage };
    }
  };

  const deleteBookedMeetingRoom = async (meetingId: number, option: string) => {
    try {
      const response = await $fetch(`/api/booked-meeting-rooms/${meetingId}?option=${option}`, {
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
    totalPages,
    error,
    fetchBookedMeetingWithId,
    fetchBookedMeeting,
    bookMeetingRoom,
    editBookedMeetingRoom,
    deleteBookedMeetingRoom
  };
});
