<template>
  <div>
    {{ filters }}
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
      :meetings="meetingStore.bookings"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @edit="editBookedMeetingRoom"
      @cancel="cancelBookedMeetingRoom"
      :filter="filters"
      title="My Bookings"
      @fetchPageData="fetchPageData"
      @searchMeetings="searchMeetings"
      :loading="loading"
    />
  </div>
</template>
<script setup lang="ts">
import { useMeetingStore } from "@/stores/meetingStore";
import type { Meeting } from "@/types";
import { computed, ref, onMounted, watch } from "vue";

const meetingStore = useMeetingStore();

const filters = ref({
  toDate: "",
  fromDate: "",
  searchTerm:"",
  roomId: 0, // Initialize roomId as a number
  status: "",
});

const currentPage = ref(1);
const itemsPerPage = ref(10);
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

const searchMeetings = (filter: { roomId: number; status: string; toDate: string; fromDate: string; searchTerm: string}) => {
  filters.value = filter; // Set the filters in the parent
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

onMounted(() => {
  fetchPageData(1);
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