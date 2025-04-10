<template>
  <div>
    <div class="flex justify-between items-center py-8">
      <h3 class="text-xl text-blue-400 mb-4">My Bookings</h3>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="addBooking"
      >
        Book Room
      </button>
    </div>
    <WidgetTable
      :meetings="meetingStore.myBookings"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @edit="editBookedMeetingRoom"
      @cancel="cancelBookedMeetingRoom"
      :totalMeetingCount="totalMeetingCount"
      :filter="filters"
      :rooms="roomStore.roomList"
      title="My Bookings"
      :statusItems="statusItems"
      @fetchPageData="fetchPageData"
      @filterMeetings="filterMeetings"
      :loading="loading"
    />
  </div>
</template>
<script setup lang="ts">
import { useMeetingStore } from "@/stores/meetingStore";
import { useRoomStore } from "@/stores/roomStore";
import type { Meeting } from "@/types";
import { computed, ref, onMounted, watch } from "vue";

const meetingStore = useMeetingStore();
const roomStore = useRoomStore();

const filters = ref({
  toDate: "",
  fromDate: "",
  searchTerm:"",
  roomId: 0, // Initialize roomId as a number
  status: "",
});

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalMeetingCount = computed(() => meetingStore.totalMeetingCount)
const totalPages = computed(() => meetingStore.totalPages);
const loading = computed(() => meetingStore.loading);

let timeoutId: ReturnType<typeof setTimeout> | null = null;

// Debounced watcher for filters
watch(filters, (newFilter) => {
  debounce(() => {
    fetchPageData(currentPage.value, newFilter);
  }, 1000);
}, { deep: true });

const debounce = (callback: () => void, delay: number) => {
  if (timeoutId) {
    clearTimeout(timeoutId); // Clear the previous timeout
  }
  timeoutId = setTimeout(callback, delay); // Set a new timeout
};

const filterMeetings = (filter: { roomId: number; status: string; toDate: string; fromDate: string; searchTerm: string}) => {
  console.log("Filter:", filter);
  
  filters.value = filter; // Set the filters in the parent

  console.log("Filter:", filters.value);
  fetchPageData(1, filter); // Fetch page data with the filters
};

const fetchPageData = (pageNo: number, filter = filters.value) => {
  currentPage.value = pageNo;
  const params = {
  myBookingsOnly: true,
  pageNo,
  limit: itemsPerPage.value,
  ...(filter.searchTerm && { searchTerm: filter.searchTerm }),
  ...(filter.fromDate && { fromDate: filter.fromDate }),
  ...(filter.toDate && { toDate: filter.toDate }),
  ...(filter.roomId && { roomId: Number(filter.roomId) }), // Convert roomId to a number
  ...(filter.status && { status: filter.status }),
};
  meetingStore.fetchBookedMeeting(params);
};
const statusItems = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
]
onMounted(() => {
  fetchPageData(1);

  roomStore.fetchRoomsData();
});

onUnmounted(() => {
});

const editBookedMeetingRoom = (meeting: Meeting) => {
  navigateTo(`/dashboard/my-bookings/edit/${meeting.id}`);
};

const cancelBookedMeetingRoom = async (meeting: Meeting, option: string) => {
  await meetingStore.deleteBookedMeetingRoom(meeting.id, option);
  fetchPageData(1);
};

const addBooking = () => {
  navigateTo("/dashboard/my-bookings/add");
};

useHead({ title: "My Bookings" });

definePageMeta({
  middleware: ["auth"],
});
</script>