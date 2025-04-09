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
    await authStore.refreshAuthToken();
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
        logMessage("Failed to fetch bookings", "error");
      }
    } catch (err: any) {
      logMessage(err.message || "Failed to fetch bookings", "error");
    } finally {
      loading.value = false;
    }
  };

  const fetchBookedMeetingWithId = async (meetingId: number) => {
    await authStore.refreshAuthToken();
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
        // console.log('fetchBookedMeetingWithId:', meeting);
        // logMessage('Meeting fetched successfully', 'success')
      }

      if (!meeting) {
        logMessage('Meeting not found', 'error')
      }

      return { data: meeting, error: null }; // Return the response data and null error
    } catch (err: any) {
      logMessage(err.message || 'Failed to fetch meeting', 'error')
    }
  }

  const bookMeetingRoom = async (formData: AddBookingFormData) => {
    await authStore.refreshAuthToken();
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
      logMessage(response.message, 'success')
      return { data: response, error: null }; // Return response data if successful

    } catch (err: any) {
      let errorMessage = "Failed to book meeting room"; // Default error

      // Check if error response contains a message
      if (err?.response?._data?.message) {
        logMessage(err.response._data.message, 'error')
        // errorMessage = err.response._data.message; // Extract API error message
      } else if (err?.message) {
        logMessage(err.message, 'error')
        // errorMessage = err.message;
      }

      return { data: null, error: errorMessage }; // Return the error message
    }
  };



  const editBookedMeetingRoom = async (meetingId: number, formData: EditBookedMeetingRoomFormData) => {

    await authStore.refreshAuthToken();
    try {
      const response = await $fetch<EditBookedMeetingRoomResponse>(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'PATCH',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
        },
        body: formData
      });
      logMessage(response.message, 'success')
      return { data: response.message, error: null };
    } catch (err: any) {
      // console.log('[CATCH BLOCK ERROR]', err);

      let errorMessage = "Failed to update meeting room";
      if (err?.response?._data?.message) {
        errorMessage = err.response._data.message; // Extract API error message
        logMessage(errorMessage, 'error')
      } else if (err?.message) {
        logMessage(errorMessage, 'error')
      }

      return { data: null, error: errorMessage };
    }
  };

  const deleteBookedMeetingRoom = async (meetingId: number, option: string) => {

    await authStore.refreshAuthToken();
    try {
      const response = await $fetch(`/api/booked-meeting-rooms/${meetingId}?option=${option}`, {
        method: 'DELETE',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      });
      if (response) logMessage('Booking deleted successfully', 'success')
      if (!response) logMessage('Failed to delete booking', 'error')
    } catch (err: any) {
      logMessage(err.message || 'Failed to delete booking', 'error')
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
