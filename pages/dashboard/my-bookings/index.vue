<template>
  <div>
    <div class="flex justify-between items-center py-8">
      <h3 class="text-xl text-blue-400 mb-4">My Bookings </h3>
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
      v-model:filter="searchFilter"
      title="My Bookings"
      @fetchPageData="fetchPageData"
      :loading="loading"
    />
    <button class="btn"></button>
  </div>
</template>
<script setup lang="ts">
import { useMeetingStore } from "@/stores/meetingStore";
import type { Meeting } from "@/types";
import { computed, ref, onMounted } from "vue";

const meetingStore = useMeetingStore();
const searchFilter = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = computed(() => meetingStore.totalPages);
const loading = computed(() => meetingStore.loading);

//TODO
// const filteredBookings = computed(() => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

// });
watch(searchFilter, (newFilter) => {
  debounce(() => {
    fetchPageData(currentPage.value, newFilter); // Call the API with debounced delay
  }, 1000); // Adjust debounce delay (500ms in this example)
});

const debounce = (callback: () => void, delay: number) => {
  if (timeoutId) {
    clearTimeout(timeoutId); // Clear the previous timeout
  }
  timeoutId = setTimeout(callback, delay); // Set a new timeout
};

const fetchPageData = (pageNo: number, filter = searchFilter.value) => {
  currentPage.value = pageNo;
  const params = {
    myBookingsOnly: true,
    pageNo: pageNo,
    limit: itemsPerPage.value,
    filter: filter || undefined, // Only include filter if it's not empty
  };
  meetingStore.fetchBookedMeeting(params);
};

onMounted(() => {
  fetchPageData(1)
});

//TODO
// const searchMeetings = (term: string) => {
//   searchFilter.value = term;
// };

const editBookedMeetingRoom = (meeting: Meeting) => {
  // console.log("Editing:", meeting);
  navigateTo(`/dashboard/my-bookings/edit/${meeting.id}`);
};

const cancelBookedMeetingRoom = async (meeting: Meeting, option: string)=> {
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
