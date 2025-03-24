<template>
  <div>
    <div class="relative flex flex-col items-center justify-between p-8">
      <!-- <span class="text-xs text-blue-500 ">TOKEN {{ authStore.token }}</span> -->
      <h1 class="text-5xl text-blue-500 mb-4">Welcome {{ authStore.myDetails?.fullName }}</h1>
      <span class="text-slate-600 text-xl">Room Booking System is a booking application designed for teams.</span>
      <!-- book meeting button -->
      <button class=" absolute right-0 top-[50%] translate-y-[-50%] bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addBooking">Book Room</button>
    </div>
    <WidgetCalendar :meetings="bookings" :user-data="users"/>
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
const bookings = storeToRefs(meetingStore).bookings;

const addBooking = () => {
  navigateTo('/dashboard/my-bookings/add')
}

onMounted(() => {
  // reset bookings
  meetingStore.bookings = [];
  
  const params = {
    pageNo: 1,
    limit: 10,
    userStatusId: 1,
  };
  const MeetingParams = {
    myBookingsOnly: false,
    pageNo: 1,
    limit: 20
  }

// Fetch data on mount
  meetingStore.fetchBookedMeeting(MeetingParams)
  userStore.fetchUsers(params);
});
</script>

<style scoped></style>
