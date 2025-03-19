<template>
  <div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-3 border">Room Name</th>
            <th class="p-3 border">Date</th>
            <th class="p-3 border">Start Time</th>
            <th class="p-3 border">End Time</th>
            <th class="p-3 border">Booked Date & Time</th>
            <th class="p-3 border">Pax</th>
            <th class="p-3 border">Meeting Agenda</th>
            <th class="p-3 border">Status</th>
            <th class="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(meeting, index) in paginatedMeetings"
            :key="index"
            class="hover:bg-gray-100"
          >
            <td class="p-3 border">{{ meeting.room.roomName }}</td>
            <td class="p-3 border">{{ meeting.startDateTime.slice(0, 10) }}</td>
            <td class="p-3 border">{{ meeting.startDateTime.slice(11, 16) }}</td>
            <td class="p-3 border">{{ meeting.endDateTime.slice(11, 16) }}</td>
            <td class="p-3 border">
              {{ meeting.createdAt.slice(0, 10) }} ,
              {{ meeting.createdAt.slice(11, 16) }}
            </td>
            <td class="p-3 border">{{ meeting.paxCount }}</td>
            <td class="p-3 border">{{ meeting.agenda }}</td>
            <td class="p-3 border">
              <span
                :class="{
                  'text-green-600': meetingStatus[index] === 'Upcoming',
                  'text-blue-600': meetingStatus[index] === 'In Progress',
                  'text-gray-600': meetingStatus[index] === 'Completed',
                }"
              >
                {{ meetingStatus[index] }}
              </span>
            </td>
            <td class="p-3 border">
              <button
                class="text-blue-600 hover:underline mr-2"
                @click="$emit('edit', meeting)"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:underline"
                @click="$emit('cancel', meeting)"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span> Page {{ currentPage }} of {{ totalPages }} </span>

      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, defineEmits } from "vue";
import type { MeetingItem } from "@/types";

const props = defineProps({
  meetings: {
    type: Array as () => MeetingItem[],
    required: true,
  },
});

defineEmits(["edit", "cancel"]);

// Pagination settings
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed: Total pages
const totalPages = computed(() => Math.ceil(props.meetings.length / itemsPerPage));

// Computed: Meetings for the current page
const paginatedMeetings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.meetings.slice(start, end);
});

// Pagination controls
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Compute Meeting Status
const meetingStatus = computed(() => {
  return props.meetings.map((meeting: MeetingItem) => {
    const startDate = new Date(meeting.startDateTime);
    const endDate = new Date(meeting.endDateTime);
    const now = new Date();

    if (now < startDate) return "Upcoming";
    if (now >= startDate && now < endDate) return "In Progress";
    return "Completed";
  });
});
</script>
