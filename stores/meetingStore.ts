import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';
import type { Meeting, FetchMeetingResponse, FetchMeetingParams, EditBookedMeetingRoomFormData, AddBookingFormData, BookMeetingRoomResponse, FetchBookingWIthIdResponse } from '@/types'


export const useMeetingStore = defineStore('meetingStore', () => {
  const authStore = useAuthStore();
  const bookings = ref<Meeting[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalPages = ref<number>(0);

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
        totalPages.value = response.data.pagination.numberOfPages; // Store total pages from API
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
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        }
      });
      if (!response) throw new Error('Failed to book meeting room')
      return { data: response, error: null }; // Return the response data and null error


    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

  const editBookedMeetingRoom = async (meetingId: number, formData: EditBookedMeetingRoomFormData) => {
    console.log('meetingId store', meetingId);

    try {
      const response = await $fetch<EditBookedMeetingRoomFormData>(`/api/booked-meeting-rooms/${meetingId}`, {
        method: 'PATCH',
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '' // Add token if available
        },
        body: formData
      });
      if (response) {

        console.log('formData Meeting store', response);
        return { data: response, error: null }; // Return the response data and null error
      }
      if (!response) throw new Error('Failed to book meeting room')
    } catch (err: any) {
      error.value = err.message || 'Failed to book meeting room';
    }
  }

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
