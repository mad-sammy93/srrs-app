<template>
  <div>
    <div class="flex items-center justify-between p-8">
      <h3 class="text-2xl">My Bookings</h3>
       <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addBooking">Book Room</button>
    </div>
    <!-- <pre>{{ bookings }}</pre> -->
    <WidgetTable  :meetings="bookings" @edit="editBookedMeetingRoom" @cancel="cancelBookedMeetingRoom" />
    <button class="btn "></button>
  </div>
</template>

<script setup lang="ts">
import { useMeetingStore } from '@/stores/meetingStore';
import type { MeetingItem } from '@/types';

const meetingStore = useMeetingStore()
const bookings = computed(() => meetingStore.bookings)

onMounted(() => {
  const params = {
    myBookingsOnly: true,
    pageNo: 1,
    limit: 10
  }
  meetingStore.fetchBookedMeeting(params)
})

const editBookedMeetingRoom = (meeting: MeetingItem) => {
  console.log(meeting)
}
const cancelBookedMeetingRoom = (meeting: MeetingItem) => {
  //check reason for cancel
  console.log(meeting)
}

const addBooking = () => {
  navigateTo('/dashboard/my-bookings/add')
}

useHead({ title: 'My Bookings' })
definePageMeta({
  middleware: ['auth'],
})

</script>