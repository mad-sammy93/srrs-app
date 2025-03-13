import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

interface Meeting {
  id: number;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  room: {
    id: number;
    name: string;
  };
}
interface MeetingResponse {
  status: number;
  data: {list: Meeting[]};
  message: string;
}

export const useMeetingStore = defineStore('meetingStore', () => {
  const authStore = useAuthStore();
  const token = authStore.token;
  const meetings = ref<Meeting[]>([]);
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

      const response = await fetch(`/api/booked-meeting-rooms?${query}`,{
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '' // Add token if available
        }
      });
      if (response.ok) {
        const data = await response.json()
        console.log(data);

        meetings.value = data
      }

      if (!response.ok) throw new Error('Failed to fetch meeting rooms')
      
      // meetings.value = data.value?.data?.list || [];
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch meetings';
    } finally {
      loading.value = false;
    }
  };

  return {
    meetings,
    loading,
    error,
    fetchBookedMeeting,
  };
});
