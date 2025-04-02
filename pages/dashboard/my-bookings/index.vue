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
    <!-- {{ currentPage }} / {{ totalPages }} -->
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
//   if (!searchFilter.value) return meetingStore.bookings;
//   return meetingStore.bookings.filter(
//     (meeting: Meeting) =>
//       meeting.room.roomName
//         .toLowerCase()
//         .includes(searchFilter.value.toLowerCase()) ||
//       meeting.agenda.toLowerCase().includes(searchFilter.value.toLowerCase())
//   );
// });

const fetchPageData = (pageNo: number) => {
  currentPage.value = pageNo;
  const params = {
    myBookingsOnly: true,
    pageNo: pageNo,
    limit: itemsPerPage.value,
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

const cancelBookedMeetingRoom = (meeting: Meeting, option: string) => {
  meetingStore.deleteBookedMeetingRoom(meeting.id, option);
};

const addBooking = () => {
  navigateTo("/dashboard/my-bookings/add");
};

useHead({ title: "My Bookings" });

definePageMeta({
  middleware: ["auth"],
});
</script>
