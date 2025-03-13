<template>
  <div>
    <WidgetCalendar fromDate="2025-02-18" toDate="2025-02-25" />
    <!-- {{ users.usersList }} -->
      {{ meetings.meetings }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { storeToRefs } from "pinia";

const meetingStore = useMeetingStore();

useHead({ title: 'Dashboard' })
definePageMeta({
  middleware: ['auth'],
});

const userStore = useUserStore();
const users = storeToRefs(userStore);
const meetings = storeToRefs(meetingStore);

onMounted(() => {
  const params = {
    pageNo: 2,
    limit: 10,
    userStatusId: 1,
  };
  const MeetingParams = {
    roomId: 1,
    fromDate: '2024-03-01',
    toDate: '2025-03-31',
    status: 'UPCOMING',
    searchTerm: 'EXCELLENCE',
    pageNo: 1,
    limit: 100
  }

// Fetch data on mount
  meetingStore.fetchBookedMeeting(MeetingParams)
  userStore.fetchUsers(params);
});
</script>

<style scoped></style>
