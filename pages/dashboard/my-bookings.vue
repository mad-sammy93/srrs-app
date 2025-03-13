<template>
  <div>

    <pre>{{ rooms }}</pre>
    <!-- <WidgetCalendar /> -->
</div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/stores/roomStore'

const roomStore = useRoomStore()
const rooms = computed(() => roomStore.roomList)

onMounted(() => {
  const params = {
    myBookingsOnly: true,
    searchTerm: 'Excellence',
    pageNo: 1,
    limit: 10
  }
  roomStore.fetchBookedMeetingRooms(params)
})



useHead({ title: 'My Bookings' })
definePageMeta({
  middleware: ['auth'],
})

</script>