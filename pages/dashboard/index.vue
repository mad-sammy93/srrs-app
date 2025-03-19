<template>
  <div>
    <div class="flex flex-col items-center justify-between p-8">
      <!-- <span class="text-xs text-blue-500 ">TOKEN {{ authStore.token }}</span> -->
      <h1 class="text-5xl text-blue-500 mb-4">Welcome {{ authStore.userName?.fullName }}</h1>
      <span class="text-slate-600 text-xl">Room Booking System is a booking application designed for teams.</span>
    </div>
    <WidgetCalendar :meetings="meetings.meetings"  />
    <!-- {{ users.usersList }} -->
      <!-- <pre>{{ meetings.meetings }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const meetingStore = useMeetingStore();
const authStore = useAuthStore();

useHead({ title: 'Dashboard' })
definePageMeta({
  middleware: ['auth'],
});

const userStore = useUserStore();
const users = storeToRefs(userStore);
const meetings = storeToRefs(meetingStore);

onMounted(() => {
  const params = {
    pageNo: 1,
    limit: 10,
    userStatusId: 1,
  };
  const MeetingParams = {
    fromDate: '2024-03-01',
    toDate: '2025-03-31',
    status: 'UPCOMING',
    searchTerm: '',
    pageNo: 1,
    limit: 100
  }

// Fetch data on mount
  meetingStore.fetchBookedMeeting(MeetingParams)
  // userStore.fetchUsers(params);
});
</script>

<style scoped></style>
