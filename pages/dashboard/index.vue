<template>
  <div>
    <div class="relative flex flex-col items-center justify-between p-8">
      <h1 class="text-5xl text-blue-500 mb-4">
        Welcome {{ authStore.myDetails?.fullName }}
      </h1>
      <span class="text-slate-600 text-xl"
        >Room Booking System is a booking application designed for teams.</span
      >
      <button
        class="absolute right-0 top-[50%] translate-y-[-50%] bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="addBooking"
      >
        Book Room
      </button>
    </div>
    <WidgetCalendar
      :meetings="bookings"
      :user-data="users"
    />
    <div class="py-4 mb-5 border-gray-300 border-t border-dotted">
      <div class="flex items-center mt-4 space-x-4">
        <div
          v-for="room in rooms"
          :key="room.id"
          class="flex flex-wrap items-center"
        >
          <span
            class="w-6 h-6 bg-green-200 mr-2 rounded inline-block"
            :style="`background-color: #${room.hexColor}`"
          ></span
          >{{ room.roomName }} Room
        </div>
        <div class="flex flex-wrap items-center">
          <span class="w-6 h-6 mr-2 bg-gray-400 rounded inline-block"></span>Not
          Available
        </div>
        <div class="flex flex-wrap items-center">
          <span class="w-6 h-6 mr-2 bg-purple-200 rounded inline-block"></span
          >Selected Room
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const meetingStore = useMeetingStore();
const roomStore = useRoomStore();
const userStore = useUserStore();

useHead({ title: "Dashboard" });
definePageMeta({
  middleware: ["auth"],
});

const users = computed(() => userStore.usersList);
const bookings = computed(() => meetingStore.bookings);
const rooms = computed(() => roomStore.roomList); //roomStore.fetchRoomsData();

const addBooking = () => {
  navigateTo("/dashboard/my-bookings/add");
};

onMounted(async () => {
  // reset bookings
  meetingStore.bookings = []; // Clearing existing bookings

  const userParams = {
    pageNo: 1,
    limit: 10,
    userStatusId: 1,
  };
  const MeetingParams = {
    myBookingsOnly: false,
    pageNo: 1,
    limit: 100,
  };
  try {
    // console.log("Before fetching, bookings:", meetingStore.bookings);
    await meetingStore.fetchBookedMeeting(MeetingParams); // Ensure data is loaded before proceeding
    // console.log("After fetching, bookings:", meetingStore.bookings)
  } catch (error) {
    console.error("Error fetching meetings:", error);
  }

  // Fetch data on mount
  // meetingStore.fetchBookedMeeting(MeetingParams)
  userStore.fetchUsers(userParams);
  roomStore.fetchRoomsData();
});
</script>

<style scoped>
.e-work-hours {
  background: #fff !important;
  color: #4b0082 !important;
}
.e-work-cells {
  background: #ffe7e7 !important;
}
.e-current-day {
  border: 2px solid #007bff !important;
}
.e-schedule .e-work-cells.e-current-day,
.e-schedule .e-header-cells.e-current-day {
  background-color: #e0f7fa !important; /* Light blue */
  border: 2px solid #0288d1 !important; /* Blue border */
  box-shadow: 0px 0px 10px rgba(2, 136, 209, 0.5);
}
</style>
