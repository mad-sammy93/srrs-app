<template>
  <div>
    <div class="flex items-center justify-between p-8">
      <h3 class="text-2xl">My Bookings</h3>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="addBooking"
      >
        Book Room
      </button>
    </div>
    <!-- <pre>{{ bookings }}</pre> -->
    <WidgetTable
      :meetings="filteredBookings"
      @edit="editBookedMeetingRoom"
      @cancel="cancelBookedMeetingRoom"
      v-model:filter="searchFilter"
      title="My Bookings"
    />
    <button class="btn"></button>
  </div>
</template>

<script setup lang="ts">
import { useMeetingStore } from '@/stores/meetingStore';
import type { Meeting } from '@/types';
import { computed, ref, onMounted } from 'vue';

const meetingStore = useMeetingStore();
const searchFilter = ref('');
const filteredBookings = computed(() => {
  if (!searchFilter.value) return meetingStore.bookings;
  return meetingStore.bookings.filter((meeting: Meeting) =>
    meeting.room.roomName.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
    meeting.agenda.toLowerCase().includes(searchFilter.value.toLowerCase())
  );
});

onMounted(() => {
  const params = {
    myBookingsOnly: true,
    pageNo: 1,
    limit: 10
  };
  meetingStore.fetchBookedMeeting(params);
});

const searchMeetings = (term: string) => {
  searchFilter.value = term;
};

const editBookedMeetingRoom = (meeting: Meeting) => {
  console.log('Editing:', meeting);
  navigateTo(`/dashboard/my-bookings/edit/${meeting.id}`);
};

const cancelBookedMeetingRoom = (meeting: Meeting) => {
  console.log('Canceling:', meeting);
};

const addBooking = () => {
  navigateTo('/dashboard/my-bookings/add');
};

useHead({ title: 'My Bookings' });

definePageMeta({
  middleware: ['auth'],
});
</script>
